document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos del DOM
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = [];

    // CONFIGURACIÓN
    const currentStatusText = "Actualmente";
    const totalSlides = slides.length;

    let startIndex = parseInt(sliderContainer.dataset.startSlide) || 0;
    if (startIndex < 0 || startIndex >= totalSlides) {
        startIndex = 0;
    }
    let currentIndex = startIndex;

    // Variables para el swipe mejorado
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isDragging = false;
    let startTime = 0;
    const swipeThreshold = 50; // Mínimo de píxeles para swipe
    const swipeVelocityThreshold = 0.5; // Velocidad mínima para swipe rápido

    // Actualiza el estado de los botones de navegación
    function updateButtonStates() {
        prevBtn.classList.toggle('is-hidden', currentIndex === 0);
        nextBtn.classList.toggle('is-hidden', currentIndex === totalSlides - 1);
    }

    // Actualiza los indicadores (función vacía ya que no hay indicadores)
    function updateIndicators() {
        // Sin indicadores
    }

    // Establece el estado activo del slide
    function setActiveStatus(index) {
        slides.forEach(slide => {
            const p = slide.querySelector('.slide-content p');
            if (p.dataset.status === 'dynamic') {
                p.textContent = '';
                delete p.dataset.status;
            }
        });

        const activeSlide = slides[index];
        if (activeSlide) {
            const pElement = activeSlide.querySelector('.slide-content p');
            if (pElement.textContent.trim() !== '') {
                pElement.textContent = `${currentStatusText} | ${pElement.textContent}`;
            } else {
                pElement.textContent = currentStatusText;
            }
            pElement.dataset.status = 'dynamic';
        }
    }

    // Muestra un slide específico
    function showSlide(index, animate = true) {
        if (animate) {
            slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            slider.style.transition = 'none';
        }
        
        slider.style.transform = `translateX(-${index * 100}%)`;
        
        // Añadir animación al contenido
        const activeSlideContent = slides[index].querySelector('.slide-content');
        activeSlideContent.classList.remove('animate');
        setTimeout(() => {
            activeSlideContent.classList.add('animate');
        }, 50);
        
        // Restaurar transición después de un frame
        if (!animate) {
            requestAnimationFrame(() => {
                slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        }
    }

    // Navegar al siguiente slide
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            showSlide(currentIndex);
            updateButtonStates();
            updateIndicators();
        }
    }

    // Navegar al slide anterior
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            showSlide(currentIndex);
            updateButtonStates();
            updateIndicators();
        }
    }

    // Navegar a un slide específico
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides && index !== currentIndex) {
            currentIndex = index;
            showSlide(currentIndex);
            updateButtonStates();
            updateIndicators();
        }
    }

    // Event listeners para los botones
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);



    // === LÓGICA DE SWIPE MEJORADA ===
    
    // Inicio del toque
    slider.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
        isDragging = true;
        startTime = Date.now();
        
        // Pausar transiciones durante el drag
        slider.style.transition = 'none';
    }, { passive: true });

    // Movimiento del toque
    slider.addEventListener('touchmove', (event) => {
        if (!isDragging) return;
        
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Solo procesar si el movimiento es más horizontal que vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            event.preventDefault(); // Prevenir scroll vertical
            
            // Aplicar transformación en tiempo real para feedback visual
            const currentTransform = -currentIndex * 100;
            const dragPercentage = (deltaX / slider.offsetWidth) * 100;
            const newTransform = currentTransform + dragPercentage;
            
            // Limitar el drag en los extremos
            const maxTransform = 0;
            const minTransform = -(totalSlides - 1) * 100;
            const clampedTransform = Math.max(minTransform, Math.min(maxTransform, newTransform));
            
            slider.style.transform = `translateX(${clampedTransform}%)`;
        }
    }, { passive: false });

    // Final del toque
    slider.addEventListener('touchend', (event) => {
        if (!isDragging) return;
        
        isDragging = false;
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / deltaTime;
        
        // Restaurar transición
        slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Determinar si es un swipe válido
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const isDistanceEnough = Math.abs(deltaX) >= swipeThreshold;
        const isVelocityEnough = velocity >= swipeVelocityThreshold;
        
        if (isHorizontalSwipe && (isDistanceEnough || isVelocityEnough)) {
            if (deltaX < 0) {
                // Swipe hacia la izquierda -> Siguiente slide
                nextSlide();
            } else {
                // Swipe hacia la derecha -> Slide anterior
                prevSlide();
            }
        } else {
            // Volver al slide actual si no hay swipe válido
            showSlide(currentIndex);
        }
    });

    // Cancelar drag si se sale del área
    slider.addEventListener('touchcancel', () => {
        if (isDragging) {
            isDragging = false;
            slider.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            showSlide(currentIndex);
        }
    });

    // === SOPORTE PARA TECLADO ===
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextSlide();
                break;
            case 'Home':
                event.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                event.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    });

    // === INICIALIZACIÓN ===
    showSlide(currentIndex, false);
    setActiveStatus(currentIndex);
    updateButtonStates();
    updateIndicators();

    // === PREVENIR ZOOM EN DOBLE TAP (iOS) ===
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // === AUTO-SLIDE (OPCIONAL) ===
    /*
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 segundos
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < totalSlides - 1) {
                nextSlide();
            } else {
                goToSlide(0); // Volver al principio
            }
        }, autoSlideDelay);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Iniciar auto-slide
    startAutoSlide();
    
    // Pausar auto-slide en interacción
    slider.addEventListener('touchstart', stopAutoSlide);
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    */
});