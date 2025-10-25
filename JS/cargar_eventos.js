document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("contenedorEventos");
    const resp = await fetch("../php/eventos/cards_eventos.php");
    const eventos = await resp.json();

    if (eventos.length === 0) {
        contenedor.innerHTML = "<p>No hay eventos disponibles.</p>";
        return;
    }
    
    eventos.forEach((ev, i) => {
        const card = `
        <div class="col-md-6 col-lg-4">
            <div class="text_box event-item" data-categories="${ev.filtro}">
                <div class="text_box_inner">
                    <div class="text_box_img">
                        <img src="../${ev.img_url}" alt="${ev.titulo}" style="width:100%;border-radius:10px;">
                    </div>
                    <div class="text_box_content mt-3">
                        <h2>${ev.titulo} 
                            <span class="event-category">${ev.filtro}</span>
                        </h2>
                        <p>${ev.descripcion}</p>
                        <button class="evntosinfo-btn btn btn-outline-primary btn-sm" data-target="extra${i}">
                            Más info
                        </button>
                        <div id="extra${i}" class="extra-cont" style="display:none;">
                            <div class="extra-extend mt-2">
                                <h5>Detalles</h5>
                                <p>${ev.detalles || "Sin detalles adicionales."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        contenedor.insertAdjacentHTML("beforeend", card);
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("evntosinfo-btn")) {
            const id = e.target.dataset.target;
            const extra = document.getElementById(id);
            extra.style.display = extra.style.display === "none" ? "block" : "none";
        }
    });
});

/*document.addEventListener("DOMContentLoaded", () => {
    cargarEventos();
});

async function cargarEventos() {
    try {
        const resp = await fetch("../php/eventos/cards_eventos.php");
        const eventos = await resp.json();

        const contenedor = document.getElementById("contenedorEventos");
        contenedor.innerHTML = "";

        if (eventos.length === 0) {
            contenedor.innerHTML = "<p>No hay eventos disponibles en este momento.</p>";
            return;
        }

        eventos.forEach((ev, index) => {
            const card = `
            <div class="text_box event-item" data-categories="${ev.filtro || ''}">
                <div class="text_box_inner">
                    <div class="text_box_img">
                        <img src="../${ev.img_url || 'img/default.png'}"
                            alt="${ev.titulo}" />
                    </div>
                    <div class="text_box_content">
                        <h2>${ev.titulo}
                            <span class="event-category">${ev.filtro || ''}</span>
                        </h2>
                        <p>${ev.descripcion}</p>
                        <button class="evntosinfo-btn" data-target="extra${index}">más info</button>
                        <div id="extra${index}" class="extra-cont">
                            <div class="extra-extend">
                                <br>
                                <h3>Detalles</h3>
                                <p>${ev.detalles || 'Sin detalles adicionales'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            contenedor.insertAdjacentHTML("beforeend", card);
        });
    } catch (error) {
        console.error("Error al cargar eventos:", error);
    }
}*/
