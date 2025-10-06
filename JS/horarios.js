const grupoSelect = document.getElementById("grupo");
const loading = document.getElementById("loading");

async function actualizarAsistencia(mostrarLoading = false) {
    if (!grupoSelect) return;
    if (mostrarLoading) {
        loading.innerHTML = `
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
            <p>Cargando Horarios de ${grupoSelect.value}...</p>
        `;
    }
    try {
        const res = await fetch(`../php/asistencias_data/asistencia_get.php?grupo=${encodeURIComponent(grupoSelect.value)}`);
        const data = await res.json();
        loading.innerHTML = "";

        const tabla = document.querySelector("table");
        const filas = tabla.querySelectorAll("tr");

        filas.forEach((fila, index) => {
            if (index === 0) return;
            const celdas = fila.querySelectorAll("td");
            for (let i = 2; i <= 6; i++) {
                celdas[i].textContent = "";
                celdas[i].style.backgroundColor = "";
                celdas[i].style.color = "";
            }
        });

        data.forEach(item => {
            for (let h = item.hora; h <= item.hora_fin; h++) {
                const fila = Array.from(filas).find(f => f.querySelector("td")?.textContent.includes(h + "°"));
                if (!fila) continue;

                let diaIndex;
                switch(item.dia) {
                    case "Lunes": diaIndex = 2; break;
                    case "Martes": diaIndex = 3; break;
                    case "Miércoles": diaIndex = 4; break;
                    case "Jueves": diaIndex = 5; break;
                    case "Viernes": diaIndex = 6; break;
                }

                const celdas = fila.querySelectorAll("td");
                const celda = celdas[diaIndex];
                if(celda) {
                    celda.textContent = item.materia;
                    celda.style.backgroundColor = item.estado === "no" ? "red" : "green";
                    celda.style.color = "white";
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function cargarGrupos() {
    loading.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif" style="width:50px;">
            <p>Cargando Horarios...</p>`;
    try {
        const res = await fetch("../php/asistencias_data/grupos_get.php");
        const grupos = await res.json();

        grupoSelect.innerHTML = "";
        grupos.forEach(grupo => {
            const option = document.createElement("option");
            option.textContent = `${grupo.grado}${grupo.nombre} ${grupo.turno}`;
            option.value = `${grupo.grado}${grupo.nombre} ${grupo.turno}`;
            grupoSelect.appendChild(option);
        });

        if (grupos.length > 0) {
            grupoSelect.value = `${grupos[0].grado}${grupos[0].nombre} ${grupos[0].turno}`;
            await actualizarAsistencia();
        }
    } catch (err) {
        console.error(err);
    }
}

cargarGrupos();
setInterval(actualizarAsistencia, 10000);
grupoSelect.addEventListener("change", () => actualizarAsistencia(true));
