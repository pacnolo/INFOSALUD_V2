<?php

header('Content-Type: application/json; charset=utf-8');

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
        "errores" => sqlsrv_errors()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$contenido = file_get_contents("php://input");
$datos = json_decode($contenido, true);

if (!is_array($datos)) {
    $datos = [];
}

$pagina = $datos["pagina"] ?? "index.html";
$bloque = $datos["bloque"] ?? null;
$usuarioPortal = $datos["usuario"] ?? null;
$equipo = $datos["equipo"] ?? null;

$ip = $_SERVER["REMOTE_ADDR"] ?? null;
$navegador = $_SERVER["HTTP_USER_AGENT"] ?? null;

$sistemaOperativo = $datos["sistemaOperativo"] ?? null;
$resolucion = $datos["resolucion"] ?? null;

$sql = "
    INSERT INTO dbo.Portal_Visitas
    (
        Pagina,
        Bloque,
        Usuario,
        Equipo,
        IP,
        Navegador,
        SistemaOperativo,
        Resolucion
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
";

$parametros = [
    $pagina,
    $bloque,
    $usuarioPortal,
    $equipo,
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
        "errores" => sqlsrv_errors()
    ], JSON_UNESCAPED_UNICODE);

    sqlsrv_close($conexion);
    exit;
}

$sqlTotal = "
    SELECT COUNT(*) AS Total
    FROM dbo.Portal_Visitas
";

$consultaTotal = sqlsrv_query($conexion, $sqlTotal);
$total = 0;

if ($consultaTotal !== false) {
    $fila = sqlsrv_fetch_array(
        $consultaTotal,
        SQLSRV_FETCH_ASSOC
    );

    if ($fila) {
        $total = (int) $fila["Total"];
    }
}

echo json_encode([
    "ok" => true,
    "mensaje" => "Visita registrada correctamente.",
    "totalVisitas" => $total
], JSON_UNESCAPED_UNICODE);

sqlsrv_close($conexion);
