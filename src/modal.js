import { animate } from './helpers.js';

const popup = document.querySelector('.popup');
const popupContent = popup.querySelector('.popup-content');
const closeButton = popup.querySelector('.popup-close');
const openButtons = document.querySelectorAll('.popup-btn');
let cancelAnimation = null;
let opener = null;
let savedOverflow = '';

function finishAnimation() {
  if (cancelAnimation) cancelAnimation();
  cancelAnimation = null;
  popupContent.style.opacity = '1';
  popupContent.style.transform = 'translateY(0)';
}

function openPopup(event) {
  if (popup.style.display === 'block') return;

  opener = event.currentTarget;
  savedOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  popup.style.display = 'block';
  popup.setAttribute('aria-hidden', 'false');
  closeButton.focus();
  finishAnimation();

  // На мобильной ширине показываем окно сразу, без кадров анимации.
  if (window.innerWidth < 768) return;

  popupContent.style.opacity = '0';
  popupContent.style.transform = 'translateY(-60px)';
  cancelAnimation = animate({
    duration: 400,
    draw(progress) {
      popupContent.style.opacity = String(progress);
      popupContent.style.transform = `translateY(${-60 * (1 - progress)}px)`;
    },
    onComplete() {
      cancelAnimation = null;
      popupContent.style.opacity = '1';
      popupContent.style.transform = 'translateY(0)';
    },
  });
}

function closePopup() {
  finishAnimation();
  popup.style.display = 'none';
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = savedOverflow;
  if (opener) opener.focus();
}

openButtons.forEach((button) => button.addEventListener('click', openPopup));
closeButton.addEventListener('click', closePopup);
popup.addEventListener('click', (event) => {
  if (event.target === popup) closePopup();
});

document.addEventListener('keydown', (event) => {
  if (popup.style.display !== 'block') return;
  if (event.key === 'Escape') closePopup();

  // Tab остаётся внутри открытого окна.
  if (event.key === 'Tab') {
    const controls = popup.querySelectorAll('button, input');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth < 768 && cancelAnimation) finishAnimation();
});
