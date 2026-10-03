import { sendData } from './send-data.js';

const url = 'https://jsonplaceholder.typicode.com/posts';
const forms = document.querySelectorAll('#form2, #form3');

function checkFields(data) {
  const name = (data.user_name || '').trim();
  const phone = (data.user_phone || '').trim();
  const message = (data.user_message || '').trim();

  if (!/^[А-Яа-яЁё ]+$/.test(name)) {
    return 'Имя должно содержать только кириллицу и пробелы.';
  }

  if (!/^[0-9+()-]+$/.test(phone) || !/[0-9]/.test(phone)) {
    return 'Проверьте номер телефона.';
  }

  if (message && !/^[\p{Script=Cyrillic}\p{P}0-9 ]+$/u.test(message)) {
    return 'В сообщении можно использовать кириллицу, цифры, пробелы и знаки препинания.';
  }

  return '';
}

forms.forEach((form) => {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    const data = Object.fromEntries(new FormData(form));
    const error = checkFields(data);
    if (error) {
      status.textContent = error;
      status.className = 'form-status form-status-error';
      return;
    }

    button.disabled = true;
    status.textContent = 'Отправляем заявку…';
    status.className = 'form-status';

    try {
      await sendData(url, data);
      form.reset();
      status.textContent = 'Заявка отправлена. Спасибо!';
      status.className = 'form-status form-status-success';
    } catch (error) {
      status.textContent = `Не удалось отправить заявку: ${error.message}`;
      status.className = 'form-status form-status-error';
    } finally {
      button.disabled = false;
    }
  });
});
