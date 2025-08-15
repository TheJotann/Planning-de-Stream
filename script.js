document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.slider-container');
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const currentStatusText = 'Actualmente';
  const totalSlides = slides.length;

  let startIndex = parseInt(sliderContainer.dataset.startSlide, 10) || 0;
  if (startIndex < 0 || startIndex >= totalSlides) startIndex = 0;
  let currentIndex = startIndex;

  // Swipe state
  let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
  let isDragging = false; let startTime = 0;
  const swipeThreshold = 50; // px
  const swipeVelocityThreshold = 0.5; // px/ms

  function updateButtonStates() {
    prevBtn.classList.toggle('is-hidden', currentIndex === 0);
    nextBtn.classList.toggle('is-hidden', currentIndex === totalSlides - 1);
  }

  function setActiveStatus(index) {
  // Limpiar etiquetas anteriores de TODOS los slides
  slides.forEach(slide => {
    const existingBadge = slide.querySelector('.current-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    const p = slide.querySelector('.slide-content p');
    if (p && p.dataset.status === 'dynamic') {
      p.textContent = '';
      delete p.dataset.status;
    }
  });

  // Agregar etiqueta "ACTUALMENTE" al slide activo
  const activeSlide = slides[index];
  if (activeSlide) {
    // Crear la etiqueta
    const currentBadge = document.createElement('div');
    currentBadge.className = 'current-badge inline'; // Usar clase inline
    currentBadge.textContent = 'ACTUALMENTE';
    
    // Insertar después del h1 en slide-content
    const slideContent = activeSlide.querySelector('.slide-content');
    const h1 = slideContent.querySelector('h1');
    h1.insertAdjacentElement('afterend', currentBadge);
    
    // NO añadir texto "Actualmente" al párrafo
    // Solo la etiqueta visual
  }
}

  function showSlide(index, animate = true) {
    slider.style.transition = animate ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    slider.style.transform = `translateX(-${index * 100}%)`;

    const activeSlideContent = slides[index].querySelector('.slide-content');
    if (activeSlideContent) {
      activeSlideContent.classList.remove('animate');
      setTimeout(() => activeSlideContent.classList.add('animate'), 50);
    }

    if (!animate) requestAnimationFrame(() => {
      slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      showSlide(currentIndex);
      updateButtonStates();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      showSlide(currentIndex);
      updateButtonStates();
    }
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides && index !== currentIndex) {
      currentIndex = index;
      showSlide(currentIndex);
      updateButtonStates();
    }
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // === SWIPE ===
  slider.addEventListener('touchstart', (event) => {
    const t = event.changedTouches[0];
    touchStartX = t.clientX; touchStartY = t.clientY;
    isDragging = true; startTime = Date.now();
    slider.style.transition = 'none';
  }, { passive: true });

  slider.addEventListener('touchmove', (event) => {
    if (!isDragging) return;
    const t = event.changedTouches[0];
    touchEndX = t.clientX; touchEndY = t.clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      const currentTransform = -currentIndex * 100;
      const dragPercentage = (deltaX / slider.offsetWidth) * 100;
      const newTransform = currentTransform + dragPercentage;
      const maxTransform = 0;
      const minTransform = -(totalSlides - 1) * 100;
      const clamped = Math.max(minTransform, Math.min(maxTransform, newTransform));
      slider.style.transform = `translateX(${clamped}%)`;
    }
  }, { passive: false });

  slider.addEventListener('touchend', (event) => {
    if (!isDragging) return;
    isDragging = false;
    const t = event.changedTouches[0];
    touchEndX = t.clientX; touchEndY = t.clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = Date.now() - startTime;
    const velocity = Math.abs(deltaX) / deltaTime;
    slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
    const isDistanceEnough = Math.abs(deltaX) >= swipeThreshold;
    const isVelocityEnough = velocity >= swipeVelocityThreshold;

    if (isHorizontal && (isDistanceEnough || isVelocityEnough)) {
      if (deltaX < 0) nextSlide(); else prevSlide();
    } else {
      showSlide(currentIndex);
    }
  });

  slider.addEventListener('touchcancel', () => {
    if (isDragging) {
      isDragging = false;
      slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      showSlide(currentIndex);
    }
  });

  // Teclado
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft': event.preventDefault(); prevSlide(); break;
      case 'ArrowRight': event.preventDefault(); nextSlide(); break;
      case 'Home': event.preventDefault(); goToSlide(0); break;
      case 'End': event.preventDefault(); goToSlide(totalSlides - 1); break;
      default: break;
    }
  });

  // Init
  showSlide(currentIndex, false);
  setActiveStatus(currentIndex);
  updateButtonStates();

  // Prevenir zoom en doble tap (opcional; cuidado con accesibilidad)
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
});