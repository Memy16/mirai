function crearCarrusel(wrapperSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  const carrusel = wrapper.querySelector('.carrusel');
  const track = carrusel.querySelector('.carrusel-track');
  const prevBtn = wrapper.querySelector('.prev');
  const nextBtn = wrapper.querySelector('.next');

  let index = 0;

  function getMetrics() {
    const cards = track.querySelectorAll('.card');
    const total = cards.length;
    if (total === 0) return { total: 0, visible: 1, step: 0 };

    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || 0);
    const cardWidth = cards[0].getBoundingClientRect().width;
    const step = cardWidth + gap;

    const visible = Math.max(1, Math.round(carrusel.clientWidth / step));
    return { total, visible, step };
  }

  function update() {
    const { step } = getMetrics();
    track.style.transform = `translateX(${-index * step}px)`;
  }

  function goNext() {
    const { total, visible } = getMetrics();
    if (total <= visible) return;
    index = (index < total - visible) ? index + 1 : 0;
    update();
  }

  function goPrev() {
    const { total, visible } = getMetrics();
    if (total <= visible) return;
    index = (index > 0) ? index - 1 : Math.max(0, total - visible);
    update();
  }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);
  window.addEventListener('resize', update);

  update();
}

crearCarrusel('#carrusel-eventos-wrapper');
crearCarrusel('#carrusel-salidas-wrapper');
