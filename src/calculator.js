const calculator = document.querySelector('.calc-block');
const typeInput = calculator.querySelector('.calc-type');
const squareInput = calculator.querySelector('.calc-square');
const countInput = calculator.querySelector('.calc-count');
const dayInput = calculator.querySelector('.calc-day');
const total = calculator.querySelector('#total');

// Стоимость квадратного метра для каждого типа из таблицы с формулами.
const pricePerSquareMeter = {
  '1': 100,
  '1.4': 120,
  '2': 110,
};

function updateTotal() {
  const type = typeInput.value;
  const square = Number(squareInput.value);
  const count = countInput.value === '' ? 1 : Number(countInput.value);
  const days = dayInput.value === '' ? 10 : Number(dayInput.value);

  // Тип и площадь обязательны. Пустые необязательные поля имеют значения 1 и 10.
  if (!pricePerSquareMeter[type] ||
      !Number.isSafeInteger(square) || square < 1 ||
      !Number.isSafeInteger(count) || count < 1 ||
      !Number.isSafeInteger(days) || days < 1) {
    total.textContent = '0';
    return;
  }

  const countFactor = count === 1 ? 1 : 1 + count * 0.1;
  const daysFactor = days < 5 ? 2 : days < 10 ? 1.5 : 1;
  const price = pricePerSquareMeter[type] * Number(type) * square * countFactor * daysFactor;
  total.textContent = Number.isFinite(price) ? String(Math.round(price)) : '0';
}

typeInput.addEventListener('change', updateTotal);
[squareInput, countInput, dayInput].forEach((input) => {
  input.addEventListener('input', updateTotal);
  input.addEventListener('compositionend', updateTotal);
});

updateTotal();
