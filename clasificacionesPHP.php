<?php
/**
 * Clase Clasificaciones
 */
class Clasificaciones
{
    protected $documento;   // Ruta de acceso al documento circuitoEsquema.xml
    protected $xml;         // Objeto SimpleXMLElement

    public function __construct()
    {
        $this->documento = __DIR__ . '/xml/circuitoEsquema.xml';
        $this->xml = $this->consultar();
    }

    /**
     * Método consultar: lee el XML y devuelve un objeto SimpleXMLElement o null
     */
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
            $xml->registerXPathNamespace('ns', 'http://www.uniovi.es'); // Namespace del XML
            return $xml;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Devuelve los datos del ganador
     */
    public function getGanador()
    {
        if ($this->xml === null) {
            return ['nombre' => 'Desconocido', 'tiempo' => 'Desconocido'];
        }

        $nombre = (string) ($this->xml->xpath('//ns:vencedor/ns:nombrePiloto')[0] ?? 'Desconocido');
        $tiempo = (string) ($this->xml->xpath('//ns:vencedor/ns:tiempo')[0] ?? 'Desconocido');

        return ['nombre' => $nombre, 'tiempo' => $tiempo];
    }

    /**
     * Devuelve el top 3 del mundial
     */
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
$ganador = $clasificacion->getGanador();
$top3 = $clasificacion->getTop3();


$nombreVencedor = $ganador['nombre'];
$tiempoVencedor = $ganador['tiempo'];
$primero = $top3['primero'];
$segundo = $top3['segundo'];
$tercero = $top3['tercero'];
