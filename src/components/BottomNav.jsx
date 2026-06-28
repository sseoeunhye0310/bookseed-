import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/shelf', icon: '📚', label: '책장' },
  { path: '/calendar', icon: '📅', label: '달력' },
  { path: '/add', icon: null, label: '추가' },
  { path: '/report', icon: '📊', label: '리포트' },
  { path: '/settings', icon: '⚙️', label: '설정' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        const isAdd = tab.path === '/add';
        return (
          <button key={tab.path} style={styles.tab} onClick={() => navigate(tab.path)}>
            {isAdd ? (
              <div style={styles.addBtn}>
                <span style={{ fontSize: 24, color: '#fff', lineHeight: 1 }}>＋</span>
              </div>
            ) : (
              <>
                <span style={{ fontSize: 22, filter: active ? 'none' : 'grayscale(60%) opacity(0.5)' }}>
                  {tab.icon}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  marginTop: 2,
                }}>
                  {tab.label}
                </span>
                {active && <div style={styles.dot} />}
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', bottom: 0,
    left: '50%', transform: 'translateX(-50%)',
    width: '100%', maxWidth: 'var(--max-width)',
    height: 'var(--nav-height)',
    background: 'rgba(253,248,245,0.96)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex', alignItems: 'center',
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(180,100,100,0.08)',
  },
  tab: {
    flex: 1, height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 2, position: 'relative',
  },
  addBtn: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'var(--color-accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(180,100,100,0.38)',
    marginBottom: 8,
  },
  dot: {
    position: 'absolute', bottom: 7,
    width: 4, height: 4, borderRadius: '50%',
    background: 'var(--color-accent)',
  },
};
