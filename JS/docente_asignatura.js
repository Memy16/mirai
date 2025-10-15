async function cargarAsignaturas() {
    const select = document.getElementById("asignatura");
    try {
        const resp = await fetch("../php/relacionar-docente-asignatura/select_asignaturas.php");
        const asignaturas = await resp.json();
        
        select.innerHTML = '<option value="" disabled selected>Seleccione una asignatura</option>';
        asignaturas.forEach(doc => {
            const option = document.createElement("option");
            option.value = doc.id_asignatura;
            option.textContent = `${doc.nombre}`;
            select.appendChild(option);
        });
    } catch (err) {
        select.innerHTML = '<option value="">Error cargando asignaturas</option>';
    }
}

async function cargarDocentes() {
    const select = document.getElementById("docente");
    try {
        const resp = await fetch("../php/relacionar-docente-asignatura/select_docentes.php");
        const docentes = await resp.json();
        
        select.innerHTML = '<option value="" disabled selected>Seleccione un docente</option>';
        docentes.forEach(doc => {
            const option = document.createElement("option");
            option.value = doc.id_docente;
            option.textContent = `${doc.nombre} ${doc.apellido}`;
            select.appendChild(option);
        });
    } catch (err) {
        select.innerHTML = '<option value="">Error cargando docentes</option>';
    }
}

async function mostrarDocentesAsignaturas() {
    const lista = document.getElementById("listaAsignaturasDocentes");
    try {
        const resp = await fetch("../php/relacionar-docente-asignatura/listar_docentes_asignaturas.php");
        const docenteAsignaturas = await resp.json();

        lista.innerHTML = "";
        if (docenteAsignaturas.length === 0) {
            lista.innerHTML = "<li class='list-group-item'>No hay relaciones aún</li>";
            return;
        }
        docenteAsignaturas.forEach(docente => {
            const asignaturas = docente.asignaturas.map(a => a.nombre).join(", ");
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `<strong>${docente.nombre} ${docente.apellido}:</strong> ${asignaturas}`;
            lista.appendChild(li);
        });
    } catch (err) {
        lista.innerHTML = "<li class='list-group-item'>Error al cargar la lista</li>";
    }
}

// Llama a la función cuando cargue la página
mostrarDocentesAsignaturas();


cargarAsignaturas();
cargarDocentes();
