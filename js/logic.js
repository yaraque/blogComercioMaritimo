// CONFIGURACIÓN
// Reemplaza esto con TU URL de SheetDB
const API_URL = 'https://sheetdb.io/api/v1/itgh1zyxesbio';

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------
    // 1. SI ESTAMOS EN UNA PÁGINA DE CONTENIDO (LEER)
    // ---------------------------------------------
    const contenedorLista = document.getElementById('lista-comentarios');

    if (contenedorLista) {
        const temaActual = contenedorLista.getAttribute('data-tema');

        fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos:", data); // Para depuración
            contenedorLista.innerHTML = ''; 
            
            // CORRECCIÓN PRO:
            // Si el tema de la página es "general" (Inicio), muestra TODOS los comentarios.
            // Si es otro tema (estrecho/bocono), filtra solo los de ese tema.
            const comentariosFiltrados = data.filter(item => {
                if (temaActual === 'general') return true; // Muestra todo en el inicio
                return !temaActual || item.tema === temaActual;
            });

            if(comentariosFiltrados.length === 0) {
                contenedorLista.innerHTML = '<p>Aún no hay comentarios. ¡Sé el primero!</p>';
                return;
            }

            // Mostrar los últimos primero (Reverse)
            comentariosFiltrados.reverse().forEach(item => {
                const div = document.createElement('div');
                div.className = 'comentario-item';
                
                // Etiqueta pequeña para saber de qué tema hablan (solo en el inicio)
                const etiquetaTema = temaActual === 'general' && item.tema 
                    ? `<span style="font-size:0.8em; background:#eee; padding:2px 6px; border-radius:4px; margin-left:10px; text-transform:uppercase;">${item.tema}</span>` 
                    : '';

                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${item.usuario} ${etiquetaTema}</strong>
                        <span class="stars">${'★'.repeat(item.puntuacion || 0)}</span>
                    </div>
                    <p style="margin: 5px 0;">${item.comentario}</p>
                    <small style="color:#666">Fecha: ${item.fecha}</small>
                `;
                contenedorLista.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error cargando:', error);
            contenedorLista.innerHTML = '<p>Error cargando comentarios. Revisa tu conexión.</p>';
        });
    }

    // ---------------------------------------------
    // 2. SI ESTAMOS EN LA PÁGINA DEL FORMULARIO (ESCRIBIR)
    // ---------------------------------------------
    const formulario = document.getElementById('commentForm');

    if(formulario){
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = formulario.querySelector('button');
            const origen = document.getElementById('origen_tema').value;
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            const datos = {
                id: 'INCREMENT',
                fecha: new Date().toLocaleDateString(),
                usuario: document.getElementById('nombre').value,
                puntuacion: document.getElementById('puntuacion').value,
                comentario: document.getElementById('mensaje').value,
                tema: origen
            };

            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: datos })
            })
            .then(response => response.json())
            .then(data => {
                alert('¡Gracias por tu opinión!');
                // Redireccionar
                if(origen === 'estrecho') window.location.href = 'estrecho.html';
                else if (origen === 'bocono') window.location.href = 'bocono.html';
                else window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al guardar.');
                btn.textContent = 'Reintentar';
                btn.disabled = false;
            });
        });
    }
});