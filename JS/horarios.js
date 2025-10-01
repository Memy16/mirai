const grupoSelect = document.getElementById("grupo");

async function actualizarAsistencia() {
    if(!grupoSelect) return;
    try {
        const res = await fetch(`../php/asistencias_data/asistencia_get.php?grupo=${encodeURIComponent(grupoSelect.value)}`);
        const data = await res.json();

        const tabla = document.querySelector("table");
        const filas = tabla.querySelectorAll("tr");

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
                    if(item.estado === "no") {
                        celda.style.backgroundColor = "red";
                        celda.style.color = "white";
                    } else {
                        celda.style.backgroundColor = "green";
                        celda.style.color = "white";
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}

async function cargarGrupos() {
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

        if(grupos.length > 0) {
            grupoSelect.value = `${grupos[0].grado}${grupos[0].nombre} ${grupos[0].turno}`;
            await actualizarAsistencia();
        }
    } catch (err) {
        console.error(err);
    }
}

cargarGrupos();
setInterval(actualizarAsistencia, 10000);
grupoSelect.addEventListener("change", actualizarAsistencia);
