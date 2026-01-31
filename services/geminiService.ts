const API_BASE = 'http://localhost:3000/api/ai';

export const extractInsight = async (text: string): Promise<string> => {
  const res = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) return "Could not extract insight.";
  const data = await res.json();
  return data.insight;
};

// Streaming Helper
export const streamDeepDive = async (
  originalText: string,
  history: { role: 'user' | 'model'; text: string }[],
  userMessage: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  const response = await fetch(`${API_BASE}/deep-dive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      original_text: originalText,
      history: history.map(h => ({ role: h.role, content: h.text })), // Map 'model' to 'assistant' if needed, or backend handles it. Backend expects {role, content}
      user_message: userMessage
    }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode chunk
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    // Process SSE events
    // data: {...}\n\n
    const lines = buffer.split('\n\n');
    // Keep the last incomplete part in buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;

      const dataStr = trimmed.slice(6);
      if (dataStr === '[DONE]') return;

      try {
        const data = JSON.parse(dataStr);
        if (data.text) {
          onChunk(data.text);
        }
      } catch (e) {
        console.error('Error parsing SSE data:', e);
      }
    }
  }
};

export const generateSummary = async (
  podcastTitle: string,
  stats: any,
  notes: any[]
): Promise<any> => {
  const res = await fetch(`${API_BASE}/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ podcast_title: podcastTitle, stats, notes }),
  });
  if (!res.ok) return null;
  return res.json();
};

// Backwards compatibility if needed, but we are replacing usage
export const chatWithContext = async () => {
  throw new Error("Use streamDeepDive instead");
};