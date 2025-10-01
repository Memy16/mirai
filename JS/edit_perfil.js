document.addEventListener("DOMContentLoaded", () => {
    const formEditarUsuario = document.getElementById("formEditarUsuario");
    const telefonoGroup = document.getElementById("telefonoGroup");
    const btnCambiarPass = document.getElementById("btnCambiarPass");
    const passGroup = document.getElementById("passGroup");

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
});