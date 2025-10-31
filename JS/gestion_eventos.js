document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaEventos");
    const form = document.getElementById("formEvento");
    const formEditar = document.getElementById("formEditarEvento");
    const editorEvento = document.getElementById("editorEvento");
    const btnEliminar = document.getElementById("btnEliminar");
    const btnCancelar = document.getElementById("btnCancelar");
    let eventoActual = null;

    async function cargarEventos() {
        try {
            const resp = await fetch("../php/eventos/cards_eventos.php");
            const eventos = await resp.json();

            lista.innerHTML = "";

            if (eventos.length === 0) {
                lista.innerHTML = "<li class='list-group-item'>No hay eventos</li>";
                return;
            }

            eventos.forEach(ev => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";

                li.innerHTML = `
                    <span>${ev.titulo} | ${ev.tipo_evento} - ${ev.filtro} <img src="../${ev.img_url}" alt="${ev.titulo}" style="width:70px; height:50px; object-fit:cover; border-radius:5px;"></span>
                    <div>
                        <button class="btn btn-sm btn-editar" data-id="${ev.id_evento}" style="background-color: #062863; color: white; border: none; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-edit" style="font-size: 14px;"></i>
                        </button>
                    </div>
                `;
                lista.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar eventos:", error);
            lista.innerHTML = `
                <div class="alert alert-dismissible alert-warning">
                    <h4 class="alert-heading">¡Error de conexión!</h4>
                    <p class="mb-0">No se pudieron cargar los eventos desde el servidor. Por favor, verifica tu conexión a internet e inténtalo nuevamente. Si el problema persiste, <a href="#" class="alert-link" onclick="cargarEventos()">haz clic aquí para reintentar</a>.</p>
                </div>
            `;
        }
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            try {
                const resp = await fetch("../php/eventos/guardar_evento.php", {
                    method: "POST",
                    body: formData
                });
                const result = await resp.json();

                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Perfecto!",
                        text: "Evento creado correctamente",
                        timer: 2500,
                        showConfirmButton: false
                    });
                    form.reset();
                    cargarEventos();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: result.error || "No se pudo crear el evento."
                    });
                }
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo comunicar con el servidor."
                });
            }
        });
    }

    document.addEventListener("click", async (e) => {
        const botonEditar = e.target.closest(".btn-editar");
        if (!botonEditar) return;

        const id = botonEditar.dataset.id;
        if (!id) return;

        try {
            const data = new URLSearchParams();
            data.append("id", id);
            
            .then(data => {
        if (data.error === "no_logged_in") {
                Swal.fire({
                    title: 'No estás logeado',
                    text: 'Debes iniciar sesión para ver tus reservas.',
                    icon: 'warning',
                    confirmButtonText: 'Ir al login'
                }).then(() => {
                    window.location.href = "../pages/login.html";
                });
                return;
        }


            const resp = await fetch("../php/eventos/obtener_evento.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: data
            });

            const evento = await resp.json();

            if (evento.error) {
                Swal.fire({
                    icon: "error",
                    title: "Ups...",
                    text: "Error: " + evento.error
                });
                return;
            }

            eventoActual = id;
            document.getElementById("editId").value = evento.id_evento;
            document.getElementById("editnombreEvento").value = evento.titulo;
            document.getElementById("editdescripcion").value = evento.descripcion;
            document.getElementById("editTipoEvento").value = evento.tipo_evento;
            document.getElementById("editfiltroEvento").value = evento.filtro;
            document.getElementById("editdetalles").value = evento.detalles;

            const contenedorImg = document.getElementById("contenedorImagenActual");

            if (evento.img_url && evento.img_url.trim() !== "") {
                contenedorImg.innerHTML = `
                <p><strong>Imagen actual del evento:</strong></p>
                <img src="../${evento.img_url}" alt="${evento.titulo}" class="img-preview-evento">
            `;
            } else {
                contenedorImg.innerHTML = `
                <div class="alert alert-dismissible alert-primary">
                    <strong>¡Vaya!</strong> Este evento no tiene imagen cargada. Considera subir una para mejorar su apariencia.
                </div>
            `;
            }

            editorEvento.style.display = "block";
            editorEvento.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        } catch (error) {
            console.error("Error al obtener evento:", error);
        }
    });

    if (formEditar) {
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = new FormData(formEditar);

            try {
                const resp = await fetch(formEditar.action, {
                    method: "POST",
                    body: data
                });

                const result = await resp.json();

                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Perfecto!",
                        text: "Evento actualizado correctamente",
                        timer: 2500,
                        showConfirmButton: false
                    });
                    editorEvento.style.display = "none";
                    cargarEventos();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: result.error || "No se pudo actualizar el evento."
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo comunicar con el servidor."
                });
            }
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener("click", async () => {
            if (!eventoActual) return;

            Swal.fire({
                title: "¿Seguro que deseas eliminar este evento?",
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
                    data.append("id", eventoActual);

                    const resp = await fetch("../php/eventos/eliminar_evento.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: data
                    });

                    const resultDelete = await resp.json();

                    if (resultDelete.success) {
                        Swal.fire("¡Eliminado!", "El evento fue eliminado.", "success");
                        editorEvento.style.display = "none";
                        cargarEventos();
                    } else {
                        Swal.fire("Error", resultDelete.error, "error");
                    }
                }
            });
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            editorEvento.style.display = "none";
        });
    }

    cargarEventos();
});