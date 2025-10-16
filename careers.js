document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN DE SUPABASE ---
    const SUPABASE_URL = 'https://hxnikfmwknlxmkqcsrol.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmlrZm13a25seG1rcWNzcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTUwNTksImV4cCI6MjA3NTE3MTA1OX0.G2b3hFEvpvOFpiFFk_a2os-7mFOgsZz6pj_YMihvv5A';
    
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const jobDetailsElement = document.getElementById('job-details');

    // --- FUNCIÓN PARA CARGAR DATOS DESDE SUPABASE ---
async function loadJobData() {
    const { data, error } = await supabase
        .from('job_posts')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        console.error('Error fetching data from Supabase:', error);
        return;
    }

    if (data) {
        console.log("Datos cargados desde Supabase.");
        
        // --- CAMBIO CLAVE: Construir el HTML dinámicamente ---
        let finalHTML = '';

        // 1. Primero, construir el HTML con los campos estándar y personalizados
        const standardFields = ['department', 'type', 'career_level', 'description', 'responsibilities', 'requirements', 'benefits', 'work_setup'];
        standardFields.forEach(fieldName => {
            switch (fieldName) {
                case 'department':
                    finalHTML += `<p><strong>Department:</strong> ${jobData.department || 'N/A'}</p>`;
                    break;
                case 'type':
                    finalHTML += `<p><strong>Type:</strong> ${jobData.type || 'N/A'}</p>`;
                    break;
                // ... (copia aquí los demás casos para el resto de los campos estándar)
            });
        });

        // 2. Luego, añadir los campos personalizados al final
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
        }

        // 3. Unir todo y mostrar en la página
        jobDetailsElement.innerHTML = finalHTML + customFieldsHTML + `<a href="cv.html" class="btn">Apply Now</a>`;
    }

    // --- CARGAR DATOS AL INICIO ---
    loadJobFromSupabase();

    // --- SUSCRIPCIÓN A CAMBIOS EN TIEMPO REAL ---
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


    // --- LÓGICA PARA EL BOTÓN "SEE MORE / SEE LESS" ---
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
