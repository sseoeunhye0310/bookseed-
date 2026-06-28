import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';

const today = () => new Date().toISOString().split('T')[0];

export default function AddBookPage({ onAdd }) {
  const navigate = useNavigate();
  const [type, setType] = useState('영어원서');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [fun, setFun] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setCoverFile(f);
    setCoverUrl('');
    setCoverPreview(URL.createObjectURL(f));
    setUrlMode(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('책 제목을 입력해주세요');
    if (fun === 0) return alert('재미 별점을 선택해주세요');
    setSaving(true);
    try {
      await onAdd({ type, title: title.trim(), date, fun, difficulty, coverFile, coverUrl: urlMode ? coverUrl : '' });
      navigate('/shelf');
    } catch (err) {
      alert('저장에 실패했어요: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  const typeColor = type === '영어원서' ? '#E53935' : '#1E88E5';
  const typeGradient = type === '영어원서'
    ? 'linear-gradient(135deg, #E53935, #B71C1C)'
    : 'linear-gradient(135deg, #1E88E5, #0D47A1)';

  return (
    <div className="page-content">
      <h2 style={styles.heading}>책 기록 추가</h2>

      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.typeToggle}>
          {['영어원서', '한글책'].map(t => {
            const c = t === '영어원서' ? '#E53935' : '#1E88E5';
            const active = type === t;
            return (
              <button
                key={t} type="button"
                style={{
                  ...styles.typeBtn,
                  background: active ? c : '#fff',
                  color: active ? '#fff' : '#999',
                  boxShadow: active ? `0 4px 14px ${c}55` : 'none',
                  border: active ? 'none' : '1.5px solid var(--color-border)',
                }}
                onClick={() => setType(t)}
              >
                {t === '영어원서' ? '🇺🇸' : '🇰🇷'} {t}
              </button>
            );
          })}
        </div>

        <div style={styles.card}>
          <label style={styles.label}>책 제목 *</label>
          <input
            style={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="책 제목을 입력하세요"
          />
        </div>

        <div style={styles.card}>
          <label style={styles.label}>읽은 날짜</label>
          <input type="date" style={styles.input} value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div style={styles.card}>
          <label style={styles.label}>재미 * <span style={styles.ratingHint}>{fun > 0 ? '⭐'.repeat(fun) : '별을 눌러 선택하세요'}</span></label>
          <StarRating value={fun} onChange={setFun} size="lg" />
        </div>

        <div style={styles.card}>
          <label style={styles.label}>난이도 <span style={styles.ratingHint}>{difficulty > 0 ? '⭐'.repeat(difficulty) : '선택 안 해도 돼요'}</span></label>
          <StarRating value={difficulty} onChange={setDifficulty} size="lg" />
        </div>

        <div style={styles.card}>
          <label style={styles.label}>책 표지 <span style={styles.optional}>(선택)</span></label>
          {(coverPreview || (urlMode && coverUrl)) && (
            <img
              src={urlMode ? coverUrl : coverPreview}
              alt="미리보기"
              style={styles.preview}
              onError={() => setCoverPreview('')}
            />
          )}
          <div style={styles.coverBtns}>
            <button type="button" style={styles.coverBtn} onClick={() => fileRef.current.click()}>
              📷 사진 선택
            </button>
            <button
              type="button"
              style={{ ...styles.coverBtn, ...(urlMode ? styles.activeCoverBtn : {}) }}
              onClick={() => setUrlMode(m => !m)}
            >
              🔗 URL 입력
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          {urlMode && (
            <input
              style={{ ...styles.input, marginTop: 10 }}
              value={coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          )}
        </div>

        <button
          type="submit"
          style={{ ...styles.submitBtn, background: typeGradient }}
          disabled={saving}
        >
          {saving ? '저장 중...' : '✅ 저장하기'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  heading: { fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  typeToggle: { display: 'flex', gap: 10, marginBottom: 4 },
  typeBtn: {
    flex: 1, padding: '13px 0', borderRadius: 16,
    fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '16px',
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  label: { fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 },
  ratingHint: { fontSize: 12, fontWeight: 400, color: '#bbb' },
  optional: { fontSize: 11, fontWeight: 400, color: '#ccc' },
  input: {
    padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid var(--color-border)',
    fontSize: 14, outline: 'none', width: '100%',
    background: '#FAFAFA',
    transition: 'border-color 0.2s',
  },
  preview: { width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 },
  coverBtns: { display: 'flex', gap: 8 },
  coverBtn: {
    flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 13, fontWeight: 600,
    background: '#F5F5F5', color: 'var(--color-text)',
    border: '1.5px solid transparent',
  },
  activeCoverBtn: {
    border: '1.5px solid var(--color-accent)',
    background: 'var(--color-accent-light)',
    color: 'var(--color-accent-dark)',
  },
  submitBtn: {
    padding: '17px', borderRadius: 16, color: '#fff',
    fontSize: 16, fontWeight: 800, marginTop: 6,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
};
