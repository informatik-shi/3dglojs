const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeElement() {
  const listeners = {};
  return {
    listeners,
    style: {},
    attrs: {},
    addEventListener(name, callback) { listeners[name] = callback; },
    setAttribute(name, value) { this.attrs[name] = value; },
    focus() { this.focused = true; },
    fire(name, event = {}) {
      listeners[name]?.({ target: this, currentTarget: this, ...event });
    },
  };
}

function setup(width) {
  const frames = new Map();
  let nextFrameId = 0;
  const popup = makeElement();
  const content = makeElement();
  const closeButton = makeElement();
  const openButton = makeElement();
  const document = makeElement();
  const window = makeElement();
  document.body = makeElement();
  document.body.style.overflow = 'auto';
  document.querySelector = () => popup;
  document.querySelectorAll = () => [openButton];
  popup.querySelector = (selector) => selector === '.popup-content' ? content : closeButton;
  popup.querySelectorAll = () => [closeButton];
  window.innerWidth = width;

  const helperSource = fs.readFileSync('src/helpers.js', 'utf8').replace('export function animate', 'function animate');
  const modalSource = fs.readFileSync('src/modal.js', 'utf8').replace("import { animate } from './helpers.js';", '');
  vm.runInNewContext(`${helperSource}\n${modalSource}`, {
    document,
    window,
    requestAnimationFrame(callback) {
      const id = ++nextFrameId;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) { frames.delete(id); },
  });

  return {
    popup, content, closeButton, openButton, document, window, frames,
    tick(time) {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback(time));
    },
  };
}

test('на широком экране анимация доходит до конца за 400 мс', () => {
  const page = setup(1024);
  page.openButton.fire('click');
  assert.equal(page.popup.style.display, 'block');
  assert.equal(page.frames.size, 1);
  assert.equal(page.content.style.opacity, '0');
  page.tick(100);
  page.tick(300);
  assert.equal(page.content.style.opacity, '0.5');
  assert.equal(page.content.style.transform, 'translateY(-30px)');
  page.tick(500);
  assert.equal(page.frames.size, 0);
  assert.equal(page.content.style.opacity, '1');
  assert.equal(page.content.style.transform, 'translateY(0)');
});

test('закрытие отменяет кадры, повторное открытие запускает новую анимацию', () => {
  const page = setup(1024);
  page.openButton.fire('click');
  page.tick(0);
  page.closeButton.fire('click');
  assert.equal(page.frames.size, 0);
  assert.equal(page.popup.style.display, 'none');
  assert.equal(page.document.body.style.overflow, 'auto');
  page.openButton.fire('click');
  assert.equal(page.frames.size, 1);
  page.window.innerWidth = 767;
  page.window.fire('resize');
  assert.equal(page.frames.size, 0);
  assert.equal(page.content.style.opacity, '1');
});

test('на мобильном экране окно появляется сразу', () => {
  const page = setup(375);
  page.openButton.fire('click');
  assert.equal(page.popup.style.display, 'block');
  assert.equal(page.frames.size, 0);
  assert.equal(page.content.style.opacity, '1');
  page.popup.fire('click');
  assert.equal(page.popup.style.display, 'none');
});
