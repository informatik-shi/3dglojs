import './menu.js';
import './modal.js';
import './regexpr.js';
import './tabs.js';
import './slider.js';

const deadline = new Date('2026-12-31T23:59:59+03:00');
const hoursElement = document.getElementById('timer-hours');
const minutesElement = document.getElementById('timer-minutes');
const secondsElement = document.getElementById('timer-seconds');

function addZero(number) {
  return String(number).padStart(2, '0');
}

function updateClock() {
  const timeLeft = Math.max(0, Math.floor((deadline - new Date()) / 1000));
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  hoursElement.textContent = addZero(hours);
  minutesElement.textContent = addZero(minutes);
  secondsElement.textContent = addZero(seconds);

  if (timeLeft === 0) {
    clearInterval(timerId);
  }
}

// Создаём интервал один раз, вне updateClock.
const timerId = setInterval(updateClock, 1000);
updateClock();
