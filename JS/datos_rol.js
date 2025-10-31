document.addEventListener('DOMContentLoaded', function () {
    const rolSelect = document.getElementById('rol');
    const codigoDiv = document.getElementById('codigoDiv');
    const telefonoDiv = document.getElementById('telefonoDiv');

    function toggleCampos() {
        const rol = rolSelect.value;

        if (rol === 'estudiante') {
            codigoDiv.style.display = 'none';
            telefonoDiv.style.display = 'none';
        } else if (rol === 'profesor' || rol === 'administrador') {
            codigoDiv.style.display = 'block';
            telefonoDiv.style.display = 'block';
        } else {
            // Opción "Seleccione su rol"
            codigoDiv.style.display = 'none';
            telefonoDiv.style.display = 'none';
        }
    }

    // Ejecutar al cargar (por si hay valor guardado o preseleccionado)
    toggleCampos();

    // Escuchar cambios
    rolSelect.addEventListener('change', toggleCampos);
});