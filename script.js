document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos los elementos del DOM
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // CONFIGURACIÓN
    const currentStatusText = "Actualmente"; // Puedes cambiar este texto
    const totalSlides = slides.length;

    // Leemos el slide inicial desde el atributo data-start-slide en el HTML
    let startIndex = parseInt(sliderContainer.dataset.startSlide) || 0;
    
    // Nos aseguramos de que el índice inicial sea válido
    if (startIndex < 0 || startIndex >= totalSlides) {
        startIndex = 0;
    }
    
    let currentIndex = startIndex;

    // Función para actualizar el estado de los botones (visible/oculto)
    function updateButtonStates() {
        // Oculta el botón 'prev' si estamos en el primer slide
        prevBtn.classList.toggle('is-hidden', currentIndex === 0);
        // Oculta el botón 'next' si estamos en el último slide
        nextBtn.classList.toggle('is-hidden', currentIndex === totalSlides - 1);
    }

    // Función para añadir la etiqueta de estado dinámico al slide activo
    function setActiveStatus(index) {
        // Limpiamos cualquier etiqueta dinámica anterior
        slides.forEach(slide => {
            const p = slide.querySelector('.slide-content p');
            if (p.dataset.status === 'dynamic') {
                p.textContent = ''; // Limpiamos el texto
                delete p.dataset.status; // Quitamos la marca
            }
        });

        // Añadimos la nueva etiqueta al slide correcto
        const activeSlide = slides[index];
        if (activeSlide) {
            const pElement = activeSlide.querySelector('.slide-content p');
            // Si el párrafo ya tiene texto, lo respetamos y añadimos el nuevo delante
            if (pElement.textContent.trim() !== '') {
                pElement.textContent = `${currentStatusText} | ${pElement.textContent}`;
            } else {
                pElement.textContent = currentStatusText;
            }
            // Marcamos el párrafo como dinámico para poder limpiarlo después
            pElement.dataset.status = 'dynamic';
        }
    }

    // Función para mover el slider a la posición correcta
    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    // Evento para el botón 'siguiente'
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            showSlide(currentIndex);
            updateButtonStates();
        }
    });

    // Evento para el botón 'anterior'
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showSlide(currentIndex);
            updateButtonStates();
        }
    });

    // --- INICIALIZACIÓN ---
    // Esto se ejecuta una sola vez cuando la página carga
    showSlide(currentIndex);        // Muestra el slide inicial
    setActiveStatus(currentIndex);  // Pone la etiqueta de "Jugando Actualmente"
    updateButtonStates();           // Configura el estado inicial de los botones
});