import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase 환경변수가 없으면 바로 로딩 종료
    if (!import.meta.env.VITE_FIREBASE_API_KEY) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => { setUser(u); setLoading(false); },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  const signIn = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return { user, loading, signIn, logout };
}
