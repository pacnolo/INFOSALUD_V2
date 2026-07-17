<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "ok" => false,
        "mensaje" => "Método no permitido."
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$servidor = "11.254.16.103";
$baseDatos = "DBTRABAJODIS";

$conexion = sqlsrv_connect($servidor, [
    "Database" => $baseDatos,
    "CharacterSet" => "UTF-8",
    "TrustServerCertificate" => true
]);

if ($conexion === false) {
    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "mensaje" => "No fue posible conectar con SQL Server.",
        "erroresSQL" => sqlsrv_errors()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

$contenido = file_get_contents("php://input");
$datos = json_decode($contenido, true);

if (!is_array($datos)) {
    $datos = [];
}

$pagina = $datos["pagina"] ?? "index.html";
$bloque = $datos["bloque"] ?? null;
$ip = $_SERVER["REMOTE_ADDR"] ?? null;
$navegador = $_SERVER["HTTP_USER_AGENT"] ?? null;
$sistemaOperativo = $datos["sistemaOperativo"] ?? null;
$resolucion = $datos["resolucion"] ?? null;

$sql = "
    INSERT INTO dbo.Portal_Visitas
    (
        Pagina,
        Bloque,
        IP,
        Navegador,
        SistemaOperativo,
        Resolucion
    )
    VALUES (?, ?, ?, ?, ?, ?)
";

$parametros = [
    $pagina,
    $bloque,
    $ip,
    $navegador,
    $sistemaOperativo,
    $resolucion
];

$resultado = sqlsrv_query(
    $conexion,
    $sql,
    $parametros
);

if ($resultado === false) {
    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "mensaje" => "No fue posible registrar la visita.",
        "erroresSQL" => sqlsrv_errors(),
        "parametros" => $parametros
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    sqlsrv_close($conexion);
    exit;
}

$sqlTotal = "
    SELECT COUNT_BIG(*) AS Total
    FROM dbo.Portal_Visitas
";

$consultaTotal = sqlsrv_query($conexion, $sqlTotal);

if ($consultaTotal === false) {
    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "mensaje" => "La visita se registró, pero no fue posible obtener el total.",
        "erroresSQL" => sqlsrv_errors()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    sqlsrv_close($conexion);
    exit;
}

$fila = sqlsrv_fetch_array(
    $consultaTotal,
    SQLSRV_FETCH_ASSOC
);

$total = $fila ? (int) $fila["Total"] : 0;

echo json_encode([
    "ok" => true,
    "mensaje" => "Visita registrada correctamente.",
    "totalVisitas" => $total
], JSON_UNESCAPED_UNICODE);

sqlsrv_free_stmt($resultado);
sqlsrv_free_stmt($consultaTotal);
sqlsrv_close($conexion);
