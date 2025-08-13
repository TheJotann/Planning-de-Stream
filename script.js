// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos los elementos que necesitamos del HTML
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Variable para saber en qué slide estamos. Empezamos en el primero (índice 0)
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Función para mostrar un slide específico
    function showSlide(index) {
        // Mueve el contenedor '.slider' hacia la izquierda
        // Multiplicamos el índice por 100 para obtener el porcentaje de desplazamiento
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    // Evento para el botón "Siguiente"
    nextBtn.addEventListener('click', () => {
        // Aumentamos el índice
        currentIndex++;
        // Si llegamos al final, volvemos al principio
        if (currentIndex >= totalSlides) {
            currentIndex = 0;
        }
        // Mostramos el nuevo slide
        showSlide(currentIndex);
    });

    // Evento para el botón "Anterior"
    prevBtn.addEventListener('click', () => {
        // Disminuimos el índice
        currentIndex--;
        // Si estamos en el primero y vamos hacia atrás, vamos al último
        if (currentIndex < 0) {
            currentIndex = totalSlides - 1;
        }
        // Mostramos el nuevo slide
        showSlide(currentIndex);
    });

    // Mostramos el primer slide al cargar la página
    showSlide(currentIndex);
});