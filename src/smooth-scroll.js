// Обработчик на document срабатывает после закрытия меню.
document.addEventListener('click', (event) => {
  const link = event.target.closest('menu a[href^="#"], .scroll-next');
  if (!link) return;

  const sectionId = link.getAttribute('href').slice(1);
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Отменяем резкий переход по якорю и запускаем прокрутку через JS.
  event.preventDefault();
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
