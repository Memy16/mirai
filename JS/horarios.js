function actualizarAsistencia() {
    fetch('../php/asistencias_data/asistencia_get.php')
    .then(res => res.json())
    .then(data => {
        const tabla = document.querySelector("table");
        const filas = tabla.querySelectorAll("tr");
        // Omitimos la fila de cabecera
        data.forEach(item => {
            // Iteramos sobre las horas que abarca el bloque
            for (let h = item.hora; h <= item.hora_fin; h++) {
                // Buscamos la fila correspondiente
                const fila = Array.from(filas).find(f => f.querySelector("td")?.textContent.includes(h + "°"));
                if (!fila) continue;

                // Obtenemos la columna según el día
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
    })
    .catch(err => console.error(err));
}

actualizarAsistencia();
setInterval(actualizarAsistencia, 10000);
