const container = document.getElementById("aulas-container");
const reservarbut = document.getElementById("reservar");
const grupoSelect = document.getElementById("grupo");

function get_aulas() {
    if (grupoSelect.value!="Aulas") return;
    container.innerHTML = `<div id="loading" style="text-align:center; margin-top:50px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
        <p>Cargando Aulas...</p>
    </div>`;
    fetch(`../php/reservas/reservas.php?valor=${encodeURIComponent(grupoSelect.value)}`)
    .then(res => res.json())
    .then(data => {
        const loading = document.getElementById("loading");
        if(loading) loading.remove();
        container.innerHTML = "";
        data.forEach(aula => {
            const div = document.createElement("div");
            div.className = "text_box";
            div.setAttribute("data-type", aula.tipo);
            div.innerHTML = `
                <div class="text_box_inner">
                    <div class="text_box_img">
                        <img src="aula1.jpg" alt="${aula.nombre}">
                    </div>
                    <div class="text_box_content">
                        <h2>${aula.nombre}</h2>
                        <p>Capacidad: ${aula.cantidad} personas</p>
                        <p>Tipo: ${aula.tipo}</p>
                        <button class="reservarbut" data-nombre="${aula.nombre}" data-tipo="${aula.tipo}" data-id="${aula.id_aula}">Reservar</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        document.querySelectorAll(".reservarbut").forEach(reservarbut => {
            reservarbut.addEventListener("click", e => {
                const btn = e.target;
                const id_aula = btn.dataset.id;
                const nombre  = btn.dataset.nombre;

                const modal = document.createElement("div");
                modal.id = "modalReserva";
                modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:9999;";
                modal.innerHTML = `
                    <div style="background:#fff; padding:20px; border-radius:8px; width:300px;">
                        <h2>Reservar ${nombre}</h2>
                        <label>Fecha: <input type="date" id="res_fecha"></label><br><br>
                        <label>Turno:
                            <select id="res_turno">
                                <option value="MATUTINO">MATUTINO</option>
                                <option value="VESPERTINO">VESPERTINO</option>
                                <option value="NOCTURNO">NOCTURNO</option>
                            </select>
                        </label><br><br>
                        <label>Hora:
                            <select id="res_hora">
                                <option value="1°">1°</option>
                                <option value="2°">2°</option>
                                <option value="3°">3°</option>
                                <option value="4°">4°</option>
                                <option value="5°">5°</option>
                                <option value="6°">6°</option>
                                <option value="7°">7°</option>
                                <option value="8°">8°</option>
                            </select>
                        </label><br><br>
                        <div id="dispoText" style="font-weight:bold; margin-bottom:10px;"></div>
                        <button id="confirmReserva">Reservar</button>
                        <button id="cancelReserva">Cancelar</button>
                    </div>
                `;
                document.body.appendChild(modal);

                const dispoText = document.getElementById("dispoText");
                const fechaInput = document.getElementById("res_fecha");
                const turnoSelect = document.getElementById("res_turno");
                const horaSelect = document.getElementById("res_hora");

                function checkDisponibilidad() {
                    const fecha = fechaInput.value;
                    const turno = turnoSelect.value;
                    const hora  = horaSelect.value;
                    if(!fecha) return;

                    // Mostrar gif mientras consulta
                    dispoText.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:20px; vertical-align:middle;"> Comprobando disponibilidad...`;

                    fetch("../php/reservas/aula_check.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_aula, fecha, turno, hora })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.reservado){
                            dispoText.textContent = "No disponible";
                            dispoText.style.color = "red";
                        } else {
                            dispoText.textContent = "Disponible";
                            dispoText.style.color = "green";
                        }
                    })
                    .catch(() => {
                        dispoText.textContent = "Error al consultar";
                        dispoText.style.color = "gray";
                    });
                }

                fechaInput.addEventListener("change", checkDisponibilidad);
                turnoSelect.addEventListener("change", checkDisponibilidad);
                horaSelect.addEventListener("change", checkDisponibilidad);

                document.getElementById("cancelReserva").addEventListener("click", () => modal.remove());

                document.getElementById("confirmReserva").addEventListener("click", () => {
                    const fecha = fechaInput.value;
                    const turno = turnoSelect.value;
                    const hora  = horaSelect.value;

                    fetch("../php/reservas/reserva_aula.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_aula, fecha, turno, hora })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        if(data.success) modal.remove();
                    });
                });
            });
        });
    });
}

