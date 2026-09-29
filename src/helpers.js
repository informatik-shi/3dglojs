// Запускает анимацию на заданное время и возвращает функцию отмены.
export function animate({ duration, draw, onComplete }) {
  let startTime = null;
  let frameId;

  function frame(time) {
    if (startTime === null) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    draw(progress);

    if (progress < 1) {
      frameId = requestAnimationFrame(frame);
    } else if (onComplete) {
      onComplete();
    }
  }

  frameId = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(frameId);
}
