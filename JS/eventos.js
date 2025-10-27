document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("contenedorEventos");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Cargar los eventos desde la BD
    async function cargarEventos() {
        const resp = await fetch("../php/eventos/cards_eventos.php");
        const eventos = await resp.json();

        if (eventos.length === 0) {
            contenedor.innerHTML = "<p>No hay eventos disponibles.</p>";
            return;
        }

        contenedor.innerHTML = "";

        eventos.forEach((ev, i) => {
            const detallesId = `extra${i}`;
            const filtroLower = ev.filtro ? ev.filtro.toLowerCase() : "";

            const card = `
            <div class="text_box event-item" data-categories="${filtroLower}">
                <div class="text_box_inner">
                    <div class="text_box_img">
                        <img src="../${ev.img_url}" alt="${ev.titulo}"/>
                    </div>
                    <div class="text_box_content">
                        <h2>${ev.titulo} <span class="event-category">${ev.filtro}</span></h2>
                        <p>${ev.descripcion}</p>
                        <button class="evntosinfo-btn btn btn-outline-primary btn-sm" data-target="${detallesId}">
                            más info
                        </button>
                        <br/>
                        <div id="${detallesId}" class="extra-cont d-none">
                            <div class="extra-extend mt-2">
                                <h3>Detalles</h3>
                                <p>${ev.detalles || "Sin detalles adicionales."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/>`;
            contenedor.insertAdjacentHTML("beforeend", card);
        });
    }

    await cargarEventos();
    
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".evntosinfo-btn");
        if (!btn) return;

        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        target.classList.toggle("d-none");
        const abierto = !target.classList.contains("d-none");

        btn.textContent = abierto ? "menos info" : "más info";
    });
    
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;

        // Quitar clase activa de todos
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filtro = btn.dataset.filter;
        const items = document.querySelectorAll(".event-item");

        items.forEach(item => {
            const categorias = item.dataset.categories.split(" ");
            if (filtro === "all" || categorias.includes(filtro)) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    });
});