document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos los elementos del DOM
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // CONFIGURACIÓN
    const currentStatusText = "Jugando Actualmente";
    const totalSlides = slides.length;

    let startIndex = parseInt(sliderContainer.dataset.startSlide) || 0;
    if (startIndex < 0 || startIndex >= totalSlides) {
        startIndex = 0;
    }
    let currentIndex = startIndex;

    function updateButtonStates() {
        prevBtn.classList.toggle('is-hidden', currentIndex === 0);
        nextBtn.classList.toggle('is-hidden', currentIndex === totalSlides - 1);
    }

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

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            showSlide(currentIndex);
            updateButtonStates();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showSlide(currentIndex);
            updateButtonStates();
        }
    });


    // --- ¡NUEVA LÓGICA DE SWIPE TÁCTIL! ---
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Mínimo de píxeles para considerarse un swipe

    // Escucha cuando el usuario toca la pantalla
    slider.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    // Escucha cuando el usuario levanta el dedo
    slider.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        // Si el swipe es mayor que el umbral (threshold)
        if (Math.abs(swipeDistance) >= swipeThreshold) {
            if (swipeDistance < 0) {
                // Swipe hacia la izquierda -> Siguiente slide
                nextBtn.click(); // Reutilizamos la lógica del botón
            } else {
                // Swipe hacia la derecha -> Slide anterior
                prevBtn.click(); // Reutilizamos la lógica del botón
            }
        }
    }
    // --- FIN DE LA LÓGICA DE SWIPE ---


    // --- INICIALIZACIÓN ---
    showSlide(currentIndex);
    setActiveStatus(currentIndex);
    updateButtonStates();
});