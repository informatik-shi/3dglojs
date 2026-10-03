export async function sendData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Сервер ответил HTTP ${response.status}`);
  }

  return response.json();
}
