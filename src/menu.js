const menuButton = document.querySelector('.menu');
const menu = document.querySelector('menu');
const closeButton = menu.querySelector('.close-btn');

function openMenu() {
  menu.inert = false;
  menu.classList.add('active-menu');
  menuButton.setAttribute('aria-expanded', 'true');
  closeButton.focus();
}

function closeMenu(returnFocus = false) {
  menu.classList.remove('active-menu');
  menu.inert = true;
  menuButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) menuButton.focus({ preventScroll: true });
}

// Один обработчик управляет бургером, крестиком, ссылками и кликом снаружи.
function toggleMenu(event) {
  const target = event.target;

  if (event.type === 'keydown') {
    if (event.key === 'Escape' && menu.classList.contains('active-menu')) {
      closeMenu(true);
    }
    return;
  }

  if (menuButton.contains(target)) {
    if (menu.classList.contains('active-menu')) closeMenu(true);
    else openMenu();
    return;
  }

  if (!menu.classList.contains('active-menu')) return;

  if (target.closest('.close-btn')) {
    closeMenu(true);
  } else if (target.closest('menu a[href]') || !menu.contains(target)) {
    closeMenu();
  }
}

document.addEventListener('click', toggleMenu);
document.addEventListener('keydown', toggleMenu);
