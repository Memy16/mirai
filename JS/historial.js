document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const tbody = document.querySelector("#tablaHistorial tbody");

    loader.style.display = "block";

    fetch("../php/historial.php")
    .then(res => res.json())
    .then(data => {
        loader.style.display = "none";

        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">Error cargando historial</td></tr>`;
            return;
        }

        let html = "";

        data.historial.forEach(item => {
            html += `
                <tr>
                    <td>${item.id_reserva}</td>
                    <td><span class="badge bg-${item.tipo === "AULA" ? "primary" : "warning"}">${item.tipo}</span></td>
                    <td>${item.docente}</td>
                    <td>${item.ci}</td>
                    <td>${item.item}</td>
                    <td>${item.fecha}</td>
                    <td>${item.hora}</td>
                    <td>${item.turno}</td>
                    <td>${item.accion}</td>
                    <td>${item.fecha_hist}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    })
    .catch(err => {
        loader.style.display = "none";
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">
            Error de conexión con el servidor
        </td></tr>`;
    });
});
