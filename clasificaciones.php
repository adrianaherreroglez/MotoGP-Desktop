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
        $this->xml = $this->consultar(); // Leemos el XML al instanciar la clase
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

// --- Instanciamos la clase y obtenemos los datos ---
$clasificacion = new Clasificaciones();
$ganador = $clasificacion->getGanador();
$top3 = $clasificacion->getTop3();

// Variables para mostrar en HTML
$nombreVencedor = $ganador['nombre'];
$tiempoVencedor = $ganador['tiempo'];
$primero = $top3['primero'];
$segundo = $top3['segundo'];
$tercero = $top3['tercero'];
?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <meta name="author" content="Adriana Herrero González" />
    <meta name="description" content="Información sobre las clasificaciones del proyecto MotoGP-Desktop" />
    <meta name="keywords" content="MotoGP, clasificaciones, pilotos, circuitos" />
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
            <a href="meteorología.html" title="Información de la meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Información de los juegos">Juegos</a>
            <a href="ayuda.html" title="Ayuda sobre MotoGP-Desktop">Ayuda</a>
        </nav>
    </header>

    <p>Estás en <a href="index.html" title="Página de inicio">Inicio</a> >> <strong>Clasificaciones</strong></p>

    <main>
        <h2>Clasificación tras la carrera</h2>

        <section>
            <h3>Ganador de la carrera</h3>
            <ul>
                <li>Nombre: <?php echo htmlentities($nombreVencedor); ?></li>
                <li>Tiempo empleado: <?php echo htmlentities($tiempoVencedor); ?></li>
            </ul>
        </section>

        <section>
            <h3>Top 3</h3>
            <ol>
                <li><?php echo htmlentities(string: $primero); ?></li>
                <li><?php echo htmlentities($segundo); ?></li>
                <li><?php echo htmlentities($tercero); ?></li>
            </ol>
        </section>

    </main>
</body>

</html>