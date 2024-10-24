const $totalMetrosCubicos = document.querySelector('#total_metros_cubicos');
const $totalPiesTablares = document.querySelector('#total_pies_tablares');
const $alto = document.querySelector('#alto');
const $ancho = document.querySelector('#ancho');
const $espesor = document.querySelector('#espesor');
const $cantidad = document.querySelector('#cantidad');

function calculateCubicMeters() {
    const alto = Number($alto.value) || 0;
    const ancho = Number($ancho.value) || 0;
    const espesor = Number($espesor.value) || 0;
    const cantidad = Number($cantidad.value) || 0;
    const totalCubicMeters = ((alto * 0.3048) * (ancho * 0.0254) * (espesor * 0.0254)) * cantidad;

    $totalMetrosCubicos.value = totalCubicMeters.toFixed(6);
}

function calculateBoardFeet() {
    const alto = Number($alto.value) || 0;
    const ancho = Number($ancho.value) || 0;
    const espesor = Number($espesor.value) || 0;
    const cantidad = Number($cantidad.value) || 0;

    const totalBoardFeet = ((alto * ancho * espesor) / 12) * cantidad;

    $totalPiesTablares.value = totalBoardFeet.toFixed(6);
}

function calculateTotalVolumes() {
    calculateCubicMeters();
    calculateBoardFeet();
}

$alto.addEventListener('input', calculateTotalVolumes);
$ancho.addEventListener('input', calculateTotalVolumes);
$espesor.addEventListener('change', calculateTotalVolumes);
$cantidad.addEventListener('input', calculateTotalVolumes);

calculateTotalVolumes();