function get_recursos() {
    if (grupoSelect.value != "Recursos") return;
    container.innerHTML = `<div id="loading" style="text-align:center; margin-top:50px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
        <p>Cargando Recursos...</p>
    </div>`;
    fetch(`../php/reservas/reservas.php?valor=${encodeURIComponent(grupoSelect.value)}`)
    .then(res => res.json())
    .then(data => {
        const loading = document.getElementById("loading");
        if(loading) loading.remove();
        container.innerHTML = "";
        data.forEach(recurso => {
            const div = document.createElement("div");
            div.className = "text_box";
            div.setAttribute("data-estado", recurso.estado);
            div.innerHTML = `
                <div class="text_box_inner">
                    <div class="text_box_img">
                        <img src="recurso.jpg" alt="${recurso.nombre}">
                    </div>
                    <div class="text_box_content">
                        <h2>${recurso.nombre}</h2>
                        <p>Estado: <strong>${recurso.estado}</strong></p>
                        <button class="reservarbut" data-id="${recurso.id_recurso}" ${recurso.estado === "RESERVADO" ? "disabled" : ""}>
                            ${recurso.estado === "RESERVADO" ? "No disponible" : "Reservar"}
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });

        document.querySelectorAll(".reservarbut").forEach(reservarbut => {
            reservarbut.addEventListener("click", e => {
                const btn = e.target;
                const id_recurso = btn.dataset.id;
                const nombre = btn.closest(".text_box_content").querySelector("h2").textContent;

                const modal = document.createElement("div");
                modal.id = "modalReserva";
                modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:9999;";
                modal.innerHTML = `
                    <div style="background:#fff; padding:20px; border-radius:8px; width:300px;">
                        <h2>Reservar ${nombre}</h2>
                        <label>Fecha: <input type="date" id="res_fecha"></label><br><br>
                        <label>Turno:
                            <select id="res_turno">
                                <option value="MATUTINO">MATUTINO</option>
                                <option value="VESPERTINO">VESPERTINO</option>
                                <option value="NOCTURNO">NOCTURNO</option>
                            </select>
                        </label><br><br>
                        <label>Hora:
                            <select id="res_hora">
                                <option value="1°">1°</option>
                                <option value="2°">2°</option>
                                <option value="3°">3°</option>
                                <option value="4°">4°</option>
                                <option value="5°">5°</option>
                                <option value="6°">6°</option>
                                <option value="7°">7°</option>
                                <option value="8°">8°</option>
                            </select>
                        </label><br><br>
                        <p id="disponibilidad" style="font-weight:bold;">Selecciona fecha, turno y hora</p>
                        <button id="confirmReserva">Reservar</button>
                        <button id="cancelReserva">Cancelar</button>
                    </div>
                `;
                document.body.appendChild(modal);

                const fechaInput = document.getElementById("res_fecha");
                const turnoSelect = document.getElementById("res_turno");
                const horaSelect = document.getElementById("res_hora");
                const dispoText = document.getElementById("disponibilidad");

                function checkDisponibilidad() {
                    const fecha = fechaInput.value;
                    const turno = turnoSelect.value;
                    const hora = horaSelect.value;
                    if (!fecha) return;
                    dispoText.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:20px; vertical-align:middle;"> Comprobando disponibilidad...`;
                    dispoText.style.color = "black";

                    fetch("../php/reservas/reserva_check.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_recurso, fecha, turno, hora })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.reservado) {
                            dispoText.textContent = "No disponible";
                            dispoText.style.color = "red";
                        } else {
                            dispoText.textContent = "Disponible";
                            dispoText.style.color = "green";
                        }
                    });
                }


                fechaInput.addEventListener("change", checkDisponibilidad);
                turnoSelect.addEventListener("change", checkDisponibilidad);
                horaSelect.addEventListener("change", checkDisponibilidad);

                document.getElementById("cancelReserva").addEventListener("click", () => modal.remove());

                document.getElementById("confirmReserva").addEventListener("click", () => {
                    const fecha = fechaInput.value;
                    const turno = turnoSelect.value;
                    const hora = horaSelect.value;

                    fetch("../php/reservas/reserva_recurso.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_recurso, fecha, turno, hora })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        if(data.success) modal.remove();
                    });
                });
            });
        });
    });
}

const filtros = document.querySelectorAll(".filters h3");
filtros.forEach(filtro => {
    filtro.addEventListener("click", () => {
        const tipo = filtro.dataset.type;
        const items = container.querySelectorAll(".text_box");
        items.forEach(item => {
            if(tipo === "All" || item.dataset.type === tipo) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});

async function cargarOpciones() {
    try {
        grupoSelect.innerHTML = "";
        const opciones = [
            { texto: "Aulas", valor: "Aulas" },
            { texto: "Recursos", valor: "Recursos" }
        ];
        opciones.forEach(op => {
            const option = document.createElement("option");
            option.textContent = op.texto;
            option.value = op.valor;
            grupoSelect.appendChild(option);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get("data");
        if (dataParam) {
            grupoSelect.value = dataParam === "recursos" ? "Recursos" : "Aulas";
        } else {
            grupoSelect.value = opciones[0].valor;
        }

        await manejarSeleccion(grupoSelect.value);

        grupoSelect.addEventListener("change", async () => {
            await manejarSeleccion(grupoSelect.value);
        });

    } catch (err) {
        console.error(err);
    }
}


async function actualizarDatos() {
    if (!grupoSelect) return;
    try {
        console.log("Valor seleccionado: " + grupoSelect.value);
        if(grupoSelect.value == "Aulas") {
            get_aulas(grupoSelect);
        } else {
            get_recursos(grupoSelect);
        }
    } catch (err) {
        console.error(err);
    }
}

async function manejarSeleccion(valor) {
    if (valor === "Aulas") {
        await actualizarDatos("Aulas");
    } else if (valor === "Recursos") {
        await actualizarDatos("Recursos");
    }
}

cargarOpciones();
get_aulas();