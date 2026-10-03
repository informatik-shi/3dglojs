const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function createSendData(fetch) {
  const source = fs.readFileSync('src/send-data.js', 'utf8')
    .replace('export async function sendData', 'async function sendData');
  const context = { fetch };
  vm.runInNewContext(source + '\nthis.sendData = sendData;', context);
  return context.sendData;
}

test('отправляет данные формы POST-запросом в JSON', async () => {
  let request;
  const sendData = createSendData(async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ id: 101 }) };
  });

  const result = await sendData('https://jsonplaceholder.typicode.com/posts', {
    user_name: 'Иван',
    user_phone: '+7(999)-123',
  });

  assert.equal(result.id, 101);
  assert.equal(request.url, 'https://jsonplaceholder.typicode.com/posts');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'application/json; charset=UTF-8');
  assert.equal(JSON.parse(request.options.body).user_name, 'Иван');
});

test('неуспешный ответ сервера попадает в обработку ошибки', async () => {
  const sendData = createSendData(async () => ({ ok: false, status: 500 }));
  await assert.rejects(sendData('/posts', {}), /HTTP 500/);
});