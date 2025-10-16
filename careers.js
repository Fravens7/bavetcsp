
document.addEventListener('DOMContentLoaded', () => {

  // --- CONFIGURA TU PROYECTO DE SUPABASE ---
  const SUPABASE_URL = 'https://hxnikfmwknlxmkqcsrol.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmlrZm13a25seG1rcWNzcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTUwNTksImV4cCI6MjA3NTE3MTA1OX0.G2b3hFEvpvOFpiFFk_a2os-7mFOgsZz6pj_YMihvv5A';
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const jobDetailsElement = document.getElementById('job-details-csr');

  // Función para cargar los datos desde Supabase
// Reemplaza la función loadJobFromSupabase en careers.js
async function loadJobFromSupabase() {
    if (jobDetailsElement) {
        const { data: jobData, error } = await supabase
            .from('job_posts')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching data from Supabase:', error);
            return;
        }

        if (jobData) {
            console.log("Contenido cargado desde Supabase.");

            // --- CAMBIO CLAVE: Leer el orden desde la BD ---
            let fieldOrder = [];
            try {
                fieldOrder = jobData.field_order ? JSON.parse(jobData.field_order) : [];
            } catch (e) {
                console.error("Error parsing field_order from DB:", e);
                fieldOrder = ['department', 'type', 'career_level', 'description', 'responsibilities', 'requirements', 'benefits', 'work_setup'];

  let finalHTML = '';

// --- CAMBIO CLAVE: Construir el HTML dinámicamente ---
            fieldOrder.forEach(fieldName => {
                switch (fieldName) {
                    case 'department':
                        finalHTML += `<p><strong>Department:</strong> ${jobData.department || 'N/A'}</p>`;
                        break;
                    case 'type':
                        finalHTML += `<p><strong>Type:</strong> ${jobData.type || 'N/A'}</p>`;
                        break;
                    case 'career_level':
                        finalHTML += `<p><strong>Career Level:</strong> ${jobData.career_level || 'N/A'}</p>`;
                        break;
                    case 'description':
                        finalHTML += `<p><strong>Description:</strong> ${jobData.description || 'N/A'}</p>`;
                        break;
                    case 'responsibilities':
                        finalHTML += `<h4>Key Responsibilities:</h4><ul>${(jobData.responsibilities || '').split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
                        break;
                    case 'requirements':
                        finalHTML += `<h4>Requirements:</h4><ul>${(jobData.requirements || '').split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
                        break;
                    case 'benefits':
                        finalHTML += `<h4>Benefits:</h4><ul>${(jobData.benefits || '').split('\n').map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
                        break;
                    case 'work_setup':
                        finalHTML += `<p><strong>Work Setup:</strong> ${jobData.work_setup || 'N/A'}</p>`;
                        break;
                // --- LÓGICA PARA LEER EL ORDEN GUARDADO ---
                let fieldOrder = [];
                try {
                    fieldOrder = jobData.field_order ? JSON.parse(jobData.field_order) : ['department', 'type', 'career_level', 'description', 'responsibilities', 'requirements', 'benefits', 'work_setup'];
                } catch (e) {
                    console.error("Error parsing field_order from DB:", e);
                }
            });

            // --- CAMBIO CLAVE: Añadir los campos personalizados al final ---
            let customFieldsHTML = '';
            for (let i = 1; i <= 4; i++) {
                const label = jobData[`custom_${i}_label`];
                const value = jobData[`custom_${i}_value`];
                const isHidden = jobData[`custom_${i}_hidden`];

                if (label && !isHidden) {
                    customFieldsHTML += `
                        <h4>${label}</h4>
                        <p>${value || 'N/A'}</p>
                    `;

}

            jobDetailsElement.innerHTML = finalHTML + customFieldsHTML + `<a href="cv.html" class="btn">Apply Now</a>`;

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
});

