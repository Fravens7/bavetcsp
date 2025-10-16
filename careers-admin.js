document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = 'https://hxnikfmwknlxmkqcsrol.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmlrZm13a25seG1rcWNzcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTUwNTksImV4cCI6MjA3NTE3MTA1OX0.G2b3hFEvpvOFpiFFk_a2os-7mFOgsZz6pj_YMihvv5A';
  const ADMIN_PASSWORD = 'neuron2025';
  const MAX_CUSTOM_FIELDS = 4;

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const loginContainer = document.getElementById('login-container');
  const editFormContainer = document.getElementById('edit-form-container');
  const form = document.getElementById('job-form');
  const statusDiv = document.getElementById('status-message');
  const customContainer = document.getElementById('custom-fields-container');
  const customWrapper = document.getElementById('custom-section-wrapper');

  let activeCustomFields = 0;
  let sortable;

  // --- LOGIN ---
  function checkPassword() {
    const password = document.getElementById('password-input').value;
    if (password === ADMIN_PASSWORD) {
      loginContainer.style.display = 'none';
      editFormContainer.style.display = 'block';
      loadJobData();
    } else {
      alert('Incorrect password.');
    }
  }

  document.getElementById('login-button').addEventListener('click', checkPassword);
  document.getElementById('password-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkPassword();
  });

  // --- CAMPOS PERSONALIZADOS ---
  function createCustomField(index, data = {}) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'custom-field-group';
    fieldDiv.dataset.fieldName = `custom_${index}`;
    fieldDiv.innerHTML = `
      <div class="field-controls">
        <h4>Custom Field ${index}</h4>
        <div>
          <button type="button" class="btn-remove-custom">Remove</button>
          <label style="font-weight: normal; margin-left: 15px;">
            <input type="checkbox" name="custom_${index}_hidden" ${data.hidden ? 'checked' : ''}> Hide on Website
          </label>
        </div>
      </div>
      <label>Field Label</label>
      <input type="text" name="custom_${index}_label" value="${data.label || ''}" required>
      <label>Field Content</label>
      <textarea name="custom_${index}_value">${data.value || ''}</textarea>
    `;
    return fieldDiv;
  }

function updateAddButtonState() {
  // Mostrar el botón solo si hay menos de MAX_CUSTOM_FIELDS
  addBtn.style.display = activeCustomFields >= MAX_CUSTOM_FIELDS ? 'none' : 'block';

  // Mostrar el contenedor solo si hay al menos un campo
  customWrapper.style.display = activeCustomFields > 0 ? 'block' : 'none';
}



  document.getElementById('add-custom-field-btn').addEventListener('click', () => {
    if (activeCustomFields >= MAX_CUSTOM_FIELDS) {
      alert('Limit of 4 custom fields.');
      return;
    }
    customWrapper.style.display = 'block';
    const newField = createCustomField(activeCustomFields + 1, {});
    customContainer.appendChild(newField);
    activeCustomFields++;
    updateAddButtonState();
  });

  customContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-custom')) {
      e.target.closest('.custom-field-group').remove();
      activeCustomFields--;
      updateAddButtonState();
    }
  });

  // --- SORTABLE CAMPOS ---
  function initializeSortable() {
    const container = document.getElementById('sortable-fields-container');
    sortable = new Sortable(container, {
      animation: 150,
      handle: '#department-handle',
      ghostClass: 'sortable-ghost',
      onEnd: saveFieldOrder
    });
  }

  async function saveFieldOrder() {
    const allFields = document.querySelectorAll('#sortable-fields-container .draggable-field');
    const fieldOrder = Array.from(allFields).map(el => el.dataset.fieldName);
    const { error } = await supabase
      .from('job_posts')
      .update({ field_order: JSON.stringify(fieldOrder) })
      .eq('id', 1);
    if (error) console.error('Error saving field order:', error);
    else console.log('Field order saved:', fieldOrder);
  }

  // --- CARGAR DATOS ---
  async function loadJobData() {
    const { data, error } = await supabase.from('job_posts').select('*').eq('id', 1).single();
    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    // Llenar campos estándar
    Object.keys(data).forEach(key => {
      const input = document.querySelector(`[name="${key}"]`);
      if (input && !key.startsWith('custom_')) {
        input.value = data[key] || '';
      }
    });

    // Llenar campos personalizados
    customContainer.innerHTML = '';
    activeCustomFields = 0;
    for (let i = 1; i <= MAX_CUSTOM_FIELDS; i++) {
      const label = data[`custom_${i}_label`];
      if (label) {
        const fieldData = {
          label,
          value: data[`custom_${i}_value`],
          hidden: data[`custom_${i}_hidden`]
        };
        const field = createCustomField(i, fieldData);
        customContainer.appendChild(field);
        activeCustomFields++;
      }
    }

    if (activeCustomFields > 0) customWrapper.style.display = 'block';
    updateAddButtonState();
    initializeSortable();
  }

  // --- GUARDAR CAMBIOS ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusDiv.textContent = 'Saving...';
    statusDiv.className = 'status';

    const formData = new FormData(form);
    const updatedData = Object.fromEntries(formData.entries());

    // Convertir checkboxes a booleanos
    for (let i = 1; i <= MAX_CUSTOM_FIELDS; i++) {
      updatedData[`custom_${i}_hidden`] = form.querySelector(`[name="custom_${i}_hidden"]`)?.checked || false;
    }

    const { error } = await supabase.from('job_posts').update(updatedData).eq('id', 1);
    if (error) {
      statusDiv.textContent = `Error: ${error.message}`;
      statusDiv.className = 'status error';
    } else {
      statusDiv.textContent = '✅ Changes saved successfully!';
      statusDiv.className = 'status success';
    }
  });
});
