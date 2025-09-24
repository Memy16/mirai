document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaGrupos");
    const form = document.querySelector("form");
    
    const formEditar = document.getElementById("formEditarGrupo");
    const editorGrupo = document.getElementById("editorGrupo");
    const btnEliminar = document.getElementById("btnEliminar");
    const btnCancelar = document.getElementById("btnCancelar");
    let grupoActual = null;
    
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
                    <button class="btn btn-sm btn-editar" data-id="${g.id_grupo}" style="background-color: #062863; color: white; border: none; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-edit" style="font-size: 14px;"></i>
                    </button>
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
    
    document.addEventListener("click", async (e) => {
        const botonEditar = e.target.closest(".btn-editar");
        
        if (botonEditar) {
            const id = botonEditar.dataset.id;
            
            if (!id) {
                return;
            }
            
            try {
                const data = new URLSearchParams();
                data.append("id", id);
                
                const resp = await fetch("../php/obtener_grupo.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: data
                });
                const grupo = await resp.json();
                
                if (grupo.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error: " + grupo.error,
                        timer: 5000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                grupoActual = id;
                document.getElementById("editId").value = grupo.id_grupo;
                document.getElementById("editNombre").value = grupo.nombre;
                document.getElementById("editGrado").value = grupo.grado;
                document.getElementById("editTurno").value = grupo.turno;
                document.getElementById("editEspecificacion").value = grupo.especificacion;
                
                editorGrupo.style.display = "block";
                
                editorGrupo.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                });
                
            } catch (error) {
                console.error("Error al obtener grupo:", error);
            }
        }
    });
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const data = new FormData(form);
            try {
                const resp = await fetch(form.action, {
                    method: "POST",
                    body: data
                });
                const result = await resp.json();
                
                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Perfecto!",
                        text: "Grupo creado correctamente",
                        timer: 3000,
                        showConfirmButton: false
                    });
                    form.reset();
                    cargarGrupos(); 
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error: " + result.error,
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Ups...",
                    text: "¡Error de conexión!",
                    timer: 5000,
                    showConfirmButton: false
                });
            }
        });
    }
    
    if (formEditar) {
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(formEditar);
            
            const resp = await fetch(formEditar.action, {
                method: "POST",
                body: data
            });
            const result = await resp.json();
            
            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "¡Perfecto!",
                    text: "Grupo actualizado correctamente",
                    timer: 3000,
                    showConfirmButton: false
                });
                editorGrupo.style.display = "none";
                cargarGrupos();
            } else {
                if (result.error === "No se encontró el grupo o no se realizaron cambios") {
                    Swal.fire({
                        icon: "info",
                        title: "Sin cambios",
                        text: "No se detectaron cambios en los datos del grupo",
                        timer: 4000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error: " + result.error,
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }
    
    if (btnEliminar) {
        btnEliminar.addEventListener("click", async () => {
            if (!grupoActual) return;
            
            Swal.fire({
                title: "¿Seguro que deseas eliminar este grupo?",
                text: "¡No podrás revertir esta acción!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1C4C96",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const data = new URLSearchParams();
                    data.append("id", grupoActual);

                    const resp = await fetch("../php/eliminar_grupo.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: data
                    });
                    const resultDelete = await resp.json();
                    
                    if (resultDelete.success) {
                        Swal.fire("¡Eliminado!", "El grupo fue eliminado.", "success");
                        editorGrupo.style.display = "none";
                        cargarGrupos();
                    } else {
                        Swal.fire("Error", resultDelete.error, "error");
                    }
                }
            });
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            editorGrupo.style.display = "none";
        });
    }
    
    cargarGrupos();
});