document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("contenidoCarruselEventos");
    const contenedor2 = document.getElementById("contenidoCarruselSalidas");
    // Cargar los eventos desde la BD
    async function insertarEventos() {
        const resp = await fetch("../php/eventos/eventos.php");
        const eventos = await resp.json();
        
        if (eventos.length === 0) {
            contenedor.innerHTML = "<p>No hay eventos disponibles.</p>";
            return;
        }
        
        contenedor.innerHTML = "";
        
        eventos.forEach((ev) => {
            
            const cardEvento = `
                <div class="card">
                    <img src="../${ev.img_url}" alt="${ev.titulo}" class="card-img-top" />
                    <div class="card-body">
                        <h5 class="card-title">${ev.titulo}</h5>
                        <p>${ev.descripcion}</p>
                    </div>
                </div>
            `;
            contenedor.insertAdjacentHTML("beforeend", cardEvento);
        });
    }
    
    
    async function insertarSalidas() {
        const resp = await fetch("../php/eventos/salidas.php");
        const salidas = await resp.json();
        
        if (salidas.length === 0) {
            contenedor2.innerHTML = "<p>No hay salidas disponibles.</p>";
            return;
        }
        
        contenedor2.innerHTML = "";
        
        salidas.forEach((ev) => {
            
            const cardSalida = `
                <div class="card">
                    <img src="../${ev.img_url}" alt="${ev.titulo}" class="card-img-top" />
                    <div class="card-body">
                        <h5 class="card-title">${ev.titulo}</h5>
                        <p>${ev.descripcion}</p>
                    </div>
                </div>
            `;
            contenedor2.insertAdjacentHTML("beforeend", cardSalida);
        });
    }
    insertarSalidas();
    insertarEventos();
});