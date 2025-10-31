const grupoSelect = document.getElementById("grupo");
const tablaBody = document.querySelector(".tabla-asistencia tbody");
const addRowBtn = document.getElementById("addRow");
const loading = document.getElementById("loading");

function cargarAsistencia() {
    fetch(`../php/asistencias_data/asistencia_get.php?grupo=${grupoSelect.value}`)
        .then(res => res.json())
        .then(data => {
            if (loading) loading.remove();
            tablaBody.innerHTML = "";

            const filas = {};
            let maxHora = 0;

            data.forEach(item => {
                const hInicio = parseInt(item.hora);
                const hFin = parseInt(item.hora_fin) || hInicio;

                for (let h = hInicio; h <= hFin; h++) {
                    if (!filas[h]) filas[h] = {};
                    filas[h][item.dia] = {
                        materia: item.materia,
                        id: item.id,
                        start: hInicio,
                        end: hFin,
                        estado: item.estado || "si" // valor por defecto
                    };
                }

                if (hFin > maxHora) maxHora = hFin;
            });

            for (let h = 1; h <= maxHora; h++) {
                const fila = filas[h] || {};
                const tr = document.createElement("tr");

                ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].forEach(dia => {
                    const celdaData = fila[dia];
                    if (celdaData) {
                        tr.innerHTML += `
                        <td>
                            <div contenteditable="true">${celdaData.materia}</div>
                            <div style="font-size: 12px; font-weight: bold; color: red; margin-bottom: 2px;">Asiste?</div>
                            <select class="estado-select" data-id="${celdaData.id}">
                                <option value="si" ${celdaData.estado === "si" ? "selected" : ""}>Sí</option>
                                <option value="no" ${celdaData.estado === "no" ? "selected" : ""}>No</option>
                            </select>
                        </td>
                    `;
                    } else {
                        tr.innerHTML += `<td></td>`;
                    }
                });

                tr.innerHTML = `<td>${h}-${h}</td>` + tr.innerHTML;
                tr.innerHTML += `<td>
                <button class="btn-guardar" data-ids='${JSON.stringify(Object.values(fila).map(x => x.id))}'>Guardar</button>
                <button class="btn-eliminar" data-ids='${JSON.stringify(Object.values(fila).map(x => x.id))}'>Eliminar</button>
            </td>`;

                tablaBody.appendChild(tr);
            }

            // Agregar listener a los select de estado
            tablaBody.querySelectorAll(".estado-select").forEach(select => {
                select.addEventListener("change", () => {
                    const id = select.dataset.id;
                    const estado = select.value;

                    // Actualizar la DB sin recargar la página
                    fetch("../php/asistencias_data/guardar_asistencia.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            accion: "guardar",
                            id,
                            estado
                        })
                    });
                });
            });
        });
}


// Cambiar grupo
grupoSelect.addEventListener("change", cargarAsistencia);

// Guardar y eliminar
tablaBody.addEventListener("click", async e => {
    const btn = e.target;
    const tr = btn.closest("tr");

    if (btn.classList.contains("btn-guardar")) {
        const ids = JSON.parse(btn.dataset.ids);
        ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].forEach((dia, idx) => {
            const celda = tr.children[idx + 1];
            const id = ids[idx] || null;
            if (!id) return;
            const materia = celda.textContent.trim();
            const hora = tr.children[0].textContent.split("-")[0];
            const hora_fin = tr.children[0].textContent.split("-")[1] || hora;

            fetch("../php/asistencias_data/guardar_asistencia.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "guardar",
                    id,
                    grupo: grupoSelect.value,
                    materia,
                    hora,
                    hora_fin,
                    estado: "0"
                })
            });
        });
        alert("Guardado!");
        cargarAsistencia();
    }

    if (btn.classList.contains("btn-eliminar")) {
        const ids = JSON.parse(btn.dataset.ids);
        if (ids.length === 0) return;

        // Preguntar si quiere eliminar todo o solo una
        const opcion = prompt("Eliminar todo (T) o solo una materia (S)? Escriba T o S").toUpperCase();
        if (opcion === "T") {
            if (confirm(`¿Eliminar todas estas ${ids.length} materias?`)) {
                for (const id of ids) {
                    await fetch("../php/asistencias_data/guardar_asistencia.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            accion: "eliminar",
                            id
                        })
                    });
                }
            }
        } else if (opcion === "S") {
            // Mostrar materias de la fila para elegir
            const materias = [];
            ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].forEach((dia, idx) => {
                const celda = tr.children[idx + 1];
                if (celda.textContent.trim() !== "") materias.push({
                    dia,
                    id: ids[idx],
                    nombre: celda.textContent.trim()
                });
            });

            let seleccion = prompt(`Seleccione materia a eliminar por día o nombre:\n${materias.map(m => `${m.dia}: ${m.nombre}`).join("\n")}`);
            if (!seleccion) return;

            const materiaSel = materias.find(m => m.dia.toLowerCase() === seleccion.toLowerCase() || m.nombre.toLowerCase() === seleccion.toLowerCase());
            if (!materiaSel) {
                alert("Materia no encontrada");
                return;
            }

            // Pedimos primero la info de la DB para ver duración
            const info = await fetch(`../php/asistencias_data/asistencia_info.php?id=${materiaSel.id}`)
                .then(res => res.json());

            if (info.hora == info.hora_fin) {
                // Si dura 1 hora, eliminar
                await fetch("../php/asistencias_data/guardar_asistencia.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accion: "eliminar",
                        id: materiaSel.id
                    })
                });
            } else {
                // Si dura más de 1 hora, restar 1 a hora_fin
                await fetch("../php/asistencias_data/guardar_asistencia.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        accion: "reducir_hora",
                        id: materiaSel.id
                    })
                });
            }
        }

        cargarAsistencia();
    }
});

