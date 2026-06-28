export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { type, data } = await req.json();
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

  let prompt = '';

  if (type === 'report_comment') {
    const { engCount, korCount, totalCount, avgFun, streak, period } = data;
    prompt = `당신은 아이의 독서를 응원하는 따뜻한 독서 코치입니다.
아래는 ${period} 동안의 독서 기록입니다:
- 영어원서: ${engCount}권
- 한글책: ${korCount}권
- 합계: ${totalCount}권
- 평균 재미 점수: ${avgFun}점 (5점 만점)
- 연속 독서: ${streak}일

이 독서 기록을 보고 아이에게 따뜻하고 격려가 되는 코멘트를 3문장으로 작성해주세요.
이모지를 적절히 사용하고, 구체적인 숫자를 언급하며 칭찬해주세요.
한국어로 작성해주세요.`;
  }

  if (type === 'ar_predict') {
    const { title } = data;
    prompt = `당신은 영어 원서 전문가입니다.
"${title}" 이라는 영어 원서의 AR(Accelerated Reader) 레벨을 예측해주세요.

다음 형식으로 답변해주세요:
- AR 예상 레벨: (숫자)
- 적정 연령: (나이대)
- 난이도 설명: (1-2문장)
- 비슷한 책 추천: (1-2권)

한국어로 작성해주세요.`;
  }

  if (type === 'book_recommend') {
    const { books, type: bookType } = data;
    const bookList = books.map(b => `- ${b.title} (재미:${b.fun}점)`).join('\n');
    prompt = `당신은 아이 독서 전문가입니다.
아이가 최근 읽은 ${bookType} 목록입니다:
${bookList}

이 독서 패턴을 분석해서 다음에 읽으면 좋을 책 5권을 추천해주세요.
각 책마다 추천 이유를 한 문장으로 설명해주세요.
한국어로 작성하되, 책 제목은 원제를 사용해주세요.`;
  }

  if (type === 'roadmap') {
    const { books, months } = data;
    const engBooks = books.filter(b => b.type === '영어원서').map(b => b.title).join(', ');
    const korBooks = books.filter(b => b.type === '한글책').map(b => b.title).join(', ');
    prompt = `당신은 아이 독서 커리큘럼 전문가입니다.
지금까지 읽은 책:
- 영어원서: ${engBooks || '없음'}
- 한글책: ${korBooks || '없음'}

앞으로 ${months}개월 독서 로드맵을 월별로 제시해주세요.
영어원서와 한글책을 균형있게 포함하고, 난이도를 점진적으로 높여주세요.
한국어로 작성해주세요.`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const result = await response.json();
  const text = result.content?.[0]?.text || '응답을 받지 못했어요.';

  return new Response(JSON.stringify({ text }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/ai' };
