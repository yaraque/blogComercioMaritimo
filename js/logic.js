// CONFIGURACIÓN
// ¡IMPORTANTE! Reemplaza esto con TU URL de SheetDB que obtuviste en el Paso 2
const API_URL = 'https://sheetdb.io/api/v1/itgh1zyxesbio';

document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------
    // 1. SI ESTAMOS EN UNA PÁGINA DE CONTENIDO (LEER)
    // ---------------------------------------------
    const contenedorLista = document.getElementById('lista-comentarios');

    if (contenedorLista) {
        // Verificamos qué tema debemos cargar (estrecho o bocono)
        const temaActual = contenedorLista.getAttribute('data-tema');

        fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            contenedorLista.innerHTML = ''; 
            
            // Filtramos para mostrar solo los comentarios de esta página
            // Si no hay tema definido, muestra todos
            const comentariosFiltrados = data.filter(item => 
                !temaActual || item.tema === temaActual
            );

            if(comentariosFiltrados.length === 0) {
                contenedorLista.innerHTML = '<p>Aún no hay comentarios. ¡Sé el primero!</p>';
                return;
            }

            // Mostrar los últimos primero
            comentariosFiltrados.reverse().forEach(item => {
                const div = document.createElement('div');
                div.className = 'comentario-item';
                div.innerHTML = `
                    <strong>${item.usuario}</strong> 
                    <span class="stars">${'★'.repeat(item.puntuacion)}</span>
                    <p>${item.comentario}</p>
                    <small style="color:#666">Fecha: ${item.fecha}</small>
                `;
                contenedorLista.appendChild(div);
            });
        })
        .catch(error => console.error('Error cargando:', error));
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
                tema: origen // Guardamos a qué tema pertenece
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
                
                // REDIRECCIONAR AL USUARIO A LA PAGINA DE DONDE VINO
                if(origen === 'estrecho') {
                    window.location.href = 'estrecho.html';
                } else if (origen === 'bocono') {
                    window.location.href = 'bocono.html';
                } else {
                    window.location.href = 'index.html';
                }
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