document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaEventos");
    const form = document.getElementById("formEvento");

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
                    <span>${ev.titulo} | ${ev.tipo_evento} - ${ev.filtro}</span>
                    <img src="../${ev.img_url}" alt="${ev.titulo}" style="width:40px;height:40px;object-fit:cover;border-radius:5px;">
                `;
                lista.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar eventos:", error);
        }
    }
    
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
                    timer: 3000,
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
    
    cargarEventos();
});
