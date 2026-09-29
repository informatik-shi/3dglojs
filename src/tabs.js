const tabList = document.querySelector('.service-header');
const tabs = Array.from(tabList.querySelectorAll('.service-header-tab'));
const panels = Array.from(document.querySelectorAll('#service-block .service-tab'));

function showTab(index, focus = false) {
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[tabIndex].hidden = !selected;
  });

  if (focus) tabs[index].focus();
}

tabList.addEventListener('click', (event) => {
  const tab = event.target.closest('.service-header-tab');
  if (!tab || !tabList.contains(tab)) return;
  showTab(tabs.indexOf(tab));
});

tabList.addEventListener('keydown', (event) => {
  const index = tabs.indexOf(event.target);
  if (index === -1) return;

  let nextIndex;
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
  else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = tabs.length - 1;
  else return;

  event.preventDefault();
  showTab(nextIndex, true);
});

showTab(0);
