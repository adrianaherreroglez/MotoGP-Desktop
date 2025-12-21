<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include __DIR__ . '/clasificacionesPHP.php';

$clasificacion = new Clasificaciones();
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>
<body>
<header>
    <h1><a href="index.html" title="Página de inicio">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Página de inicio">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Información de los juegos">Juegos</a>
            <a href="ayuda.html" title="Ayuda sobre MotoGP-Desktop">Ayuda</a>
        </nav>
</header>

<main>
<h2>Clasificación tras la carrera</h2>

<section>
<h3>Ganador de la carrera</h3>
<ul>
    <li>Nombre: <?= htmlentities($clasificacion->ganadorNombre) ?></li>
    <li>Tiempo empleado: <?= htmlentities($clasificacion->ganadorTiempo) ?></li>
</ul>
</section>

<section>
<h3>Top 3 del Mundial tras la carrera</h3>
<ol>
    <li><?= htmlentities($clasificacion->top1) ?></li>
    <li><?= htmlentities($clasificacion->top2) ?></li>
    <li><?= htmlentities($clasificacion->top3) ?></li>
</ol>
</section>
</main>
</body>
</html>
