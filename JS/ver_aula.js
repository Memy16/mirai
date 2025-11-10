const grupoSelect = document.getElementById("grupo");

async function cargarGrupos() {
    try {
        const res = await fetch("../php/asistencias_data/get_grupos.php");
        const grupos = await res.json();
        grupoSelect.innerHTML = "";

        grupos.forEach(grupo => {
            const option = document.createElement("option");
            option.textContent =
                `${grupo.grado} ${grupo.nombre} ${grupo.especificacion}`;
            option.value = `${grupo.grado}${grupo.nombre}`;
            grupoSelect.appendChild(option);
        });

    } catch (err) {
        console.error(err);
        grupoSelect.innerHTML = "<option>Error al cargar grupos</option>";
    }
}

cargarGrupos();