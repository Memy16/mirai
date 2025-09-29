const grupoSelect = document.getElementById("grupo");
const tablaBody = document.querySelector(".tabla-asistencia tbody");
const addRowBtn = document.getElementById("addRow");

function cargarAsistencia() {
    fetch(`../php/asistencias_data/asistencia_get.php?grupo=${grupoSelect.value}`)
    .then(res => res.json())
    .then(data => {
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

            ["Lunes","Martes","Miércoles","Jueves","Viernes"].forEach(dia => {
                const celdaData = fila[dia];
                if(celdaData) {
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
                    headers: {"Content-Type":"application/json"},
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

    if(btn.classList.contains("btn-guardar")) {
        const ids = JSON.parse(btn.dataset.ids);
        ["Lunes","Martes","Miércoles","Jueves","Viernes"].forEach((dia, idx) => {
            const celda = tr.children[idx + 1];
            const id = ids[idx] || null;
            if(!id) return;
            const materia = celda.textContent.trim();
            const hora = tr.children[0].textContent.split("-")[0];
            const hora_fin = tr.children[0].textContent.split("-")[1] || hora;

            fetch("../php/asistencias_data/guardar_asistencia.php", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
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

    if(btn.classList.contains("btn-eliminar")) {
        const ids = JSON.parse(btn.dataset.ids);
        if(ids.length === 0) return;

        // Preguntar si quiere eliminar todo o solo una
        const opcion = prompt("Eliminar todo (T) o solo una materia (S)? Escriba T o S").toUpperCase();
        if(opcion === "T") {
            if(confirm(`¿Eliminar todas estas ${ids.length} materias?`)) {
                for(const id of ids) {
                    await fetch("../php/asistencias_data/guardar_asistencia.php", {
                        method: "POST",
                        headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({accion:"eliminar", id})
                    });
                }
            }
        } else if(opcion === "S") {
            // Mostrar materias de la fila para elegir
            const materias = [];
            ["Lunes","Martes","Miércoles","Jueves","Viernes"].forEach((dia, idx) => {
                const celda = tr.children[idx + 1];
                if(celda.textContent.trim() !== "") materias.push({dia, id: ids[idx], nombre: celda.textContent.trim()});
            });

            let seleccion = prompt(`Seleccione materia a eliminar por día o nombre:\n${materias.map(m => `${m.dia}: ${m.nombre}`).join("\n")}`);
            if(!seleccion) return;

            const materiaSel = materias.find(m => m.dia.toLowerCase() === seleccion.toLowerCase() || m.nombre.toLowerCase() === seleccion.toLowerCase());
            if(!materiaSel) {
                alert("Materia no encontrada");
                return;
            }

            // Pedimos primero la info de la DB para ver duración
            const info = await fetch(`../php/asistencias_data/asistencia_info.php?id=${materiaSel.id}`)
                            .then(res => res.json());

            if(info.hora == info.hora_fin) {
                // Si dura 1 hora, eliminar
                await fetch("../php/asistencias_data/guardar_asistencia.php", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({accion:"eliminar", id: materiaSel.id})
                });
            } else {
                // Si dura más de 1 hora, restar 1 a hora_fin
                await fetch("../php/asistencias_data/guardar_asistencia.php", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
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


// Añadir nueva fila
addRowBtn.addEventListener("click", () => {
    const hora = prompt("Hora inicio (ej: 1° (envia solo el numero))");
    if(!hora) return;
    const hora_fin = prompt("Hora fin (ej: 2°-3° (envia solo el numero))") || "";
    const dia = prompt("Día (Lunes, Martes...)") || "Lunes";
    const materia = prompt("Materia") || "";

    fetch("../php/asistencias_data/guardar_asistencia.php", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            accion:"nuevo",
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
        if(res.status === "ok") cargarAsistencia();
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
            option.textContent = `${grupo.grado}${grupo.nombre} ${grupo.turno}`;
            option.value = `${grupo.grado}${grupo.nombre} ${grupo.turno}`;
            grupoSelect.appendChild(option);
        });
        if(grupos.length > 0) {
            grupoSelect.value = `${grupos[0].grado}${grupos[0].nombre} ${grupos[0].turno}`;
            cargarAsistencia();
        }
    })
    .catch(err => console.error(err));
}

cargarGrupos();
