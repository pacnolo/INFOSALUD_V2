<?php

header('Content-Type: application/json; charset=utf-8');

$servidor = "NOMBRE_SERVIDOR";
$baseDatos = "DBTRABAJODIS";
$usuario = "USUARIO_SQL";
$contrasena = "CONTRASENA_SQL";

$conexion = sqlsrv_connect($servidor, [
    "Database" => $baseDatos,
    "UID" => $usuario,
    "PWD" => $contrasena,
    "CharacterSet" => "UTF-8",
    "TrustServerCertificate" => true
]);

if ($conexion === false) {
    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "mensaje" => "No fue posible conectar con SQL Server.",
        "errores" => sqlsrv_errors()
    ]);

    exit;
}

$datos = json_decode(file_get_contents("php://input"), true);

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

$resultado = sqlsrv_query($conexion, $sql, $parametros);

if ($resultado === false) {
    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "mensaje" => "No fue posible registrar la visita.",
        "errores" => sqlsrv_errors()
    ]);

    sqlsrv_close($conexion);
    exit;
}

$sqlTotal = "
    SELECT COUNT(*) AS Total
    FROM dbo.Portal_Visitas
";

$consultaTotal = sqlsrv_query($conexion, $sqlTotal);
$total = 0;

if ($consultaTotal !== false && $fila = sqlsrv_fetch_array($consultaTotal, SQLSRV_FETCH_ASSOC)) {
    $total = (int) $fila["Total"];
}

echo json_encode([
    "ok" => true,
    "totalVisitas" => $total
]);

sqlsrv_close($conexion);