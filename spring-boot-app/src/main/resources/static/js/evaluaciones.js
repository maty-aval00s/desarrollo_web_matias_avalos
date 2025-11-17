let avisoIdActual = null;

function evaluarAviso(button) {
    avisoIdActual = button.getAttribute('data-aviso-id');
    const modal = document.getElementById('modalEvaluar');
    const mensaje = document.getElementById('mensajeModal');
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.getElementById('modalEvaluar');
    modal.style.display = 'none';
    avisoIdActual = null;
}

function seleccionarNota(nota) {
    if (nota < 1 || nota > 7 || !Number.isInteger(nota)) {
        mostrarMensaje('La nota debe ser un número entero entre 1 y 7', 'error');
        return;
    }
    
    if (!avisoIdActual) {
        mostrarMensaje('Error: No hay un aviso seleccionado', 'error');
        return;
    }
    
    const datos = {
        avisoId: parseInt(avisoIdActual),
        nota: nota
    };
    fetch('/api/notas/agregar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Error al agregar la nota');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            actualizarPromedio(avisoIdActual, data.nuevoPromedio);
            mostrarMensaje('Nota agregada correctamente', 'exito');
            
            setTimeout(() => {
                cerrarModal();
            }, 1500);
        } else {
            mostrarMensaje(data.message || 'Error al agregar la nota', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje(error.message || 'Error al comunicarse con el servidor', 'error');
    });
}

function actualizarPromedio(avisoId, nuevoPromedio) {
    const elementoNota = document.getElementById('nota-' + avisoId);
    if (elementoNota) {
        const promedio = parseFloat(nuevoPromedio);
        
        if (isNaN(promedio) || promedio === 0.0 || nuevoPromedio === null) {
            elementoNota.textContent = '-';
        } else {
            elementoNota.textContent = promedio.toFixed(1);
        }
        
        elementoNota.classList.add('actualizado');
        setTimeout(() => {
            elementoNota.classList.remove('actualizado');
        }, 1000);
    }
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensajeModal');
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
}

window.onclick = function(event) {
    const modal = document.getElementById('modalEvaluar');
    if (event.target === modal) {
        cerrarModal();
    }
}
