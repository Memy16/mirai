// Cargar grupos desde la BD y mostrarlos en el aside
async function cargarGrupos() {
    try {
        const response = await fetch("../php/listar_grupos.php");
        const grupos = await response.json();

        const lista = document.getElementById("listaGrupos");
        lista.innerHTML = "";

        grupos.forEach(g => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `${g.grado} ${g.nombre} - ${g.especificacion}`;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Error cargando grupos:", error);
    }
}

// Manejo del formulario sin recargar página
document.getElementById("formGrupo").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch(e.target.action, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            alert("Grupo creado correctamente");
            e.target.reset();
            cargarGrupos(); // refrescar aside dinámicamente
        } else {
            alert("Error: " + (result.error || "No se pudo crear el grupo"));
        }
    } catch (error) {
        console.error("Error al enviar formulario:", error);
    }
});

// Cargar al iniciar
cargarGrupos();
