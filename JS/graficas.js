fetch("../php/historial/graficas_historial.php")
    .then(res => res.json())
    .then(data => {
        // Tipo de reserva
        new Chart(document.getElementById("chartTipo"), {
            type: "pie",
            data: {
                labels: Object.keys(data.por_tipo),
                datasets: [{
                    data: Object.values(data.por_tipo),
                    backgroundColor: ["#3b82f6", "#22c55e"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });

        // Actividad diaria
        new Chart(document.getElementById("chartFecha"), {
            type: "bar",
            data: {
                labels: data.por_fecha.map(f => f.fecha),
                datasets: [{
                    label: "Reservas",
                    data: data.por_fecha.map(f => f.total),
                    backgroundColor: "#f59e0b"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Más usados
        new Chart(document.getElementById("chartMas"), {
            type: "bar",
            data: {
                labels: data.mas_usados.map(r => r.recurso),
                datasets: [{
                    label: "Cantidad de Reservas",
                    data: data.mas_usados.map(r => r.total),
                    backgroundColor: "#2563eb"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y",
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Menos usados
        new Chart(document.getElementById("chartMenos"), {
            type: "bar",
            data: {
                labels: data.menos_usados.map(r => r.recurso),
                datasets: [{
                    label: "Cantidad de Reservas",
                    data: data.menos_usados.map(r => r.total),
                    backgroundColor: "#dc2626"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "y",
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Tendencia mensual
        new Chart(document.getElementById("chartMes"), {
            type: "line",
            data: {
                labels: data.por_mes.map(m => m.mes),
                datasets: [{
                    label: "Reservas por mes",
                    data: data.por_mes.map(m => m.total),
                    borderColor: "#10b981",
                    fill: false,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Acciones
        new Chart(document.getElementById("chartAccion"), {
            type: "doughnut",
            data: {
                labels: data.acciones.map(a => a.accion),
                datasets: [{
                    data: data.acciones.map(a => a.total),
                    backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444", "#22c55e", "#8b5cf6"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    });