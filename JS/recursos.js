document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaRecursos");
    const form = document.querySelector("form");
    
    const formEditar = document.getElementById("formeditorRecurso");
    const editorRecurso = document.getElementById("editorRecurso");
    const btnEliminar = document.getElementById("btnEliminar");
    const btnCancelar = document.getElementById("btnCancelar");
    let RecursoActual = null;
    
    async function cargarRecursos() {
        try {
            const resp = await fetch("../php/recursos/listar_recursos.php");
            const recursos = await resp.json();
            
            lista.innerHTML = "";
            if (recursos.length === 0) {
                lista.innerHTML = "<li class='list-group-item'>No hay recursos</li>";
                return;
            }
            
            recursos.forEach((r, index) => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                
                li.innerHTML = `
                    <span>${r.nombre} | Cantidad: ${r.cantidad}</span>
                    <button class="btn btn-sm btn-editar" data-id="${r.id_recurso}" style="background-color: #062863; color: white; border: none; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-edit" style="font-size: 14px;"></i>
                    </button>
                `;
                lista.appendChild(li);
            });
            
        } catch (err) {
            console.error("Error cargando recursos:", err);
            lista.innerHTML = `
                <div class="alert alert-dismissible alert-warning">
                    <h4 class="alert-heading">¡Error de conexión!</h4>
                    <p class="mb-0">No se pudieron cargar los recursos desde el servidor. Por favor, verifica tu conexión a internet e inténtalo nuevamente. Si el problema persiste, <a href="#" class="alert-link" onclick="cargarRecursos()">haz clic aquí para reintentar</a>.</p>
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
                
                const resp = await fetch("../php/recursos/obtener_recurso.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: data
                });
                const recurso = await resp.json();
                
                if (recurso.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error: " + recurso.error,
                        timer: 5000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                RecursoActual = id;
                document.getElementById("editId").value = recurso.id_recurso;
                document.getElementById("editNombre").value = recurso.nombre;
                document.getElementById("editCantidad").value = recurso.cantidad;
                
                editorRecurso.style.display = "block";
                
                editorRecurso.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                });
                
            } catch (error) {
                console.error("Error al obtener recurso:", error);
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
                        text: "Recurso registrado correctamente",
                        timer: 3000,
                        showConfirmButton: false
                    });
                    form.reset();
                    cargarRecursos(); 
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
                    text: "Recurso actualizado correctamente",
                    timer: 3000,
                    showConfirmButton: false
                });
                editorRecurso.style.display = "none";
                cargarRecursos();
            } else {
                if (result.error === "No se encontró el recurso o no se realizaron cambios") {
                    Swal.fire({
                        icon: "info",
                        title: "Sin cambios",
                        text: "No se detectaron cambios en los datos del recurso.",
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
            if (!RecursoActual) return;
            
            Swal.fire({
                title: "¿Seguro que deseas eliminar este recurso?",
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
                    data.append("id", RecursoActual);
                    
                    const resp = await fetch("../php/recursos/eliminar_recurso.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: data
                    });
                    const resultDelete = await resp.json();
                    
                    if (resultDelete.success) {
                        Swal.fire("¡Eliminado!", "El recurso fue eliminado.", "success");
                        editorRecurso.style.display = "none";
                        cargarRecursos();
                    } else {
                        Swal.fire("Error", resultDelete.error, "error");
                    }
                }
            });
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            editorRecurso.style.display = "none";
        });
    }
    
    cargarRecursos();
});