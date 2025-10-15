document.addEventListener('DOMContentLoaded', () => {

  // --- CONFIGURA TU PROYECTO DE SUPABASE ---
  const SUPABASE_URL = 'https://hxnikfmwknlxmkqcsrol.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmlrZm13a25seG1rcWNzcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTUwNTksImV4cCI6MjA3NTE3MTA1OX0.G2b3hFEvpvOFpiFFk_a2os-7mFOgsZz6pj_YMihvv5A';
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const jobDetailsElement = document.getElementById('job-details-csr');

  // Función para cargar los datos desde Supabase
  async function loadJobFromSupabase() {
    if (jobDetailsElement) {
      const { data: jobData, error } = await supabase
        .from('job_posts')
        .select('*')
        .eq('id', 1) // <-- IMPORTANTE: Siempre cargaremos la oferta con id=1
        .single(); // .single() para obtener un solo resultado

      if (error) {
        console.error('Error fetching data from Supabase:', error);
        // Si hay un error, no hacemos nada y se muestra el contenido por defecto del HTML
        return;
      }

      if (jobData) {
        console.log("Contenido cargado desde Supabase.");
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
      }
    }
  }

  // Cargar los datos al inicio
  loadJobFromSupabase();

  // --- CARACTERÍSTICA PRO: Actualización en Tiempo Real ---
  // Suscribirse a cambios en la tabla 'job_posts' para la oferta con id=1
  supabase
    .channel('public:job_posts')
    .on('postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'job_posts', 
        filter: 'id=eq.1' 
      }, 
      (payload) => {
        console.log('Change received!', payload);
        loadJobFromSupabase(); // Recargar los datos cuando haya un cambio
      }
    )
    .subscribe();


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
