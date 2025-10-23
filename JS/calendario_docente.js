document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        themeSystem: 'bootstrap5', // 🧠 Usa estilos Bootstrap automáticamente
        events: 'php/obtener_reservas.php', // Endpoint PHP
        eventDisplay: 'block',
        eventColor: '#1C4C96',
        eventTextColor: '#fff',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        eventClick: function (info) {
            // Modal SweetAlert con los detalles
            Swal.fire({
                title: info.event.title,
                html: `
            <b>Inicio:</b> ${info.event.start.toLocaleString()} <br>
            <b>Fin:</b> ${info.event.end ? info.event.end.toLocaleString() : '—'} <br>
            <b>Aula:</b> ${info.event.extendedProps.aula || 'No especificada'}
        `,
                icon: 'info',
                confirmButtonColor: '#1C4C96'
            });
        }
    });

    calendar.render();
});