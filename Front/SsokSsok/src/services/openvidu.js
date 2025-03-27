export const fetchToken = async () => {
    const sessionResponse = await fetch('/api/sessions', { method: 'POST' });
    const sessionId = await sessionResponse.text();
  
    const tokenResponse = await fetch(`/api/sessions/${sessionId}/connections`, { method: 'POST' });
    const token = await tokenResponse.text();
    return token;
  };