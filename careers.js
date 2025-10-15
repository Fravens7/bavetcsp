document.addEventListener('DOMContentLoaded', () => {

  // --- LÓGICA PARA CARGAR CONTENIDO DESDE GOOGLE SHEETS ---
  // --- IMPORTANTE: Pega aquí la URL que te dio Google Sheets ---
  const googleSheetsURL = 'https://docs.google.com/spreadsheets/d/1YkagCJ8yCNIAUlRv3ydghknRSOcONbMEhQkIcXEscyU/edit?usp=sharing';

  const jobDetailsElement = document.getElementById('job-details');

  if (jobDetailsElement) {
    Papa.parse(googleSheetsURL, {
      download: true,
      header: true,
      complete: function(results) {
        const jobData = results.data[0]; // Tomamos la primera fila de datos

        if (jobData && jobData.department) {
          jobDetailsElement.innerHTML = `
            <p><strong>Department:</strong> ${jobData.department || 'N/A'}</p>
            <p><strong>Type:</strong> ${jobData.type || 'N/A'}</p>
            <p><strong>Career Level:</strong> ${jobData.career_level || 'N/A'}</p>
            <p><strong>Description:</strong> ${jobData.description || 'N/A'}</p>
            <h4>Key Responsibilities:</h4>
            <ul>${(jobData.responsibilities || '').split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>
            <h4>Requirements:</h4>
            <ul>${(jobData.requirements || '').split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>
            <h4>Benefits:</h4>
            <ul>${(jobData.benefits || '').split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>
            <p><strong>Work Setup:</strong> ${jobData.work_setup || 'N/A'}</p>
            <a href="cv.html" class="btn">Apply Now</a>
          `;
        } else {
          jobDetailsElement.innerHTML = '<p>No se pudo cargar la información de la vacante en este momento.</p>';
        }
      },
      error: function(error) {
        console.error('Error al cargar el archivo CSV:', error);
        jobDetailsElement.innerHTML = '<p>Error al cargar la información. Por favor, inténtalo de nuevo más tarde.</p>';
      }
    });
  }


  // --- LÓGICA PARA EL BOTÓN "SEE MORE / SEE LESS" ---
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
          button.textContent = 'See more';
        }
      }
    });
  });

});
