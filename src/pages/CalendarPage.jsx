import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function toDateStr(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CalendarPage({ books }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookMap = {};
  books.forEach(b => {
    const key = toDateStr(b.date);
    if (!bookMap[key]) bookMap[key] = { eng: 0, kor: 0 };
    if (b.type === '영어원서') bookMap[key].eng++;
    else bookMap[key].kor++;
  });

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const selectedKey = selected
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selected).padStart(2, '0')}`
    : null;
  const selectedBooks = selectedKey
    ? books.filter(b => toDateStr(b.date) === selectedKey)
    : [];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const DAY_NAMES = ['일','월','화','수','목','금','토'];

  return (
    <div className="page-content">
      <div style={styles.header}>
        <button style={styles.arrow} onClick={prevMonth}>‹</button>
        <h2 style={styles.monthTitle}>{year}년 {MONTH_NAMES[month]}</h2>
        <button style={styles.arrow} onClick={nextMonth}>›</button>
      </div>

      <div style={styles.calendarCard}>
        <div style={styles.grid}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{
              ...styles.dayName,
              color: d === '일' ? '#C0392B' : d === '토' ? '#2471A3' : 'var(--color-text-secondary)'
            }}>{d}</div>
          ))}
          {cells.map((day, i) => {
            const key = day
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : null;
            const data = key ? bookMap[key] : null;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = day === selected;
            const dayOfWeek = i % 7;

            return (
              <div
                key={i}
                style={{
                  ...styles.cell,
                  background: isSelected ? 'var(--color-accent-light)' : isToday ? '#FFF0F0' : 'transparent',
                  borderRadius: (isToday || isSelected) ? 10 : 0,
                  cursor: day ? 'pointer' : 'default',
                }}
                onClick={() => day && setSelected(day === selected ? null : day)}
              >
                {day && (
                  <span style={{
                    ...styles.dayNum,
                    color: isToday ? 'var(--color-accent)'
                      : dayOfWeek === 0 ? '#C0392B'
                      : dayOfWeek === 6 ? '#2471A3'
                      : 'var(--color-text)',
                    fontWeight: isToday ? 800 : 400,
                  }}>
                    {day}
                  </span>
                )}
                {data && (
                  <div style={styles.badges}>
                    {data.eng > 0 && <span style={{ ...styles.badge, background: '#C0392B' }}>{data.eng}</span>}
                    {data.kor > 0 && <span style={{ ...styles.badge, background: '#2471A3' }}>{data.kor}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.legend}>
        <span style={{ ...styles.legendDot, background: '#C0392B' }} />
        <span style={styles.legendText}>영어원서</span>
        <span style={{ ...styles.legendDot, background: '#2471A3', marginLeft: 12 }} />
        <span style={styles.legendText}>한글책</span>
      </div>

      {selected && (
        <div style={styles.sheet}>
          <h3 style={styles.sheetTitle}>{month + 1}월 {selected}일</h3>
          {selectedBooks.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', padding: '12px 0', fontSize: 14 }}>
              이날은 기록된 책이 없어요
            </p>
          ) : (
            selectedBooks.map(b => (
              <div key={b.id} style={styles.bookItem} onClick={() => navigate(`/book/${b.id}`)}>
                <span style={{ ...styles.typeTag, background: b.type === '영어원서' ? '#C0392B' : '#2471A3' }}>
                  {b.type === '영어원서' ? 'ENG' : '한글'}
                </span>
                <span style={styles.bookTitle}>{b.title}</span>
                <span style={styles.stars}>{'★'.repeat(b.fun)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  arrow: { fontSize: 28, color: 'var(--color-accent)', padding: '0 8px', fontWeight: 700 },
  monthTitle: { fontSize: 18, fontWeight: 800 },
  calendarCard: {
    background: 'var(--color-surface)', borderRadius: 20,
    padding: '12px 8px', marginBottom: 12,
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 },
  dayName: { textAlign: 'center', fontSize: 11, fontWeight: 700, padding: '4px 0 8px' },
  cell: {
    minHeight: 52, padding: '4px 2px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
  },
  dayNum: { fontSize: 13 },
  badges: { display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' },
  badge: {
    color: '#fff', fontSize: 9, fontWeight: 800,
    width: 16, height: 16, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  legend: {
    display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 4, marginBottom: 16,
  },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },
  legendText: { fontSize: 12, color: 'var(--color-text-secondary)' },
  sheet: {
    background: 'var(--color-surface)', borderRadius: 20,
    padding: '16px 20px', boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  sheetTitle: { fontSize: 16, fontWeight: 800, marginBottom: 12 },
  bookItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
    borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
  },
  typeTag: { color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8 },
  bookTitle: { flex: 1, fontSize: 14, fontWeight: 500 },
  stars: { color: '#FFB300', fontSize: 12 },
};
