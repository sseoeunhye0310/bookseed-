import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAI } from '../hooks/useAI';

function toDate(ts) {
  if (!ts) return new Date();
  return ts.toDate ? ts.toDate() : new Date(ts);
}

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

function AICard({ title, content, loading, onRequest, buttonLabel = 'AI에게 물어보기 ✨' }) {
  return (
    <div style={aiStyles.card}>
      <div style={aiStyles.cardHeader}>
        <span style={aiStyles.cardTitle}>{title}</span>
        <button style={aiStyles.btn} onClick={onRequest} disabled={loading}>
          {loading ? '⏳ 분석 중...' : buttonLabel}
        </button>
      </div>
      {content && (
        <div style={aiStyles.result}>
          <p style={aiStyles.resultText}>{content}</p>
        </div>
      )}
    </div>
  );
}

const aiStyles = {
  card: {
    background: 'var(--color-surface)', borderRadius: 20, padding: '16px 18px',
    marginBottom: 14, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
  },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: 700 },
  btn: {
    flexShrink: 0, padding: '8px 12px', borderRadius: 12,
    background: 'var(--color-accent)', color: '#fff',
    fontSize: 12, fontWeight: 700,
    boxShadow: '0 2px 8px rgba(180,100,100,0.25)',
  },
  result: { marginTop: 12, padding: 12, background: 'var(--color-accent-light)', borderRadius: 12 },
  resultText: { fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--color-text)' },
};

