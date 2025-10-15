document.addEventListener('DOMContentLoaded', () => {

  // --- LÓGICA PARA CARGAR CONTENIDO DESDE GOOGLE SHEETS (CON RESPALDO) ---
  // --- IMPORTANTE: Pega aquí la URL que te dio Google Sheets ---
  const googleSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTv-xk6w6BwAIoqp5PHH31LThNY0Umf9lsV7rnzaZdDPmnAfdM8xEKOzxS0rvO8x1nmcglqgYev8UsX/pub?output=csv';


  const jobDetailsElement = document.getElementById('job-details');

  if (jobDetailsElement) {
    Papa.parse(googleSheetsURL, {
      download: true,
      header: true,
      complete: function(results) {
        const jobData = results.data[0]; // Tomamos la primera fila de datos

        // --- CAMBIO CLAVE: Solo actualizamos si los datos son VÁLIDOS ---
        console.log("Job data loaded from sheet:", jobData);
        console.log("Datos obtenidos:", jobData);


        
        if (jobData && jobData.department) {
          console.log("Contenido cargado desde Google Sheets.");
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
          // --- CAMBIO CLAVE: Si los datos NO son válidos, no hacemos NADA. ---
          // El contenido original del HTML permanece visible.
          console.log("No se encontraron datos válidos en Google Sheets. Se mantiene el contenido por defecto.");
        }
      },
      error: function(error) {
        // --- CAMBIO CLAVE: Si hay un error de red, tampoco hacemos NADA. ---
        // El contenido original del HTML permanece visible.
        console.error('Error al cargar el archivo CSV, mostrando contenido por defecto:', error);
      }
    });
  }


  // --- LÓGICA PARA EL BOTÓN "SEE MORE / SEE LESS" (sin cambios) ---
  const toggleButtons = document.querySelectorAll('.btn-toggle-details');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const details = button.closest('.job-card').querySelector('.job-details');
      if (details) {
        details.classList.toggle('open');
        if (details.classList.contains('open')) {
          button.textContent = 'See less';
        } else {
          button.textContent = 'See more';
        }
      }
    });
  });

});
