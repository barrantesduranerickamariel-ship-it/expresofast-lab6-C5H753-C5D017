const API_URL = 'http://localhost:8080/api/envios';
let enviosLocales = [];
let filtroActual = 'TODOS';

document.addEventListener('DOMContentLoaded', () => {
    cargarEnvios();

    document.getElementById('envio-form').addEventListener('submit', registrarEnvio);

    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtroActual = e.target.dataset.filter;
            renderizarEnvios();
        });
    });
});

async function cargarEnvios() {
    try {
        const res = await fetch(`${API_URL}/optimizados`);
        enviosLocales = await res.json();
        renderizarEnvios();
    } catch (err) {
        console.error('Error al cargar envíos:', err);
    }
}

function renderizarEnvios() {
    const grid = document.getElementById('grid-envios');
    grid.innerHTML = '';

    const enviosFiltrados = enviosLocales.filter(e => 
        filtroActual === 'TODOS' ? true : e.estadoEnvio === filtroActual
    );

    enviosFiltrados.forEach(e => {
        const card = document.createElement('article');
        card.className = 'envio-card';
        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                    <strong>${e.codigoRastreo}</strong>
                    <span class="pill-status pill-${e.estadoEnvio}">${e.estadoEnvio.replace('_', ' ')}</span>
                </div>
                <p><strong>Destino:</strong> ${e.direccionDestino}</p>
                <p><strong>Peso:</strong> ${e.pesoKg} kg | <strong>Costo:</strong> ₡${e.costo}</p>
                <p><small><strong>Placa:</strong> ${e.vehiculo ? e.vehiculo.placa : 'N/A'}</small></p>
                <p><small><strong>Conductor:</strong> ${e.conductor ? e.conductor.nombre + ' ' + e.conductor.apellidos : 'N/A'}</small></p>
            </div>
            <div class="card-actions">
                ${e.estadoEnvio === 'PENDIENTE' ? `<button class="btn-sm btn-transito" onclick="actualizarEstado(${e.id}, 'EN_TRANSITO')">En Tránsito</button>` : ''}
                ${e.estadoEnvio === 'EN_TRANSITO' ? `<button class="btn-sm btn-entregado" onclick="actualizarEstado(${e.id}, 'ENTREGADO')">Entregado</button>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

async function registrarEnvio(e) {
    e.preventDefault();

    const payload = {
        codigoRastreo: document.getElementById('codigoRastreo').value.trim(),
        direccionDestino: document.getElementById('direccionDestino').value.trim(),
        pesoKg: parseFloat(document.getElementById('pesoKg').value),
        costo: parseFloat(document.getElementById('costo').value),
        estadoEnvio: 'PENDIENTE',
        vehiculo: { id: parseInt(document.getElementById('vehiculoId').value) },
        conductor: { id: parseInt(document.getElementById('conductorId').value) }
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            document.getElementById('envio-form').reset();
            cargarEnvios();
        } else {
            const errorMsg = await res.text();
            alert(`Error: ${errorMsg}`);
        }
    } catch (err) {
        console.error('Error al guardar envío:', err);
    }
}

async function actualizarEstado(id, nuevoEstado) {
    try {
        const res = await fetch(`${API_URL}/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estadoEnvio: nuevoEstado })
        });

        if (res.ok) {
            cargarEnvios();
        } else {
            alert('Error al actualizar el estado');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}