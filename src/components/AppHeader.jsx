export default function AppHeader() {
  return (
    <header style={styles.header}>
      <span style={styles.icon}>📖</span>
      <span style={styles.title}>BOOKSEED</span>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--max-width)',
    height: 'var(--header-height)',
    background: 'var(--color-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(180,100,100,0.18)',
  },
  icon: { fontSize: 22 },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: 3,
  },
};
