const menuButton = document.querySelector('.menu');
const menu = document.querySelector('menu');
const closeButton = menu.querySelector('.close-btn');

function closeMenu() {
  menu.classList.remove('active-menu');
  menu.inert = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.focus({ preventScroll: true });
}

menuButton.addEventListener('click', () => {
  if (menu.classList.contains('active-menu')) {
    closeMenu();
    return;
  }

  menu.inert = false;
  menu.classList.add('active-menu');
  menuButton.setAttribute('aria-expanded', 'true');
  closeButton.focus();
});

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    closeMenu();
  }
});

closeButton.addEventListener('click', closeMenu);

document.addEventListener('click', (event) => {
  if (menu.classList.contains('active-menu') &&
      !menu.contains(event.target) && !menuButton.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('active-menu')) {
    closeMenu();
  }
});
