<?php
session_start();

/**
 * Clase Cronometro
 */
class Cronometro {
    protected $inicio;   // Momento en que se arrancó
    protected $fin;      // Momento en que se paró
    protected $tiempo;   // Tiempo total transcurrido en segundos (float)

    public function __construct() {
        $this->tiempo = 0;
        $this->inicio = null;
        $this->fin = null;
    }

    public function arrancar() {
        $this->inicio = microtime(true);
        $this->fin = null;
    }

    public function parar() {
        if (isset($this->inicio)) {
            $this->fin = microtime(true);
            $this->tiempo = $this->fin - $this->inicio;
        } else {
            $this->tiempo = 0;
        }
    }

    public function getTiempo() {
        return $this->tiempo;
    }

    // Mostrar tiempo en mm:ss.s usando DateTime
    public function mostrar() {
        $totalSegundos = $this->tiempo;
        $minutos = floor($totalSegundos / 60);
        $segundos = $totalSegundos - ($minutos * 60);
        return sprintf("%02d:%04.1f", $minutos, $segundos);
    }
}

// Inicializamos cronómetro en sesión si no existe
if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = serialize(new Cronometro());
}
$cronometro = unserialize($_SESSION['cronometro']);

$mensaje = "";

// Comprobamos si se ha pulsado algún botón
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['arrancar'])) {
        $cronometro->arrancar();
        $mensaje = "Cronómetro arrancado.";
    }
    if (isset($_POST['parar'])) {
        $cronometro->parar();
        $mensaje = "Cronómetro parado.";
    }
    if (isset($_POST['mostrar'])) {
        $mensaje = "Tiempo transcurrido: " . $cronometro->mostrar();
    }
}

// Guardamos el cronómetro actualizado en sesión
$_SESSION['cronometro'] = serialize($cronometro);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>MotoGP-Desktop - Cronómetro</title>
    <link rel="stylesheet" href="estilo.css">
    <link rel="stylesheet" href="layout.css">
</head>
<body>
<header>
    <h1>MotoGP-Desktop - Cronómetro</h1>
    <nav>
        <a href="index.php">Inicio</a> &gt; <a href="#">Cronómetro</a>
    </nav>
</header>

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
