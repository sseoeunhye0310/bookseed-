import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';

function toDateStr(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function BookDetailPage({ books, onUpdate, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === id);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [eTitle, setETitle] = useState('');
  const [eDate, setEDate] = useState('');
  const [eFun, setEFun] = useState(0);
  const [eDiff, setEDiff] = useState(0);
  const [eCoverFile, setECoverFile] = useState(null);
  const [eCoverPreview, setECoverPreview] = useState('');
  const [saving, setSaving] = useState(false);

  if (!book) return <div className="page-content"><p>책을 찾을 수 없어요</p></div>;

  const typeColor = book.type === '영어원서' ? 'var(--color-english)' : 'var(--color-korean)';

  function startEdit() {
    const d = book.date?.toDate ? book.date.toDate() : new Date(book.date);
    setETitle(book.title);
    setEDate(d.toISOString().split('T')[0]);
    setEFun(book.fun);
    setEDiff(book.difficulty || 0);
    setECoverFile(null);
    setECoverPreview(book.coverUrl || '');
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(book.id, {
        type: book.type, title: eTitle, date: eDate,
        fun: eFun, difficulty: eDiff,
        coverFile: eCoverFile, existingCoverUrl: eCoverPreview || null,
      });
      setEditing(false);
    } catch (err) {
      alert('수정 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await onDelete(book.id, book.coverUrl);
    navigate('/shelf');
  }

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate(-1)}>← 뒤로</button>

      {editing ? (
        <div style={styles.editWrap}>
          <h2 style={styles.editHeading}>수정하기</h2>
          {eCoverPreview && (
            <img src={eCoverPreview} alt="" style={styles.editPreview} />
          )}
          <div style={styles.editCard}>
            <label style={styles.label}>책 제목</label>
            <input style={styles.input} value={eTitle} onChange={e => setETitle(e.target.value)} />
          </div>
          <div style={styles.editCard}>
            <label style={styles.label}>읽은 날짜</label>
            <input type="date" style={styles.input} value={eDate} onChange={e => setEDate(e.target.value)} />
          </div>
          <div style={styles.editCard}>
            <label style={styles.label}>재미</label>
            <StarRating value={eFun} onChange={setEFun} size="lg" />
          </div>
          <div style={styles.editCard}>
            <label style={styles.label}>난이도</label>
            <StarRating value={eDiff} onChange={setEDiff} size="lg" />
          </div>
          <div style={styles.editCard}>
            <label style={styles.label}>표지 이미지 변경</label>
            <input type="file" accept="image/*" onChange={e => {
              const f = e.target.files[0];
              if (f) { setECoverFile(f); setECoverPreview(URL.createObjectURL(f)); }
            }} />
          </div>
          <div style={styles.editBtns}>
            <button style={styles.cancelBtn} onClick={() => setEditing(false)}>취소</button>
            <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 세로형 표지 */}
          <div style={styles.coverSection}>
            {book.coverUrl ? (
              <div style={styles.coverShadowWrap}>
                <img src={book.coverUrl} alt={book.title} style={styles.coverImg} />
              </div>
            ) : (
              <div style={{ ...styles.coverPlaceholder, background: typeColor + '18', borderColor: typeColor + '33' }}>
                <span style={{ fontSize: 52 }}>📖</span>
                <p style={{ fontSize: 13, color: typeColor, fontWeight: 600, textAlign: 'center', padding: '0 16px' }}>
                  {book.title}
                </p>
              </div>
            )}
          </div>

          {/* 정보 카드 */}
          <div style={styles.infoCard}>
            <div style={styles.infoTop}>
              <span style={{ ...styles.typeTag, background: typeColor }}>{book.type}</span>
              <p style={styles.dateText}>{toDateStr(book.date)}</p>
            </div>
            <h1 style={styles.title}>{book.title}</h1>

            <div style={styles.divider} />

            <div style={styles.ratingRow}>
              <div style={styles.ratingItem}>
                <p style={styles.ratingLabel}>재미</p>
                <StarRating value={book.fun} readOnly size="md" />
              </div>
              <div style={styles.ratingDivider} />
              <div style={styles.ratingItem}>
                <p style={styles.ratingLabel}>난이도</p>
                <StarRating value={book.difficulty || 0} readOnly size="md" />
              </div>
            </div>
          </div>

          <div style={styles.actionBtns}>
            <button style={styles.editBtn} onClick={startEdit}>✏️ 수정</button>
            <button style={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>🗑️ 삭제</button>
          </div>
        </>
      )}

      {confirmDelete && (
        <div style={styles.overlay} onClick={() => setConfirmDelete(false)}>
          <div style={styles.dialog} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 36, marginBottom: 8 }}>🗑️</p>
            <p style={styles.dialogText}>정말 삭제할까요?</p>
            <p style={styles.dialogSub}>삭제한 기록은 복구할 수 없어요</p>
            <div style={styles.dialogBtns}>
              <button style={styles.cancelBtn} onClick={() => setConfirmDelete(false)}>취소</button>
              <button style={styles.deleteConfirmBtn} onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '20px 16px',
    paddingBottom: 'calc(var(--nav-height) + 20px)',
    minHeight: '100vh',
    background: 'var(--color-bg)',
  },
  back: { color: 'var(--color-accent)', fontSize: 15, fontWeight: 600, marginBottom: 20 },

  coverSection: {
    display: 'flex', justifyContent: 'center', marginBottom: 20,
  },
  coverShadowWrap: {
    width: '55%',
    borderRadius: 16,
    boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    aspectRatio: '2/3',
    objectFit: 'cover',
    display: 'block',
  },
  coverPlaceholder: {
    width: '55%', aspectRatio: '2/3',
    borderRadius: 16, border: '2px solid',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },

  infoCard: {
    background: 'var(--color-surface)', borderRadius: 20,
    padding: '20px', marginBottom: 16,
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
  },
  infoTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  typeTag: {
    color: '#fff', fontSize: 11, fontWeight: 800,
    padding: '4px 12px', borderRadius: 10, letterSpacing: 0.5,
  },
  dateText: { color: 'var(--color-text-secondary)', fontSize: 13 },
  title: { fontSize: 20, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.4 },
  divider: { height: 1, background: 'var(--color-border)', margin: '16px 0' },
  ratingRow: { display: 'flex', alignItems: 'center' },
  ratingItem: { flex: 1, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' },
  ratingDivider: { width: 1, height: 48, background: 'var(--color-border)' },
  ratingLabel: { fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)' },

  actionBtns: { display: 'flex', gap: 12 },
  editBtn: {
    flex: 1, padding: 14, borderRadius: 14,
    background: 'var(--color-accent-light)',
    color: 'var(--color-accent-dark)', fontSize: 14, fontWeight: 700,
    border: '1.5px solid var(--color-border)',
  },
  deleteBtn: {
    flex: 1, padding: 14, borderRadius: 14,
    background: '#FFF0F0', color: '#C62828', fontSize: 14, fontWeight: 700,
    border: '1.5px solid #FFCDD2',
  },

  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  dialog: {
    background: '#fff', borderRadius: 24, padding: '28px 24px',
    width: 280, textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  dialogText: { fontSize: 18, fontWeight: 800, marginBottom: 6 },
  dialogSub: { fontSize: 13, color: '#999', marginBottom: 24 },
  dialogBtns: { display: 'flex', gap: 10 },
  cancelBtn: {
    flex: 1, padding: 13, borderRadius: 12,
    background: '#F5F5F5', fontSize: 14, fontWeight: 700, color: '#555',
  },
  saveBtn: {
    flex: 1, padding: 13, borderRadius: 12,
    background: 'var(--color-accent)', color: '#fff', fontSize: 14, fontWeight: 700,
  },
  deleteConfirmBtn: {
    flex: 1, padding: 13, borderRadius: 12,
    background: '#E53935', color: '#fff', fontSize: 14, fontWeight: 700,
  },

  editWrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  editHeading: { fontSize: 20, fontWeight: 800, marginBottom: 4 },
  editPreview: { width: '55%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 14, alignSelf: 'center' },
  editCard: {
    background: 'var(--color-surface)', borderRadius: 16, padding: 16,
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  label: { fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)' },
  input: {
    padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid var(--color-border)',
    fontSize: 14, width: '100%', background: '#FAFAF8',
  },
  editBtns: { display: 'flex', gap: 12, marginTop: 4 },
};
