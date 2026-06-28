const hasFirebase = !!import.meta.env.VITE_FIREBASE_API_KEY;

export default function LoginPage({ onSignIn }) {
  if (!hasFirebase) {
    return (
      <div style={styles.wrap}>
        <div style={styles.logoWrap}>
          <span style={{ fontSize: 48 }}>📚</span>
          <h1 style={styles.title}>BOOKSEED</h1>
        </div>
        <div style={styles.card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>⚙️ Firebase 설정 필요</h2>
          <pre style={{ fontSize: 10, fontFamily: 'monospace', lineHeight: 1.7, background: '#FAF7F4', padding: 12, borderRadius: 10 }}>{`VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx`}</pre>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.topSection}>
        <div style={styles.iconWrap}>
          <span style={styles.emoji}>📖</span>
        </div>
        <h1 style={styles.title}>BOOKSEED</h1>
        <p style={styles.sub}>아이의 독서 여정을 기록해요 🌱</p>
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.card}>
          <p style={styles.cardTitle}>시작하기</p>
          <p style={styles.cardDesc}>Google 계정으로 무료로 시작하세요</p>
          <button style={styles.btn} onClick={onSignIn}>
            <img src="https://www.google.com/favicon.ico" width={20} height={20} alt="" />
            Google로 계속하기
          </button>
        </div>
        <p style={styles.footer}>📚 읽은 책을 기록하고 성장을 확인해요</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#FDF8F5',
  },
  topSection: {
    flex: '0 0 45%',
    background: 'var(--color-accent)',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '32px 24px 40px',
  },
  iconWrap: {
    width: 76, height: 76, borderRadius: 22,
    background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    marginBottom: 4,
  },
  emoji: { fontSize: 44 },
  title: {
    fontSize: 28, fontWeight: 800, letterSpacing: 3, color: '#fff',
  },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  bottomSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    gap: 20,
  },
  card: {
    width: '100%', background: '#fff', borderRadius: 24,
    padding: '24px',
    boxShadow: '0 8px 32px rgba(180,100,100,0.12)',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  cardTitle: { fontSize: 18, fontWeight: 800 },
  cardDesc: { fontSize: 13, color: 'var(--color-text-secondary)', marginTop: -6 },
  btn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '14px', borderRadius: 14,
    background: 'var(--color-accent)',
    fontSize: 15, fontWeight: 700, color: '#fff',
    boxShadow: '0 4px 16px rgba(180,100,100,0.30)',
  },
  footer: { fontSize: 12, color: 'var(--color-text-secondary)' },
  logoWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 12, padding: 32,
  },
};
