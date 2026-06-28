import { useState } from 'react';
import BookCard from '../components/BookCard';

export default function ShelfPage({ books }) {
  const [tab, setTab] = useState('영어원서');
  const filtered = books.filter(b => b.type === tab);
  const engCount = books.filter(b => b.type === '영어원서').length;
  const korCount = books.filter(b => b.type === '한글책').length;

  return (
    <div className="page-content">
      <div style={styles.header}>
        <h2 style={styles.heading}>나의 책장</h2>
        <p style={styles.subheading}>총 {books.length}권을 읽었어요 📖</p>
      </div>

      <div style={styles.tabs}>
        {[
          { key: '영어원서', label: '🇺🇸 영어원서', count: engCount, color: 'var(--color-english)' },
          { key: '한글책', label: '🇰🇷 한글책', count: korCount, color: 'var(--color-korean)' },
        ].map(t => (
          <button
            key={t.key}
            style={{
              ...styles.tab,
              background: tab === t.key ? t.color : 'var(--color-surface)',
              color: tab === t.key ? '#fff' : 'var(--color-text-secondary)',
              boxShadow: tab === t.key ? `0 4px 14px ${t.color}44` : 'var(--shadow-sm)',
              border: tab === t.key ? 'none' : '1.5px solid var(--color-border)',
            }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span style={{
              ...styles.count,
              background: tab === t.key ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
              color: tab === t.key ? '#fff' : 'var(--color-text-secondary)',
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📖</div>
          <p style={styles.emptyTitle}>아직 기록된 책이 없어요</p>
          <p style={styles.emptyDesc}>➕ 버튼을 눌러 첫 번째 책을 추가해 보세요!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: 800, letterSpacing: -0.5 },
  subheading: { fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 },
  tabs: { display: 'flex', gap: 10, marginBottom: 20 },
  tab: {
    flex: 1, padding: '12px 0', borderRadius: 14,
    fontSize: 13, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 0.2s',
  },
  count: {
    fontSize: 11, fontWeight: 700,
    padding: '2px 7px', borderRadius: 10,
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: 80, gap: 12,
  },
  emptyIcon: {
    fontSize: 48, width: 88, height: 88,
    background: 'var(--color-accent-light)', borderRadius: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: 700 },
  emptyDesc: { fontSize: 13, color: 'var(--color-text-secondary)' },
};
