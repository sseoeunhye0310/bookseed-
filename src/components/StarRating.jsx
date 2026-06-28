export default function StarRating({ value, onChange, readOnly = false, size = 'md' }) {
  const fontSize = size === 'lg' ? 32 : size === 'sm' ? 16 : 26;

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => !readOnly && onChange && onChange(n)}
          style={{
            fontSize,
            color: n <= value ? '#FFB300' : '#D9D9D9',
            cursor: readOnly ? 'default' : 'pointer',
            padding: '0 1px',
            lineHeight: 1,
            transition: 'color 0.15s, transform 0.1s',
            transform: !readOnly && n <= value ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
