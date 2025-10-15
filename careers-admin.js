document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN ---
    const SUPABASE_URL = 'https://hxnikfmwknlxmkqcsrol.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmlrZm13a25seG1rcWNzcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTUwNTksImV4cCI6MjA3NTE3MTA1OX0.G2b3hFEvpvOFpiFFk_a2os-7mFOgsZz6pj_YMihvv5A';
    const ADMIN_PASSWORD = 'neuron2025';
    const MAX_CUSTOM_FIELDS = 4;


// --- AÑADE ESTE EVENT LISTENER ---
document.getElementById('login-button').addEventListener('click', () => {
    checkPassword();
});

// Permitir entrar con la tecla "Enter"
document.getElementById('password-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
});





    
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let activeCustomFields = 0;
    let sortable;

    // --- LÓGICA DE LOGIN ---
    function checkPassword() {
        const passwordInput = document.getElementById('password-input').value;
        if (passwordInput === ADMIN_PASSWORD) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('edit-form-container').style.display = 'block';
            loadJobData();
        } else {
            alert('Incorrect password. Please try again.');
        }
    }
    document.getElementById('password-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') { checkPassword(); }
    });

    // --- LÓGICA DE CAMPOS PERSONALIZADOS ---
    function createCustomField(index, data = {}) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'custom-field-group draggable-field';
        fieldDiv.dataset.fieldName = `custom_${index}`;
        fieldDiv.innerHTML = `
            <div class="field-controls">
                <h4>Custom Field ${index}</h4>
                <div>
                    <label style="font-weight: normal; margin-right: 15px;">
                        <input type="checkbox" name="custom_${index}_hidden" ${data.hidden ? 'checked' : ''}> Hide on Website
                    </label>
                    <button type="button" class="btn-remove-custom">Remove</button>
                </div>
            </div>
            <label>Field Label (e.g., "Salary")</label>
            <input type="text" name="custom_${index}_label" placeholder="e.g., Salary" value="${data.label || ''}" required>
            <label>Field Content</label>
            <textarea name="custom_${index}_value" placeholder="e.g., $500 - $800 per month.">${data.value || ''}</textarea>
        `;
        return fieldDiv;
    }

    function updateAddButtonState() {
        const addBtn = document.getElementById('add-custom-field-btn');
        if (activeCustomFields >= MAX_CUSTOM_FIELDS) {
            addBtn.style.display = 'none';
        } else {
            addBtn.style.display = 'block';
        }
    }
    
    document.getElementById('add-custom-field-btn').addEventListener('click', () => {
        if (activeCustomFields >= MAX_CUSTOM_FIELDS) {
            alert('Limit of custom fields created. You can only have ' + MAX_CUSTOM_FIELDS + '.');
            return;
        }
        const nextIndex = activeCustomFields + 1;
        const container = document.getElementById('custom-fields-container');
        const newField = createCustomField(nextIndex, {});
        container.prepend(newField);
        activeCustomFields++;
        updateAddButtonState();
    });

    document.getElementById('custom-fields-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove-custom')) {
            e.target.closest('.custom-field-group').remove();
            activeCustomFields--;
            updateAddButtonState();
        }
    });

    // --- LÓGICA DE ORDENAMIENTO ---
    function initializeSortable() {
        const container = document.getElementById('sortable-fields-container');
        if (container) {
            sortable = new Sortable(container, {
                animation: 150,
                handle: '.draggable-field',
                ghostClass: 'sortable-ghost',
                dragClass: 'sortable-drag',
                onEnd: () => saveFieldOrder()
            });
        }
    }

    async function saveFieldOrder() {
        const allFields = document.querySelectorAll('#sortable-fields-container .draggable-field');
        const fieldOrder = Array.from(allFields).map(el => el.dataset.fieldName);
        const { error } = await supabase
            .from('job_posts')
            .update({ field_order: JSON.stringify(fieldOrder) })
            .eq('id', 1);
        if (error) {
            console.error('Error saving field order:', error);
            alert('Could not save the new order.');
        } else {
            console.log('Field order saved:', fieldOrder);
        }
    }

    // --- LÓGICA DEL FORMULARIO ---
    const form = document.getElementById('job-form');
    const statusDiv = document.getElementById('status-message');

// --- Reemplaza la función loadJobData ---
// --- Reemplaza toda la función loadJobData por esta versión ---
async function loadJobData() {
    const { data, error } = await supabase.from('job_posts').select('*').eq('id', 1).single();
    if (error) { console.error(error); return; }

    // Cargar campos estándar
    Object.keys(data).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input && !key.startsWith('custom_')) {
            input.value = data[key] || '';
        }
    });

    // Cargar campos personalizados
    const container = document.getElementById('custom-fields-container');
    const wrapper = document.getElementById('custom-section-wrapper');
    container.innerHTML = ''; 
    activeCustomFields = 0;

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
    initializeSortable();
}

// --- Reemplaza el evento del botón add-custom-field-btn ---
document.getElementById('add-custom-field-btn').addEventListener('click', () => {
    if (activeCustomFields >= MAX_CUSTOM_FIELDS) {
        alert('Limit of custom fields created. You can only have ' + MAX_CUSTOM_FIELDS + '.');
        return;
    }
    
    // --- CAMBIO CLAVE: Mostrar la sección cuando se añade el primer campo ---
    const wrapper = document.getElementById('custom-section-wrapper');
    if (wrapper.style.display === 'none') {
        wrapper.style.display = 'block';
    }

    const nextIndex = activeCustomFields + 1;
    const container = document.getElementById('custom-fields-container');
    const newField = createCustomField(nextIndex, {});
    container.prepend(newField);
    
    activeCustomFields++;
    updateAddButtonState();
});

        const fieldContainer = document.getElementById('sortable-fields-container');
        const allDraggableFields = Array.from(fieldContainer.querySelectorAll('.draggable-field'));
        let savedOrder = [];
        try {
            savedOrder = data.field_order ? JSON.parse(data.field_order) : [];
        } catch (e) { console.error("Error parsing field_order from DB:", e); }
        
        const sortedFields = [];
        savedOrder.forEach(fieldName => {
            const field = allDraggableFields.find(el => el.dataset.fieldName === fieldName);
            if (field) sortedFields.push(field);
        });
        allDraggableFields.forEach(field => {
            if (!sortedFields.includes(field)) sortedFields.push(field);
        });

        fieldContainer.innerHTML = '';
        sortedFields.forEach(field => {
            if(field) fieldContainer.appendChild(field);
        });
        
        initializeSortable();
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
