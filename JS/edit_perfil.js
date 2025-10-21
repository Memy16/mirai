document.addEventListener("DOMContentLoaded", () => {
    const formEditarUsuario = document.getElementById("formEditarUsuario");
    const telefonoGroup = document.getElementById("telefonoGroup");
    const btnCambiarPass = document.getElementById("btnCambiarPass");
    const passGroup = document.getElementById("passGroup");
    const btnEliminarUsuario = document.getElementById("btnEliminar");

    let rolUsuario = null;
    let idUsuario = null;
    
    fetch("../php/obtener_usuario.php", {
            method: "POST",
            body: new URLSearchParams({
                datos_completos: "true"
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Swal.fire("Error", data.error, "error");
                return;
            }
            
            rolUsuario = data.rol;
            idUsuario = data.id_alumno || data.id_docente || data.id_adscripta;

            document.getElementById("nombre").value = data.nombre || "";
            document.getElementById("apellido").value = data.apellido || "";
            document.getElementById("email").value = data.mail || data.mail_docente || data.mail_adscripta || "";
            
            if (rolUsuario === "profesor" || rolUsuario === "administrador") {
                telefonoGroup.classList.remove("d-none");
                document.getElementById("telefono").value = data.tel_docente || data.tel_adscripta || "";
            }
        });
        
    btnCambiarPass.addEventListener("click", () => {
        passGroup.classList.toggle("d-none");
    });
    
    formEditarUsuario.addEventListener("submit", e => {
        e.preventDefault();

        if (!passGroup.classList.contains("d-none")) {
            const actual = document.getElementById("password_actual").value.trim();
            const nueva = document.getElementById("password_nueva").value.trim();
            const repetir = document.getElementById("password_repetir").value.trim();

            if (!actual || !nueva || !repetir) {
                Swal.fire("Error", "Debe completar todos los campos de contraseña", "error");
                return;
            }
            if (nueva !== repetir) {
                Swal.fire("Error", "Las contraseñas nuevas no coinciden", "error");
                return;
            }
        }

        const formData = new FormData(formEditarUsuario);
        formData.append("id", idUsuario);
        formData.append("rol", rolUsuario);

        fetch("../php/editar_usuario.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Guardado!",
                        text: data.msg,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire("Error", data.error || "No se pudo actualizar", "error");
                }
            })
            .catch(() => {
                Swal.fire("Error", "Error en la petición", "error");
                
             
                
            });
    });

if (btnEliminarUsuario) {
        btnEliminarUsuario.addEventListener("click", async () => {
            if (!idUsuario) return;

            Swal.fire({
                title: "¿Seguro que deseas eliminar tu cuenta?",
                text: "¡Esta acción no se puede deshacer!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1C4C96",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const data = new URLSearchParams();
                    data.append("id", idUsuario);
                    data.append("rol", rolUsuario);

                    try {
                        const resp = await fetch("../php/eliminar_usuario.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: data
                        });
                        const resultDelete = await resp.json();

                        if (resultDelete.success) {
                            Swal.fire({
                                icon: "success",
                                title: "Cuenta eliminada",
                                text: "Tu usuario fue eliminado correctamente",
                                timer: 2500,
                                showConfirmButton: false
                            }).then(() => {
                                // Por ejemplo, redirigir al login
                                window.location.href = "../pages/login.html";
                            });
                        } else {
                            Swal.fire("Error", resultDelete.error || "No se pudo eliminar el usuario", "error");
                        }
                    } catch (err) {
                        Swal.fire("Error", "Error en la petición al servidor", "error");
                    }
                }
            });
        });
    }

});



