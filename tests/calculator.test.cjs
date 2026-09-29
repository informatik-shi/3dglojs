const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeInput(value = '') {
  const listeners = {};
  return {
    value,
    addEventListener(name, callback) {
      listeners[name] = callback;
    },
    change(value) {
      this.value = value;
      listeners.input?.();
      listeners.change?.();
    },
  };
}

function createCalculator() {
  const type = makeInput();
  const square = makeInput();
  const count = makeInput();
  const days = makeInput();
  const total = { textContent: '' };
  const fields = {
    '.calc-type': type,
    '.calc-square': square,
    '.calc-count': count,
    '.calc-day': days,
    '#total': total,
  };
  const calculator = { querySelector: (selector) => fields[selector] };
  const document = { querySelector: () => calculator };

  vm.runInNewContext(fs.readFileSync('src/calculator.js', 'utf8'), { document });
  return { type, square, count, days, total };
}

test('все пять примеров из Excel дают указанный итог', () => {
  const examples = [
    ['1', '10', '1', '15', '1000'],
    ['1', '50', '4', '6', '10500'],
    ['1', '60', '2', '3', '14400'],
    ['1.4', '120', '5', '25', '30240'],
    ['2', '70', '1', '15', '15400'],
  ];

  for (const [type, square, count, days, expected] of examples) {
    const calculator = createCalculator();
    calculator.type.change(type);
    calculator.square.change(square);
    calculator.count.change(count);
    calculator.days.change(days);
    assert.equal(calculator.total.textContent, expected);
  }
});

test('сроки 4, 5, 9 и 10 дней используют правильные границы', () => {
  const calculator = createCalculator();
  calculator.type.change('1');
  calculator.square.change('10');
  for (const [days, expected] of [['4', '2000'], ['5', '1500'], ['9', '1500'], ['10', '1000']]) {
    calculator.days.change(days);
    assert.equal(calculator.total.textContent, expected);
  }
});

test('пустые необязательные поля и неверные обязательные значения', () => {
  const calculator = createCalculator();
  assert.equal(calculator.total.textContent, '0');
  calculator.square.change('10');
  assert.equal(calculator.total.textContent, '0');
  calculator.type.change('1');
  assert.equal(calculator.total.textContent, '1000');
  calculator.count.change('2');
  assert.equal(calculator.total.textContent, '1200');
  calculator.count.change('0');
  assert.equal(calculator.total.textContent, '0');
  calculator.count.change('');
  calculator.square.change('0');
  assert.equal(calculator.total.textContent, '0');
});
