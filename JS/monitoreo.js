    async function cargarInforme() {
        const res = await fetch("../php/monitor.php");
        const html = await res.text();
        document.getElementById("reporte").innerHTML = html;
    }

    document.getElementById("actualizar").addEventListener("click", cargarInforme);

    // Carga inicial
    cargarInforme();

    // Refrescar automáticamente cada 5 horas (en milisegundos)
    const cincoHoras = 5 * 60 * 60 * 1000;
    setInterval(cargarInforme, cincoHoras);