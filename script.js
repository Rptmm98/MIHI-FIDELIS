// 1. Instalación del Service Worker (Hace que sea una App instalable PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado', reg))
            .catch(err => console.error('Error en Service Worker', err));
    });
}

// 2. Conexión a Supabase desde el cliente web
// NOTA: Usa tu clave 'anon' pública aquí, la que empieza con eyJhbG...
const supabaseUrl = 'https://rpqgsfygpnmjdzvshsve.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwcWdzZnlncG5tamR6dnNoc3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjAwMjgsImV4cCI6MjA5NjQ5NjAyOH0.AiwdV_797xhYC725rQWoHoI-Id2RJp9g6w4B6Qpf_Xs'; 
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 3. Lógica para crear el usuario (cliente)
const form = document.getElementById('registerForm');
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    
    statusMessage.textContent = 'Registrando cliente...';
    statusMessage.className = '';

    try {
        // Insertar en la tabla customers de Supabase
        const { data, error } = await supabaseClient
            .from('customers')
            .insert([{ name: name, phone: phone }])
            .select();

        if (error) throw error;

        statusMessage.textContent = '¡Cliente registrado con éxito!';
        statusMessage.className = 'success';
        form.reset(); // Limpiar el formulario
        
        console.log('ID del nuevo cliente:', data[0].id);

    } catch (error) {
        statusMessage.textContent = error.code === '23505' ? 'Este teléfono ya está registrado' : 'Error: ' + error.message;
        statusMessage.className = 'error';
    }
});