function mostrarNotificacion(mensaje, tipo = "success") {
    const notif = document.createElement("div");
    notif.textContent = mensaje;
    notif.style.position = "fixed";
    notif.style.top = "20px";
    notif.style.right = "20px";
    notif.style.padding = "10px 20px";
    notif.style.borderRadius = "5px";
    notif.style.color = "#fff";
    notif.style.zIndex = "10000";
    notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    notif.style.transition = "opacity 0.3s";
    notif.style.opacity = "1";

    if (tipo === "success") notif.style.backgroundColor = "#4caf50";
    else if (tipo === "error") notif.style.backgroundColor = "#f44336";

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}



// Añadir nueva fila
addRowBtn.addEventListener("click", () => {
    // Crear modal temporal
    const modal = document.createElement("div");
    modal.id = "tempModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    modal.innerHTML = `
        <div style="background:white; padding:20px; border-radius:10px; width:300px;">
            <h3>Agregar asistencia</h3>
            <label>Hora inicio:</label>
            <input type="number" id="horaInput" placeholder="Ej: 1"><br><br>
            <label>Hora fin:</label>
            <input type="text" id="horaFinInput" placeholder="Ej: 2-3"><br><br>
            <label>Día:</label>
            <select id="diaInput">
                <option value="">Seleccione el día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
            </select><br><br>
            <label>Asignatura:</label>
            <select id="materiaSelect">
                <option value="">Seleccione la asignatura</option>
            </select><br><br>
            <button id="saveBtn">Guardar</button>
            <button id="cancelBtn">Cancelar</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Cargar materias en el select
fetch("../php/asistencias_data/get_asignaturas.php")
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById("materiaSelect");
        select.innerHTML = '<option value="">Seleccione la asignatura</option>';
        data.forEach(asig => {
             if (data.error === "no_logged_in") {
                Swal.fire({
                    title: 'No estás logeado',
                    text: 'Debes iniciar sesión para ver tus reservas.',
                    icon: 'warning',
                    confirmButtonText: 'Ir al login'
                }).then(() => {
                    window.location.href = "../pages/login.html";
                });
                return;
        }
            const option = document.createElement("option");
            option.value = asig.id_asignatura;
            option.textContent = asig.nombre;
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al cargar asignaturas:", error);
        document.getElementById("materiaSelect").innerHTML = '<option>Error al cargar asignaturas</option>';
    });
    
    
    document.getElementById("cancelBtn").addEventListener("click", () => {
        modal.remove();
    });

    modal.querySelector("#saveBtn").addEventListener("click", () => {
        const hora = parseInt(document.getElementById("horaInput").value);
        const hora_fin = parseInt(document.getElementById("horaFinInput").value) || hora;
        const dia = document.getElementById("diaInput").value;
        const materia = document.getElementById("materiaSelect").value;
        const materiaNombre = document.getElementById("materiaSelect").selectedOptions[0].text;
        

        fetch("../php/asistencias_data/guardar_asistencia.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accion: "nuevo",
                    grupo: grupoSelect.value,
                    hora,
                    hora_fin,
                    dia,
                    materia,
                    estado: "0"
                })
            })
            .then(res => res.json())
            .then(res => {
                if (res.status === "ok") {
                    mostrarNotificacion("Asistencia guardada correctamente", "success");
                    cargarAsistencia();
                    document.body.removeChild(modal);
                } else {
                    mostrarNotificacion("Error al guardar la asistencia", "error");
                }
            })
            .catch(() => mostrarNotificacion("Error en la solicitud", "error"));
    });
});


// Cargar grupos
function cargarGrupos() {
    fetch("../php/asistencias_data/grupos_get.php")
        .then(res => res.json())
        .then(grupos => {
            grupoSelect.innerHTML = "";
            grupos.forEach(grupo => {
                const option = document.createElement("option");
                option.textContent = `${grupo.grado} ${grupo.nombre} ${grupo.especificacion} - ${grupo.turno}`;
                option.value = `${grupo.grado} ${grupo.nombre} ${grupo.especificacion} - ${grupo.turno}`;
                grupoSelect.appendChild(option);
            });
            if (grupos.length > 0) {
                grupoSelect.value = `${grupos[0].grado} ${grupos[0].nombre} ${grupos[0].especificacion} - ${grupos[0].turno}`;
                cargarAsistencia();
            }
        })
        .catch(err => console.error(err));
}

cargarGrupos();