export default function ReportPage({ books }) {
  const [period, setPeriod] = useState('전체');
  const [arTitle, setArTitle] = useState('');
  const [roadmapMonths, setRoadmapMonths] = useState('3');
  const { callAI, loading } = useAI();
  const [aiResults, setAiResults] = useState({});

  const filtered = useMemo(() => {
    const now = new Date();
    if (period === '이번 주') {
      const start = new Date(now); start.setDate(now.getDate() - now.getDay()); start.setHours(0,0,0,0);
      return books.filter(b => toDate(b.date) >= start);
    }
    if (period === '이번 달') {
      return books.filter(b => {
        const d = toDate(b.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
    return books;
  }, [books, period]);

  const eng = filtered.filter(b => b.type === '영어원서');
  const kor = filtered.filter(b => b.type === '한글책');
  const avgFun = filtered.length ? (filtered.reduce((s, b) => s + b.fun, 0) / filtered.length).toFixed(1) : '-';

  const monthMap = {};
  books.forEach(b => {
    const d = toDate(b.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthMap[key]) monthMap[key] = { year: d.getFullYear(), month: d.getMonth(), eng: 0, kor: 0 };
    if (b.type === '영어원서') monthMap[key].eng++;
    else monthMap[key].kor++;
  });
  const chartData = Object.values(monthMap)
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .slice(-6)
    .map(d => ({ name: MONTH_NAMES[d.month], 영어: d.eng, 한글: d.kor }));

  const streak = useMemo(() => {
    const dates = new Set(books.map(b => {
      const d = toDate(b.date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }));
    let count = 0, cur = new Date();
    while (true) {
      const key = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
      if (!dates.has(key)) break;
      count++;
      cur.setDate(cur.getDate() - 1);
    }
    return count;
  }, [books]);

  const bestMonth = useMemo(() => {
    if (!Object.keys(monthMap).length) return null;
    const best = Object.values(monthMap).reduce((a, b) => (a.eng + a.kor >= b.eng + b.kor ? a : b));
    return `${best.year}년 ${MONTH_NAMES[best.month]}`;
  }, [books]);

  async function handleAI(key, type, data) {
    const text = await callAI(type, data);
    setAiResults(prev => ({ ...prev, [key]: text }));
  }

  return (
    <div className="page-content">
      <h2 style={styles.heading}>리포트</h2>

      <div style={styles.periodBtns}>
        {['이번 주', '이번 달', '전체'].map(p => (
          <button key={p} style={{
            ...styles.periodBtn,
            background: period === p ? 'var(--color-accent)' : 'var(--color-surface)',
            color: period === p ? '#fff' : 'var(--color-text-secondary)',
            boxShadow: period === p ? '0 4px 12px rgba(180,100,100,0.28)' : 'var(--shadow-sm)',
            border: period === p ? 'none' : '1px solid var(--color-border)',
          }} onClick={() => setPeriod(p)}>{p}</button>
        ))}
      </div>

      <div style={styles.statsRow}>
        <div style={{ ...styles.statCard, borderTop: '4px solid var(--color-english)' }}>
          <p style={styles.statNum}>{eng.length}</p>
          <p style={{ ...styles.statLabel, color: 'var(--color-english)' }}>영어원서</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid var(--color-accent)' }}>
          <p style={styles.statNum}>{filtered.length}</p>
          <p style={{ ...styles.statLabel, color: 'var(--color-accent)' }}>전체</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid var(--color-korean)' }}>
          <p style={styles.statNum}>{kor.length}</p>
          <p style={{ ...styles.statLabel, color: 'var(--color-korean)' }}>한글책</p>
        </div>
      </div>

      <div style={styles.smallStats}>
        {[
          { label: '평균 재미', val: `⭐ ${avgFun}` },
          { label: '연속 독서', val: `🔥 ${streak}일` },
          { label: '최다 독서달', val: bestMonth ? `📅 ${bestMonth.slice(-3)}` : '-' },
        ].map(s => (
          <div key={s.label} style={styles.smallCard}>
            <p style={styles.smallLabel}>{s.label}</p>
            <p style={styles.smallVal}>{s.val}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div style={styles.chartWrap}>
          <h3 style={styles.chartTitle}>월별 독서 현황</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8E4" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="영어" fill="#C0392B" radius={[4,4,0,0]} />
              <Bar dataKey="한글" fill="#2471A3" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI 섹션 */}
      <div style={styles.aiSection}>
        <h3 style={styles.aiSectionTitle}>✨ AI 독서 분석</h3>

        {/* 1. 리포트 코멘트 */}
        <AICard
          title="📊 AI 독서 코멘트"
          content={aiResults.report}
          loading={loading}
          buttonLabel="코멘트 받기 ✨"
          onRequest={() => handleAI('report', 'report_comment', {
            engCount: eng.length, korCount: kor.length,
            totalCount: filtered.length, avgFun, streak, period,
          })}
        />

        {/* 2. AR 레벨 예측 */}
        <div style={aiStyles.card}>
          <div style={aiStyles.cardHeader}>
            <span style={aiStyles.cardTitle}>🎯 AR 레벨 예측</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              style={styles.aiInput}
              value={arTitle}
              onChange={e => setArTitle(e.target.value)}
              placeholder="영어책 제목 입력..."
            />
            <button
              style={{ ...aiStyles.btn, whiteSpace: 'nowrap' }}
              onClick={() => arTitle && handleAI('ar', 'ar_predict', { title: arTitle })}
              disabled={loading || !arTitle}
            >
              {loading ? '⏳' : '예측 ✨'}
            </button>
          </div>
          {aiResults.ar && (
            <div style={aiStyles.result}>
              <p style={aiStyles.resultText}>{aiResults.ar}</p>
            </div>
          )}
        </div>

        {/* 3. 도서 추천 */}
        <div style={aiStyles.card}>
          <div style={aiStyles.cardHeader}>
            <span style={aiStyles.cardTitle}>📚 맞춤 도서 추천</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {['영어원서', '한글책'].map(t => (
              <button
                key={t}
                style={{
                  ...styles.periodBtn, flex: 1,
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  fontSize: 12, padding: '8px 0',
                }}
                onClick={() => handleAI('recommend', 'book_recommend', {
                  books: books.filter(b => b.type === t).slice(0, 10),
                  type: t,
                })}
                disabled={loading}
              >
                {loading ? '⏳' : `${t === '영어원서' ? '🇺🇸' : '🇰🇷'} ${t} 추천`}
              </button>
            ))}
          </div>
          {aiResults.recommend && (
            <div style={aiStyles.result}>
              <p style={aiStyles.resultText}>{aiResults.recommend}</p>
            </div>
          )}
        </div>

        {/* 4. 독서 로드맵 */}
        <div style={aiStyles.card}>
          <div style={aiStyles.cardHeader}>
            <span style={aiStyles.cardTitle}>🗺️ 독서 로드맵</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <select
              style={{ ...styles.aiInput, flex: 'none', width: 100 }}
              value={roadmapMonths}
              onChange={e => setRoadmapMonths(e.target.value)}
            >
              <option value="3">3개월</option>
              <option value="6">6개월</option>
              <option value="12">12개월</option>
            </select>
            <button
              style={{ ...aiStyles.btn, flex: 1 }}
              onClick={() => handleAI('roadmap', 'roadmap', { books, months: roadmapMonths })}
              disabled={loading}
            >
              {loading ? '⏳ 생성 중...' : '로드맵 만들기 ✨'}
            </button>
          </div>
          {aiResults.roadmap && (
            <div style={aiStyles.result}>
              <p style={aiStyles.resultText}>{aiResults.roadmap}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  heading: { fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16 },
  periodBtns: { display: 'flex', gap: 8, marginBottom: 20 },
  periodBtn: { flex: 1, padding: '10px 0', borderRadius: 14, fontSize: 13, fontWeight: 700, transition: 'all 0.2s' },
  statsRow: { display: 'flex', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1, background: 'var(--color-surface)', borderRadius: 16,
    padding: '16px 8px', textAlign: 'center',
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
  },
  statNum: { fontSize: 28, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 12, fontWeight: 700, marginTop: 6 },
  smallStats: { display: 'flex', gap: 8, marginBottom: 14 },
  smallCard: {
    flex: 1, background: 'var(--color-surface)', borderRadius: 14,
    padding: '12px 8px', textAlign: 'center',
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)',
  },
  smallLabel: { fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 6 },
  smallVal: { fontSize: 13, fontWeight: 800 },
  chartWrap: {
    background: 'var(--color-surface)', borderRadius: 20, padding: '16px 12px',
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', marginBottom: 20,
  },
  chartTitle: { fontSize: 14, fontWeight: 700, marginBottom: 12, paddingLeft: 8 },
  aiSection: { display: 'flex', flexDirection: 'column' },
  aiSectionTitle: { fontSize: 16, fontWeight: 800, marginBottom: 14, color: 'var(--color-accent-dark)' },
  aiInput: {
    flex: 1, padding: '10px 12px', borderRadius: 12,
    border: '1.5px solid var(--color-border)',
    fontSize: 13, background: '#FAFAF8',
  },
};
