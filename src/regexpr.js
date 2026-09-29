// В калькуляторе обрабатываем только поля ввода. SELECT остаётся обычным SELECT.
const calculatorInputs = document.querySelectorAll('.calc-square, .calc-count, .calc-day');
const forms = document.querySelectorAll('#form1, #form2, #form3');

function allowOnly(input, forbiddenCharacters) {
  function clean() {
    const oldValue = input.value;
    const cursor = input.type === 'email' ? null : input.selectionStart;
    const newValue = oldValue.replace(forbiddenCharacters, '');
    if (oldValue === newValue) return;

    input.value = newValue;
    if (cursor !== null) {
      const newCursor = oldValue.slice(0, cursor).replace(forbiddenCharacters, '').length;
      input.setSelectionRange(newCursor, newCursor);
    }
  }

  input.addEventListener('input', (event) => {
    // Не прерываем ввод через экранную клавиатуру или IME.
    if (!event.isComposing) clean();
  });
  input.addEventListener('compositionend', clean);
}

calculatorInputs.forEach((input) => allowOnly(input, /[^0-9]/g));

forms.forEach((form) => {
  form.querySelectorAll('input').forEach((input) => {
    if (input.type === 'text' || input.placeholder === 'Ваше сообщение') {
      allowOnly(input, /[^А-Яа-яЁё -]/g);
    } else if (input.type === 'email') {
      allowOnly(input, /[^A-Za-z0-9@._!~*'-]/g);
    } else if (input.type === 'tel') {
      allowOnly(input, /[^0-9()-]/g);
    }
  });
});
