import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, onSnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from '../firebase';

export function useBooks(uid) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setBooks([]); setLoading(false); return; }
    const q = query(
      collection(db, 'users', uid, 'books'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  async function uploadCover(file) {
    const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 800 });
    const storageRef = ref(storage, `covers/${uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, compressed);
    return getDownloadURL(storageRef);
  }

  async function addBook({ type, title, date, fun, difficulty, coverFile, coverUrl }) {
    let finalCoverUrl = coverUrl || null;
    if (coverFile) finalCoverUrl = await uploadCover(coverFile);
    await addDoc(collection(db, 'users', uid, 'books'), {
      type, title,
      date: Timestamp.fromDate(new Date(date)),
      fun, difficulty,
      coverUrl: finalCoverUrl,
      createdAt: serverTimestamp(),
    });
  }

  async function updateBook(bookId, { type, title, date, fun, difficulty, coverFile, coverUrl, existingCoverUrl }) {
    let finalCoverUrl = existingCoverUrl || null;
    if (coverFile) finalCoverUrl = await uploadCover(coverFile);
    else if (coverUrl !== undefined) finalCoverUrl = coverUrl;
    await updateDoc(doc(db, 'users', uid, 'books', bookId), {
      type, title,
      date: Timestamp.fromDate(new Date(date)),
      fun, difficulty,
      coverUrl: finalCoverUrl,
    });
  }

  async function deleteBook(bookId, coverUrl) {
    if (coverUrl) {
      try { await deleteObject(ref(storage, coverUrl)); } catch (_) {}
    }
    await deleteDoc(doc(db, 'users', uid, 'books', bookId));
  }

  return { books, loading, addBook, updateBook, deleteBook };
}
