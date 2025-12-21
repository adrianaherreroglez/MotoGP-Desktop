<?php
class Clasificaciones
{
    protected $documento;   // Ruta del XML
    public $ganadorNombre;
    public $ganadorTiempo;
    public $top1;
    public $top2;
    public $top3;

    public function __construct()
    {
        $this->documento = __DIR__ . '/xml/circuitoEsquema.xml';
        $this->consultar();
    }

    protected function consultar()
    {
        if (!file_exists($this->documento)) {
            $this->setDesconocido();
            return;
        }

        $contenido = @file_get_contents($this->documento);
        if ($contenido === false) {
            $this->setDesconocido();
            return;
        }

        // Buscar ganador
        if (preg_match('/<nombrePiloto>(.*?)<\/nombrePiloto>/', $contenido, $m)) {
            $this->ganadorNombre = $m[1];
        } else {
            $this->ganadorNombre = 'Desconocido';
        }

        if (preg_match('/<tiempo>(.*?)<\/tiempo>/', $contenido, $m)) {
            $this->ganadorTiempo = $m[1];
        } else {
            $this->ganadorTiempo = 'Desconocido';
        }

        // Buscar Top 3
        $this->top1 = $this->buscarTag('primero', $contenido);
        $this->top2 = $this->buscarTag('segundo', $contenido);
        $this->top3 = $this->buscarTag('tercero', $contenido);
    }

    protected function buscarTag($tag, $contenido)
    {
        if (preg_match('/<' . $tag . '>(.*?)<\/' . $tag . '>/', $contenido, $m)) {
            return $m[1];
        }
        return 'Desconocido';
    }

    protected function setDesconocido()
    {
        $this->ganadorNombre = 'Desconocido';
        $this->ganadorTiempo = 'Desconocido';
        $this->top1 = 'Desconocido';
        $this->top2 = 'Desconocido';
        $this->top3 = 'Desconocido';
    }
}
