<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();                
include __DIR__ . '/cronometro.php';

$cronometro = Cronometro::cargarDeSesion();
$mensaje = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = key($_POST);
    $mensaje = $cronometro->accion($accion);
    $cronometro->guardarEnSesion();
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>MotoGP-Cronómetro</title>
    <meta name="author" content="Adriana Herrero González" />
    <meta name="description" content="Información sobre el cronometro php del proyecto MotoGP-Desktop" />
    <meta name="keywords" content="MotoGP, clasificaciones, pilotos, circuitos, cronometro,arrancar, paarar,mostrar" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.ico" />
</head>

<body>
    <header>
        <h1><a href="index.html" title="Página de inicio">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página de inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones">Clasificaciones</a>
            <a href="juegos.html" title="Información de los juegos" class="active">Juegos</a>
            <a href="ayuda.html" title="Ayuda sobre MotoGP-Desktop">Ayuda</a>
        </nav>
    </header>

    <p>Estás en <a href="index.html" title="Página de inicio">Inicio</a> >> <a href="juegos.html"
            title="Página de juegos">Juegos</a> >> <strong>Cronómetro</strong></p>


    <main>
        <h2>Prueba de Cronómetro</h2>

        <form method="post">
            <input type="submit" name="arrancar" value="Arrancar">
            <input type="submit" name="parar" value="Parar">
            <input type="submit" name="mostrar" value="Mostrar">
        </form>

        <p><?php echo $mensaje; ?></p>
    </main>
</body>

</html>