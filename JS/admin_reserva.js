const container = document.getElementById("aulas-container");

function get_horarios() {
    return fetch("../php/get_horarios.php")
        .then(res => res.json());
}

async function getMisReservas() {
    container.innerHTML = `<div id="loading" style="text-align:center; margin-top:50px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
        <p>Cargando Tus Reservas...</p>
    </div>`;

    const horarios = await get_horarios();

    fetch("../php/reservas/admin_reservas.php")
        .then(res => res.json())
        .then(data => {
            const loading = document.getElementById("loading");
            if (loading) loading.remove();
            container.innerHTML = "";

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

            container.innerHTML = "<h2>Mis Reservas</h2>";

            if (data.aulas.length === 0 && data.recursos.length === 0) {
                container.innerHTML += "<p>No tienes reservas actuales.</p>";
                return;
            }

            const todas = [...data.aulas.map(r => ({ ...r, tipo: "aula" })), ...data.recursos.map(r => ({ ...r, tipo: "recurso" }))];

            todas.forEach(reserva => {
                const div = document.createElement("div");
                div.className = "text_box";

                div.innerHTML = `
                    <div class="text_box_content">
                        <h3>Reserva ${reserva.tipo === "aula" ? "de Aula" : "de Recurso"}</h3>
                        <p><b>Fecha:</b> ${reserva.hora_reservada}</p>
                        <p><b>Hora:</b> ${reserva.hora_turno}</p>
                        <p><b>Turno:</b> ${reserva.turno}</p>
                        <button class="editarReserva" data-tipo="${reserva.tipo}" data-id="${reserva.id_reserva}" data-fecha="${reserva.hora_reservada}" data-hora="${reserva.hora_turno}" data-turno="${reserva.turno}">Editar</button>
                        <button class="eliminarReserva" data-tipo="${reserva.tipo}" data-id="${reserva.id_reserva}">Cancelar</button>
                    </div>
                `;
                container.appendChild(div);
            });

            document.querySelectorAll(".editarReserva").forEach(btn => {
                btn.addEventListener("click", e => abrirModalEdicionReserva(e.target.dataset, horarios));
            });

            document.querySelectorAll(".eliminarReserva").forEach(btn => {
                btn.addEventListener("click", e => cancelarReserva(e.target.dataset));
            });
        });
}

function abrirModalEdicionReserva(data, horarios) {
    const opcionesHora = horarios.map((h, index) => 
        `<option value="${index+1}°">${index+1}° - ${h.formatted}</option>`
    ).join("");

    const modal = document.createElement("div");
    modal.style = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center;
    `;
    modal.innerHTML = `
        <div style="background:#fff; padding:20px; border-radius:8px; min-width:300px;">
            <h2>Editar Reserva</h2>
            <label>Fecha:<br><input id="edit_fecha" type="date" value="${data.fecha}"></label><br><br>
            <label>Hora:<br>
                <select id="edit_hora">
                    ${opcionesHora}
                </select>
            </label><br><br>
            <label>Turno:<br>
                <select id="edit_turno">
                    <option ${data.turno==='MATUTINO'?'selected':''}>MATUTINO</option>
                    <option ${data.turno==='VESPERTINO'?'selected':''}>VESPERTINO</option>
                    <option ${data.turno==='NOCTURNO'?'selected':''}>NOCTURNO</option>
                </select>
            </label><br><br>
            <button id="guardarEdit">Guardar</button>
            <button id="cancelarEdit">Cancelar</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("cancelarEdit").addEventListener("click", () => modal.remove());

    document.getElementById("guardarEdit").addEventListener("click", () => {
        const body = {
            tipo: data.tipo,
            id_reserva: data.id,
            hora_reservada: document.getElementById("edit_fecha").value,
            hora_turno: document.getElementById("edit_hora").value,
            turno: document.getElementById("edit_turno").value
        };

        fetch("../php/reservas/edit_reserva.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(resp => {
            alert(resp.message || resp.error);
            modal.remove();
            getMisReservas();
        });
    });
}

function cancelarReserva(data) {
    if (!confirm("¿Deseas cancelar esta reserva?")) return;
    fetch("../php/reservas/cancelar_reserva.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp => {
        alert(resp.message || resp.error);
        getMisReservas();
    });
}

getMisReservas();
