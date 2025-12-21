<?php
/**
 * Clase Clasificaciones
 */
class Clasificaciones
{
    protected $documento;   // Ruta del XML
    protected $xml;         // Objeto SimpleXMLElement

    // Datos extraídos
    public $ganadorNombre;
    public $ganadorTiempo;
    public $top1;
    public $top2;
    public $top3;

    public function __construct()
    {
        $this->documento = __DIR__ . '/xml/circuitoEsquema.xml';
        $this->xml = $this->consultar();

        // Inicializar variables con datos del XML
        $this->inicializarDatos();
    }

    protected function consultar()
    {
        if (!file_exists($this->documento)) {
            return null;
        }

        $datos = file_get_contents($this->documento);
        if ($datos === false) {
            return null;
        }

        try {
            $xml = new SimpleXMLElement($datos);
            $xml->registerXPathNamespace('ns', 'http://www.uniovi.es');
            return $xml;
        } catch (Exception $e) {
            return null;
        }
    }

    protected function inicializarDatos()
    {
        // Ganador
        $ganador = $this->getGanador();
        $this->ganadorNombre = $ganador['nombre'];
        $this->ganadorTiempo = $ganador['tiempo'];

        // Top 3
        $top3 = $this->getTop3();
        $this->top1 = $top3['primero'];
        $this->top2 = $top3['segundo'];
        $this->top3 = $top3['tercero'];
    }

    public function getGanador()
    {
        if ($this->xml === null) {
            return ['nombre' => 'Desconocido', 'tiempo' => 'Desconocido'];
        }

        $nombre = (string) ($this->xml->xpath('//ns:vencedor/ns:nombrePiloto')[0] ?? 'Desconocido');
        $tiempo = (string) ($this->xml->xpath('//ns:vencedor/ns:tiempo')[0] ?? 'Desconocido');

        return ['nombre' => $nombre, 'tiempo' => $tiempo];
    }

    public function getTop3()
    {
        if ($this->xml === null) {
            return ['primero' => 'Desconocido', 'segundo' => 'Desconocido', 'tercero' => 'Desconocido'];
        }

        $primero = (string) ($this->xml->xpath('//ns:clasificados/ns:primero')[0] ?? 'Desconocido');
        $segundo = (string) ($this->xml->xpath('//ns:clasificados/ns:segundo')[0] ?? 'Desconocido');
        $tercero = (string) ($this->xml->xpath('//ns:clasificados/ns:tercero')[0] ?? 'Desconocido');

        return ['primero' => $primero, 'segundo' => $segundo, 'tercero' => $tercero];
    }
}
$clasificacion = new Clasificaciones();