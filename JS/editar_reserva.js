const container = document.getElementById("aulas-container");
const grupoSelect = document.getElementById("grupo");

function cargarOpciones() {
    grupoSelect.innerHTML = `
        <option value="">-- Selecciona una opción --</option>
        <option value="Aulas">Aulas</option>
        <option value="Recursos">Recursos</option>
    `;
}


function crearBotonCrear(tipo) {
    const btnCrear = document.createElement("button");
    btnCrear.textContent = `Crear ${tipo.slice(0, -1)}`;
    btnCrear.style = "margin: 10px; padding:5px 10px; font-weight:bold;";
    btnCrear.addEventListener("click", () => abrirModalCreacion(tipo));
    container.appendChild(btnCrear);
}


function abrirModalCreacion(tipo) {
    const modal = document.createElement("div");
    modal.id = "modalCreate";
    modal.style = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.6); display:flex; justify-content:center;
        align-items:center; z-index:9999;
    `;

    let contenido = "";
    if (tipo === "Aulas") {
        contenido = `
            <h2>Crear Aula</h2>
            <label>Nombre:<br><input id="create_nombre"></label><br><br>
            <label>Cantidad:<br><input id="create_cantidad" type="number"></label><br><br>
            <label>Tipo:<br><input id="create_tipo"></label><br><br>
        `;
    } else {
        contenido = `
            <h2>Crear Recurso</h2>
            <label>Nombre:<br><input id="create_nombre"></label><br><br>
            <label>Estado:<br>
                <select id="create_estado">
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="RESERVADO">RESERVADO</option>
                </select>
            </label><br><br>
        `;
    }

    modal.innerHTML = `
        <div style="background:#fff; padding:20px; border-radius:8px; width:320px;">
            ${contenido}
            <button id="saveCreate">Crear</button>
            <button id="cancelCreate">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("cancelCreate").addEventListener("click", () => modal.remove());

    document.getElementById("saveCreate").addEventListener("click", () => {
        const body = {};
        
        if (tipo === "Aulas") {
            body.tipo = "aula"; 
            body.nombre = document.getElementById("create_nombre").value;
            body.cantidad = parseInt(document.getElementById("create_cantidad").value);
            body.tipo_aula = document.getElementById("create_tipo").value;

        } else {
            body.tipo = "recurso"; 
            body.nombre = document.getElementById("create_nombre").value;
            body.estado = document.getElementById("create_estado").value;
        }

        fetch(`../php/reservas/crear.php`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(resp => {
            alert(resp.message || (tipo === "Aulas" ? "Aula creada correctamente" : "Recurso creado correctamente"));
            modal.remove();
            tipo === "Aulas" ? get_aulas() : get_recursos();
        })
        .catch(err => {
            console.error(err);
            alert("Error al crear " + (tipo === "Aulas" ? "aula" : "recurso"));
        });
    });
}


