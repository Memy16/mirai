document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaAsignaturas");
    const form = document.querySelector("form");
    
    const formEditar = document.getElementById("formEditarAsign");
    const editorAsign = document.getElementById("editorAsign");
    const btnEliminar = document.getElementById("btnEliminar");
    const btnCancelar = document.getElementById("btnCancelar");
    let asignActual = null;
    
    async function cargarAsignaturas() {
        try {
            const resp = await fetch("../php/asignaturas/listar_asignaturas.php");
            const asignaturas = await resp.json();
            
            lista.innerHTML = "";
            if (asignaturas.length === 0) {
                lista.innerHTML = "<li class='list-group-item'>No hay asignaturas</li>";
                return;
            }
            
            asignaturas.forEach((a, index) => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                
                li.innerHTML = `
                    <span>${a.nombre} | ${a.descripcion}</span>
                    <button class="btn btn-sm btn-editar" data-id="${a.id_asignatura}" style="background-color: #062863; color: white; border: none; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-edit" style="font-size: 14px;"></i>
                    </button>
                `;
                lista.appendChild(li);
            });
            
        } catch (err) {
            console.error("Error cargando asignaturas:", err);
            lista.innerHTML = `
                <div class="alert alert-dismissible alert-warning">
                    <h4 class="alert-heading">¡Error de conexión!</h4>
                    <p class="mb-0">No se pudieron cargar las asignaturas desde el servidor. Por favor, verifica tu conexión a internet e inténtalo nuevamente. Si el problema persiste, <a href="#" class="alert-link" onclick="cargarAsignaturass()">haz clic aquí para reintentar</a>.</p>
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
                
                const resp = await fetch("../php/asignaturas/obtener_asignatura.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: data
                });
                const asignatura = await resp.json();
                
                if (asignatura.error) {
                    Swal.fire({
                        icon: "error",
                        title: "Ups...",
                        text: "Error: " + asignatura.error,
                        timer: 5000,
                        showConfirmButton: false
                    });
                    return;
                }
                
                asignActual = id;
                document.getElementById("editId").value = asignatura.id_asignatura;
                document.getElementById("editNombre").value = asignatura.nombre;
                document.getElementById("editDescripcion").value = asignatura.descripcion;
                
                editorAsign.style.display = "block";
                
                editorAsign.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                });
                
            } catch (error) {
                console.error("Error al obtener asignatura:", error);
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
                        text: "Asignatura creada correctamente",
                        timer: 3000,
                        showConfirmButton: false
                    });
                    form.reset();
                    cargarAsignaturas(); 
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
                    text: "Asignatura actualizada correctamente",
                    timer: 3000,
                    showConfirmButton: false
                });
                editorAsign.style.display = "none";
                cargarAsignaturas();
            } else {
                if (result.error === "No se encontró la asignatura o no se realizaron cambios") {
                    Swal.fire({
                        icon: "info",
                        title: "Sin cambios",
                        text: "No se detectaron cambios en los datos de la asignatura.",
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
            if (!asignActual) return;
            
            Swal.fire({
                title: "¿Seguro que deseas eliminar esta asignatura?",
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
                    data.append("id", asignActual);
                    
                    const resp = await fetch("../php/asignaturas/eliminar_asignatura.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: data
                    });
                    const resultDelete = await resp.json();
                    
                    if (resultDelete.success) {
                        Swal.fire("¡Eliminada!", "La asignatura fue eliminada.", "success");
                        editorAsign.style.display = "none";
                        cargarAsignaturas();
                    } else {
                        Swal.fire("Error", resultDelete.error, "error");
                    }
                }
            });
        });
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            editorAsign.style.display = "none";
        });
    }
    
    cargarAsignaturas();
});