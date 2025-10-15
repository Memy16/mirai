document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaGrupos");
    const listaSection = document.getElementById("grupos-container");

    async function cargarGrupos() {
        try {
            const resp = await fetch("../php/listar_grupos.php");
            const grupos = await resp.json();
            
            lista.innerHTML = "";
            if (grupos.length === 0) {
                lista.innerHTML = "<li class='list-group-item'>No hay grupos</li>";
                return;
            }
            
            grupos.forEach((g, index) => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                
                li.innerHTML = `
                    <span>${g.grado} ${g.nombre} - ${g.especificacion}</span>
                    
                `;
                lista.appendChild(li);
            });
            
        } catch (err) {
            console.error("Error cargando grupos:", err);
            lista.innerHTML = `
                <div class="alert alert-dismissible alert-warning">
                    <h4 class="alert-heading">¡Error de conexión!</h4>
                    <p class="mb-0">No se pudieron cargar los grupos desde el servidor. Por favor, verifica tu conexión a internet e inténtalo nuevamente. Si el problema persiste, <a href="#" class="alert-link" onclick="cargarGrupos()">haz clic aquí para reintentar</a>.</p>
                </div>
            `;
        }
    }

    cargarGrupos();
});