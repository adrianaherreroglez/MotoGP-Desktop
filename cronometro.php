<?php
session_start();

/**
 * Clase Cronometro
 */
class Cronometro
{
    protected $inicio;
    protected $fin;
    protected $tiempo;

    public function __construct()
    {
        $this->tiempo = 0;
        $this->inicio = null;
        $this->fin = null;
    }

    public function arrancar()
    {
        $this->inicio = microtime(true);
        $this->fin = null;
    }

    public function parar()
    {
        if (isset($this->inicio)) {
            $this->fin = microtime(true);
            $this->tiempo = $this->fin - $this->inicio;
        } else {
            $this->tiempo = 0;
        }
    }

    public function getTiempo()
    {
        return $this->tiempo;
    }

    public function mostrar()
    {
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