function abrirModalEdicion(tipo, data) {
    const modal = document.createElement("div");
    modal.id = "modalEdit";
    modal.style = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.6); display:flex; justify-content:center;
        align-items:center; z-index:9999;
    `;

    let contenido = "";
    if (tipo === "aula") {
        contenido = `
            <h2>Editar Aula</h2>
            <label>Nombre:<br><input id="edit_nombre" value="${data.nombre}"></label><br><br>
            <label>Cantidad:<br><input id="edit_cantidad" type="number" value="${data.cantidad}"></label><br><br>
            <label>Tipo:<br><input id="edit_tipo" value="${data.tipo}"></label><br><br>
        `;
    } else {
        contenido = `
            <h2>Editar Recurso</h2>
            <label>Nombre:<br><input id="edit_nombre" value="${data.nombre}"></label><br><br>
            <label>Estado:<br>
                <select id="edit_estado">
                    <option value="DISPONIBLE" ${data.estado === "DISPONIBLE" ? "selected" : ""}>DISPONIBLE</option>
                    <option value="RESERVADO" ${data.estado === "RESERVADO" ? "selected" : ""}>RESERVADO</option>
                </select>
            </label><br><br>
        `;
    }

    modal.innerHTML = `
        <div style="background:#fff; padding:20px; border-radius:8px; width:320px;">
            ${contenido}
            <button id="saveEdit">Guardar</button>
            <button id="deleteItem" style="background:red;color:white;">Eliminar</button>
            <button id="cancelEdit">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("cancelEdit").addEventListener("click", () => modal.remove());

    document.getElementById("saveEdit").addEventListener("click", () => {
        const body = { id: data.id };
        if (tipo === "aula") {
            body.nombre = document.getElementById("edit_nombre").value;
            body.cantidad = document.getElementById("edit_cantidad").value;
            body.tipo = document.getElementById("edit_tipo").value;
        } else {
            body.nombre = document.getElementById("edit_nombre").value;
            body.estado = document.getElementById("edit_estado").value;
        }

        fetch(`../php/reservas/editar_${tipo}.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(resp => {
            alert(resp.message || "Actualizado correctamente");
            modal.remove();
            tipo === "aula" ? get_aulas() : get_recursos();
        })
        .catch(err => {
            console.error(err);
            alert("Error al actualizar");
        });
    });

    
    document.getElementById("deleteItem").addEventListener("click", () => {
        if (!confirm("¿Estás seguro de eliminar?")) return;
        const url = tipo === "aula" ? "../php/reservas/eliminar_aula.php" : "../php/reservas/eliminar_recurso.php";
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.id })
        })
        .then(res => res.json())
        .then(resp => {
            alert(resp.message || "Eliminado correctamente");
            modal.remove();
            tipo === "aula" ? get_aulas() : get_recursos();
        })
        .catch(err => {
            console.error(err);
            alert("Error al eliminar");
        });
    });
}


function get_aulas() {
    container.innerHTML = `<div id="loading" style="text-align:center; margin-top:50px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
        <p>Cargando Aulas Para Editar/Crear...</p>
    </div>`;
    fetch(`../php/reservas/reservas.php?valor=Aulas`)
        .then(res => res.json())
        .then(data => {
            const loading = document.getElementById("loading");
            if(loading) loading.remove();
            crearBotonCrear("Aulas");
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML += "<p style='text-align:center;'>No hay aulas registradas.</p>";
                return;
            }
            data.forEach(aula => {
                const div = document.createElement("div");
                div.className = "text_box";
                div.innerHTML = `
                    <div class="text_box_inner">
                        <div class="text_box_img"><img src="aula1.jpg" alt="${aula.nombre}"></div>
                        <div class="text_box_content">
                            <h2>${aula.nombre}</h2>
                            <p>Capacidad: ${aula.cantidad} personas</p>
                            <p>Tipo: ${aula.tipo}</p>
                            <button class="editarAula" 
                                data-id="${aula.id_aula}" 
                                data-nombre="${aula.nombre}" 
                                data-cantidad="${aula.cantidad}" 
                                data-tipo="${aula.tipo}">
                                Editar/Eliminar
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });

            document.querySelectorAll(".editarAula").forEach(btn => {
                btn.addEventListener("click", e => abrirModalEdicion("aula", e.target.dataset));
            });
        });
}


function get_recursos() {
    container.innerHTML = `<div id="loading" style="text-align:center; margin-top:50px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
        <p>Cargando Recursos Para Editar/Crear...</p>
    </div>`;
    fetch(`../php/reservas/reservas.php?valor=Recursos`)
        .then(res => res.json())
        .then(data => {
            const loading = document.getElementById("loading");
            if(loading) loading.remove();
            crearBotonCrear("Recursos");
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML += "<p style='text-align:center;'>No hay recursos registrados.</p>";
                return;
            }
            data.forEach(recurso => {
                const div = document.createElement("div");
                div.className = "text_box";
                div.innerHTML = `
                    <div class="text_box_inner">
                        <div class="text_box_img"><img src="recurso.jpg" alt="${recurso.nombre}"></div>
                        <div class="text_box_content">
                            <h2>${recurso.nombre}</h2>
                            <p>Estado: ${recurso.estado}</p>
                            <button class="editarRecurso" 
                                data-id="${recurso.id_recurso}" 
                                data-nombre="${recurso.nombre}" 
                                data-estado="${recurso.estado}">
                                Editar/Eliminar
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });

            document.querySelectorAll(".editarRecurso").forEach(btn => {
                btn.addEventListener("click", e => abrirModalEdicion("recurso", e.target.dataset));
            });
        });
}


function manejarSeleccion(valor) {
    if (valor === "Aulas") get_aulas();
    else if (valor === "Recursos") get_recursos();
    else container.innerHTML = "";
}


document.addEventListener("DOMContentLoaded", () => {
    cargarOpciones();
    grupoSelect.addEventListener("change", () => manejarSeleccion(grupoSelect.value));
    grupoSelect.value = "Aulas";
    get_aulas();
});
