document.addEventListener("DOMContentLoaded", () => {
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
}
