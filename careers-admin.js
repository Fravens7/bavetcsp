document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN ---
    const SUPABASE_URL = 'https://hxnikfmwknlxmkqcsrol.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmlrZm13a25seG1rcWNzcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTUwNTksImV4cCI6MjA3NTE3MTA1OX0.G2b3hFEvpvOFpiFFk_a2os-7mFOgsZz6pj_YMihvv5A';
    const ADMIN_PASSWORD = 'neuron2025';
    const MAX_CUSTOM_FIELDS = 4;

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let activeCustomFields = 0;
    let sortable;

    // --- LÓGICA DE LOGIN ---
    function checkPassword() { /* ... */ }
    document.getElementById('login-button').addEventListener('click', () => { checkPassword(); });
    document.getElementById('password-input').addEventListener('keyup', function(event) { if (event.key === 'Enter') { checkPassword(); } });

    // --- LÓGICA DE CAMPOS PERSONALIZADOS ---
    function createCustomField(index, data = {}) { /* ... */ }
    function updateAddButtonState() { /* ... */ }
    document.getElementById('add-custom-field-btn').addEventListener('click', () => { /* ... */ });
    document.getElementById('custom-fields-container').addEventListener('click', (e) => { /* ... */ });

    // --- LÓGICA DE ORDENAMIENTO ---
    function initializeSortable() {
        const container = document.getElementById('sortable-fields-container');
        if (container) {
            sortable = new Sortable(container, {
                animation: 150,
                handle: '#department-handle',
                ghostClass: 'sortable-ghost',
                dragClass: 'sortable-drag',
                onEnd: () => saveFieldOrder()
            });
        }
    }

    async function saveFieldOrder() { /* ... */ }

    // --- LÓGICA DEL FORMULARIO ---
    const form = document.getElementById('job-form');
    const statusDiv = document.getElementById('status-message');

    async function loadJobData() {
        const { data, error } = await supabase.from('job_posts').select('*').eq('id', 1).single();
        if (error) { console.error(error); return; }

        Object.keys(data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input && !key.startsWith('custom_')) {
                input.value = data[key] || '';
            }
        });

        const container = document.getElementById('custom-fields-container');
        const wrapper = document.getElementById('custom-section-wrapper');
        container.innerHTML = ''; activeCustomFields = 0;

        for (let i = 1; i <= MAX_CUSTOM_FIELDS; i++) {
            const label = data[`custom_${i}_label`];
            if (label) {
                const fieldData = { label: data[`custom_${i}_label`], value: data[`custom_${i}_value`], hidden: data[`custom_${i}_hidden`] };
                const newField = createCustomField(i, fieldData);
                container.appendChild(newField);
                activeCustomFields++;
            }
        }

        if (activeCustomFields > 0) {
            wrapper.style.display = 'block';
        }

        updateAddButtonState();
        initializeSortable(); // Llamar a SortableJS después de que los campos están en el DOM
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusDiv.textContent = 'Saving...';
        statusDiv.className = 'status';
        const formData = new FormData(form);
        const updatedData = Object.fromEntries(formData.entries());
        const { data, error } = await supabase.from('job_posts').update(updatedData).eq('id', 1);
        if (error) {
            statusDiv.textContent = `Error saving changes: ${error.message}`;
            statusDiv.className = 'status error';
        } else {
            statusDiv.textContent = 'Changes saved successfully!';
            statusDiv.className = 'status success';
        }
    });

    // Inicializar
    loadJobData();
});
