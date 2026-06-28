export default function SettingsPage({ user, onLogout }) {
  return (
    <div className="page-content">
      <h2 style={styles.heading}>설정</h2>

      <div style={styles.profileCard}>
        <div style={styles.avatarWrap}>
          <img src={user.photoURL || 'https://via.placeholder.com/60'} alt="프로필" style={styles.avatar} />
          <div style={styles.onlineDot} />
        </div>
        <div style={styles.profileInfo}>
          <p style={styles.name}>{user.displayName}</p>
          <p style={styles.email}>{user.email}</p>
          <span style={styles.badge}>🌱 독서 중</span>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>앱 정보</p>
        {[
          { icon: '📚', key: '앱 이름', val: 'BOOKSEED' },
          { icon: '🏷️', key: '버전', val: 'v1.0.0' },
          { icon: '💛', key: '만든이', val: 'Eunhye & Claude' },
        ].map((row, i, arr) => (
          <div key={row.key} style={{ ...styles.infoRow, borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <span style={styles.infoIcon}>{row.icon}</span>
            <span style={styles.infoKey}>{row.key}</span>
            <span style={styles.infoVal}>{row.val}</span>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>도움말</p>
        <div style={styles.helpRow}>
          <span style={{ ...styles.colorDot, background: 'var(--color-english)' }} />
          <span style={styles.helpText}>영어원서</span>
          <span style={{ ...styles.colorDot, background: 'var(--color-korean)', marginLeft: 12 }} />
          <span style={styles.helpText}>한글책</span>
        </div>
        <p style={styles.helpDesc}>
          책 표지는 이미지 우클릭 → <strong>이미지 주소 복사</strong> 후 URL로 입력하세요
        </p>
      </div>

      <button style={styles.logoutBtn} onClick={onLogout}>
        🚪 로그아웃
      </button>
    </div>
  );
}

const styles = {
  heading: { fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 20 },
  profileCard: {
    display: 'flex', alignItems: 'center', gap: 16, padding: 20,
    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
    borderRadius: 20, marginBottom: 16,
    boxShadow: '0 4px 20px rgba(180,100,100,0.25)',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 64, height: 64, borderRadius: '50%',
    objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: '50%',
    background: '#fff', border: '2px solid var(--color-accent)',
  },
  profileInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
  name: { fontSize: 17, fontWeight: 800, color: '#fff' },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  badge: {
    display: 'inline-block', fontSize: 11, fontWeight: 700,
    background: 'rgba(255,255,255,0.25)', color: '#fff',
    padding: '3px 10px', borderRadius: 10,
  },
  section: {
    background: 'var(--color-surface)', borderRadius: 20, padding: '16px 20px',
    marginBottom: 14, boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)',
    marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase',
  },
  infoRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
  infoIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  infoKey: { flex: 1, fontSize: 14 },
  infoVal: { fontSize: 14, fontWeight: 700, color: 'var(--color-accent-dark)' },
  helpRow: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 },
  colorDot: { width: 10, height: 10, borderRadius: '50%' },
  helpText: { fontSize: 13, fontWeight: 600 },
  helpDesc: { fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7 },
  logoutBtn: {
    width: '100%', padding: 16, borderRadius: 16,
    background: '#FFF0F0', color: '#C62828',
    fontSize: 15, fontWeight: 700, border: '1.5px solid #FFCDD2',
  },
};
