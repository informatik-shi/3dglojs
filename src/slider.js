const slider = document.querySelector('.portfolio-content');
const slides = Array.from(slider.querySelectorAll('.portfolio-item'));
const dotsContainer = slider.querySelector('.portfolio-dots');
let currentSlide = 0;

// Точек будет столько же, сколько слайдов в HTML.
const dots = slides.map((slide, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Слайд ${index + 1} из ${slides.length}`);
  dotsContainer.append(dot);
  return dot;
});

function showSlide(index) {
  currentSlide = index;

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    slide.classList.toggle('portfolio-item-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });

  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === index;
    dot.classList.toggle('dot-active', active);
    dot.setAttribute('aria-pressed', String(active));
  });
}

slider.addEventListener('click', (event) => {
  const control = event.target.closest('.portfolio-btn, .dot');
  if (!control || !slider.contains(control)) return;

  if (control.classList.contains('prev')) {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  } else if (control.classList.contains('next')) {
    showSlide((currentSlide + 1) % slides.length);
  } else {
    showSlide(dots.indexOf(control));
  }
});

showSlide(0);
