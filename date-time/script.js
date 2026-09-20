const greetingElement = document.getElementById('greeting');
const weekdayElement = document.getElementById('weekday');
const timeElement = document.getElementById('current-time');
const daysElement = document.getElementById('days-left');
const daysWordElement = document.getElementById('days-word');
const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

function addZero(number) {
  return String(number).padStart(2, '0');
}

function updateDateTime() {
  const now = new Date();
  const hours = now.getHours();
  let greeting = 'Доброй ночи';

  if (hours >= 6 && hours < 12) {
    greeting = 'Доброе утро';
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Добрый день';
  } else if (hours >= 18) {
    greeting = 'Добрый вечер';
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const time = `${addZero(hours % 12 || 12)}:${addZero(now.getMinutes())}:${addZero(now.getSeconds())} ${period}`;

  // Считаем календарные дни без влияния переходов на летнее время.
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const newYear = Date.UTC(now.getFullYear() + 1, 0, 1);
  const days = Math.round((newYear - today) / (24 * 60 * 60 * 1000));
  let daysWord = 'дней';
  if (days % 10 === 1 && days % 100 !== 11) {
    daysWord = 'день';
  } else if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 12 || days % 100 > 14)) {
    daysWord = 'дня';
  }

  greetingElement.textContent = greeting;
  weekdayElement.textContent = weekdays[now.getDay()];
  timeElement.textContent = time;
  daysElement.textContent = days;
  daysWordElement.textContent = daysWord;
}

updateDateTime();
setInterval(updateDateTime, 1000);
