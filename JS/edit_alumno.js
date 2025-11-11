document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("alumnoForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        
        const formData = new FormData(form);

        try {
            const resp = await fetch(form.action, {
                method: "POST",
                body: formData
            });
            const data = await resp.json();
            
            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Guardado",
                    text: "Los datos del alumno se actualizaron correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire("Error", data.error || "No se pudo actualizar el alumno", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error en la petición al servidor", "error");
        }
    });
});