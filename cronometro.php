<?php
session_start();

class Cronometro
{
    protected $inicio;
    protected $fin;
    protected $tiempo;

    public function __construct()
    {
        $this->reiniciar();
    }

    public function arrancar()
    {
        $this->inicio = microtime(true);
        $this->fin = null;
    }

    public function parar()
    {
        if ($this->inicio !== null) {
            $this->fin = microtime(true);
            $this->tiempo = $this->fin - $this->inicio;
        } else {
            $this->tiempo = 0;
        }
    }

    public function reiniciar()
    {
        $this->inicio = null;
        $this->fin = null;
        $this->tiempo = 0;
    }

    // Devuelve el tiempo transcurrido en segundos
    public function getTiempo()
    {
        return $this->tiempo;
    }

    // Devuelve el tiempo formateado en MM:SS.s
    public function mostrar()
    {
        $totalSegundos = $this->tiempo;
        $minutos = floor($totalSegundos / 60);
        $segundos = $totalSegundos - ($minutos * 60);
        return sprintf("%02d:%04.1f", $minutos, $segundos);
    }

    public function accion($accion)
    {
        switch ($accion) {
            case 'arrancar':
                $this->arrancar();
                return "Cronómetro arrancado.";
            case 'parar':
                $this->parar();
                return "Cronómetro parado.";
            case 'mostrar':
                return "Tiempo transcurrido: " . $this->mostrar();
            case 'reiniciar':
                $this->reiniciar();
                return "Cronómetro reiniciado.";
            default:
                return "Acción no válida.";
        }
    }

    // Guarda el cronómetro en sesión
    public function guardarEnSesion($clave = 'cronometro')
    {
        $_SESSION[$clave] = serialize($this);
    }

    // Carga el cronómetro desde sesión
    public static function cargarDeSesion($clave = 'cronometro')
    {
        if (isset($_SESSION[$clave])) {
            return unserialize($_SESSION[$clave]);
        }
        return new self();
    }
}

// Inicialización

$cronometro = Cronometro::cargarDeSesion();
$mensaje = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = key($_POST);
    $mensaje = $cronometro->accion($accion);
    $cronometro->guardarEnSesion();
}

