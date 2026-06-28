import { useState } from 'react';

export function useAI() {
  const [loading, setLoading] = useState(false);

  async function callAI(type, data) {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
      const json = await res.json();
      return json.text;
    } catch (e) {
      return '오류가 발생했어요. 다시 시도해 주세요.';
    } finally {
      setLoading(false);
    }
  }

  return { callAI, loading };
}
