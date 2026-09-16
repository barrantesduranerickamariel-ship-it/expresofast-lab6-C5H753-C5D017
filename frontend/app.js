const API_URL = 'http://localhost:8080/api/envios';
let enviosLocales = [];
let bitacoraActual = [];
let filtroActual = 'TODOS';

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = 'login.html';
        return null;
    }

    return response;
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    aplicarPermisosPorRol();

    cargarEnvios();

    const formEnvio = document.getElementById('envio-form');
    if (formEnvio) {
        formEnvio.addEventListener('submit', registrarEnvio);
    }

    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtroActual = e.target.dataset.filter;
            renderizarEnvios();
        });
    });
});

function obtenerRoles() {
    try {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles) : [];
    } catch (e) {
        return [];
    }
}

function aplicarPermisosPorRol() {
    const roles = obtenerRoles();
    const esConductor = roles.includes('ROLE_CONDUCTOR');

    if (esConductor) {
        const seccionFormulario = document.getElementById('seccion-formulario');
        if (seccionFormulario) seccionFormulario.style.display = 'none';

        const pestañaFlotas = document.getElementById('tab-flotas');
        if (pestañaFlotas) pestañaFlotas.style.display = 'none';
    }
}

async function cargarEnvios() {
    try {
        const res = await fetchWithAuth(`${API_URL}/optimizados`);
        if (!res || !res.ok) return;

        enviosLocales = await res.json();
        renderizarEnvios();
    } catch (err) {
        console.error('Error al cargar envíos:', err);
    }
}

function renderizarEnvios() {
    const grid = document.getElementById('grid-envios');
    if (!grid) return;
    
    grid.innerHTML = '';

    const roles = obtenerRoles();
    const esAdminUOperador = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OPERADOR');

    const enviosFiltrados = enviosLocales.filter(e => 
        filtroActual === 'TODOS' ? true : e.estadoEnvio === filtroActual
    );

    enviosFiltrados.forEach(e => {
        const card = document.createElement('article');
        card.className = 'envio-card';
        
        const botonBitacoraHtml = esAdminUOperador 
            ? `<button class="btn-sm btn-bitacora" onclick="verBitacora(${e.id})">Ver Bitácora</button>` 
            : '';

        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                    <strong>${e.codigoRastreo}</strong>
                    <span class="pill-status pill-${e.estadoEnvio}">${e.estadoEnvio ? e.estadoEnvio.replace('_', ' ') : ''}</span>
                </div>
                <p><strong>Destino:</strong> ${e.direccionDestino}</p>
                <p><strong>Peso:</strong> ${e.pesoKg} kg | <strong>Costo:</strong> ₡${e.costo}</p>
                <p><small><strong>Placa:</strong> ${e.vehiculo ? e.vehiculo.placa : 'N/A'}</small></p>
                <p><small><strong>Conductor:</strong> ${e.conductor ? e.conductor.nombre + ' ' + e.conductor.apellidos : 'N/A'}</small></p>
            </div>
            <div class="card-actions">
                ${e.estadoEnvio === 'PENDIENTE' ? `<button class="btn-sm btn-transito" onclick="actualizarEstado(${e.id}, 'EN_TRANSITO')">En Tránsito</button>` : ''}
                ${e.estadoEnvio === 'EN_TRANSITO' ? `<button class="btn-sm btn-entregado" onclick="actualizarEstado(${e.id}, 'ENTREGADO')">Entregado</button>` : ''}
                ${botonBitacoraHtml}
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
        vehiculoId: parseInt(document.getElementById('vehiculoId').value),
        conductorId: parseInt(document.getElementById('conductorId').value)
    };

    try {
        const res = await fetchWithAuth(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res && res.ok) {
            document.getElementById('envio-form').reset();
            cargarEnvios();
        } else if (res) {
            const errorMsg = await res.text();
            alert(`Error: ${errorMsg}`);
        }
    } catch (err) {
        console.error('Error al guardar envío:', err);
    }
}

async function actualizarEstado(id, nuevoEstado) {
    try {
        const res = await fetchWithAuth(`${API_URL}/${id}/estado`, {
            method: 'PATCH',
            body: JSON.stringify({ estadoEnvio: nuevoEstado })
        });

        if (res && res.ok) {
            cargarEnvios();
        } else if (res) {
            alert('Error al actualizar el estado');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}


async function verBitacora(envioId) {
    try {
        const res = await fetchWithAuth(`${API_URL}/${envioId}/bitacora`);
        if (!res || !res.ok) {
            alert('No se pudo obtener el historial de bitácora.');
            return;
        }

        bitacoraActual = await res.json();
        
        const inputInicio = document.getElementById('fechaInicio');
        const inputFin = document.getElementById('fechaFin');
        if (inputInicio) inputInicio.value = '';
        if (inputFin) inputFin.value = '';

        renderizarTablaBitacora(bitacoraActual);
        document.getElementById('modal-bitacora').style.display = 'flex';
    } catch (err) {
        console.error('Error al cargar la bitácora:', err);
    }
}

function renderizarTablaBitacora(listaBitacora) {
    const tbody = document.getElementById('contenido-bitacora');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (!listaBitacora || listaBitacora.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay registros para el rango seleccionado.</td></tr>';
        return;
    }

    listaBitacora.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${b.estadoAnterior || 'INICIO'}</strong> &rarr; <strong>${b.estadoNuevo}</strong></td>
            <td>${b.fechaHora ? new Date(b.fechaHora).toLocaleString() : 'N/A'}</td>
            <td>${b.usuario || 'Sistema'}</td>
            <td>${b.observaciones || 'Sin observaciones'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrarBitacoraPorFechas() {
    const fechaInicioVal = document.getElementById('fechaInicio').value;
    const fechaFinVal = document.getElementById('fechaFin').value;

    const fechaInicio = fechaInicioVal ? new Date(fechaInicioVal + 'T00:00:00') : null;
    const fechaFin = fechaFinVal ? new Date(fechaFinVal + 'T23:59:59') : null;

    const filtrados = bitacoraActual.filter(b => {
        if (!b.fechaHora) return false;
        const fechaRegistro = new Date(b.fechaHora);

        if (fechaInicio && fechaRegistro < fechaInicio) return false;
        if (fechaFin && fechaRegistro > fechaFin) return false;

        return true;
    });

    renderizarTablaBitacora(filtrados);
}

function limpiarFiltroFechas() {
    const inputInicio = document.getElementById('fechaInicio');
    const inputFin = document.getElementById('fechaFin');
    if (inputInicio) inputInicio.value = '';
    if (inputFin) inputFin.value = '';
    renderizarTablaBitacora(bitacoraActual);
}

function cerrarModalBitacora() {
    const modal = document.getElementById('modal-bitacora');
    if (modal) modal.style.display = 'none';
}