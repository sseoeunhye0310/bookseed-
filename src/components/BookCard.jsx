import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

const PLACEHOLDER_COLORS = [
  ['#FFF8E1', '#F9A825'],
  ['#E8F5E9', '#388E3C'],
  ['#E3F2FD', '#1565C0'],
  ['#FCE4EC', '#C62828'],
  ['#F3E5F5', '#6A1B9A'],
  ['#E0F7FA', '#00838F'],
];

export default function BookCard({ book, index }) {
  const navigate = useNavigate();
  const [bgColor, accentColor] = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];
  const typeColor = book.type === '영어원서' ? 'var(--color-english)' : 'var(--color-korean)';

  return (
    <div style={styles.card} onClick={() => navigate(`/book/${book.id}`)}>
      <div style={styles.coverWrap}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} style={styles.cover} />
        ) : (
          <div style={{ ...styles.placeholder, background: `linear-gradient(145deg, ${bgColor}, ${bgColor}CC)` }}>
            <div style={{ ...styles.placeholderAccent, background: accentColor + '22' }} />
            <span style={{ ...styles.typeTag, background: typeColor }}>
              {book.type === '영어원서' ? 'ENG' : '한글'}
            </span>
            <p style={styles.placeholderTitle}>{book.title}</p>
          </div>
        )}
        <div style={{ ...styles.typeDot, background: typeColor }} />
      </div>
      <div style={styles.info}>
        <p style={styles.title}>{book.title}</p>
        <StarRating value={book.fun} readOnly size="sm" />
      </div>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer',
    borderRadius: 14,
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  coverWrap: { aspectRatio: '2/3', overflow: 'hidden', position: 'relative' },
  cover: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: 8, gap: 6, position: 'relative',
  },
  placeholderAccent: {
    position: 'absolute', inset: 0, borderRadius: 0,
  },
  typeTag: {
    color: '#fff', fontSize: 9, fontWeight: 800,
    padding: '3px 7px', borderRadius: 8, zIndex: 1,
    letterSpacing: 0.5,
  },
  placeholderTitle: {
    fontSize: 10, fontWeight: 600, textAlign: 'center',
    color: '#333', wordBreak: 'keep-all', lineHeight: 1.5,
    zIndex: 1, padding: '0 4px',
  },
  typeDot: {
    position: 'absolute', bottom: 6, right: 6,
    width: 8, height: 8, borderRadius: '50%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  },
  info: { padding: '8px 8px 10px' },
  title: {
    fontSize: 11, fontWeight: 600, marginBottom: 5,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    color: 'var(--color-text)',
  },
};
