document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.btn-toggle-details');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Busca el contenedor de detalles más cercano al botón
      const details = button.closest('.job-card').querySelector('.job-details');
      
      if (details) {
        // Alterna la clase 'open' en los detalles
        details.classList.toggle('open');
        
        // Cambia el texto del botón
        if (details.classList.contains('open')) {
          button.textContent = 'See less';
        } else {
          button.textContent = 'See More';
        }
      }
    });
  });
});
