<?php
/**
 * Clase Clasificaciones
 */
class Clasificaciones
{
    protected $documento;   // Ruta de acceso al documento circuitoEsquema.xml

    public function __construct()
    {
        $this->documento = __DIR__ . '/xml/circuitoEsquema.xml';
    }

    public function consultar()
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
}

// Instanciamos la clase y obtenemos el XML
$clasificacion = new Clasificaciones();
$xml = $clasificacion->consultar();

// Inicializamos variables por si el XML no se pudo leer
$nombreVencedor = "Desconocido";
$tiempoVencedor = "Desconocido";
$primero = $segundo = $tercero = "Desconocido";

if ($xml !== null) {
    // Ganador de la carrera
    $nombreVencedor = (string) ($xml->xpath('//ns:vencedor/ns:nombrePiloto')[0] ?? 'Desconocido');
    $tiempoVencedor = (string) ($xml->xpath('//ns:vencedor/ns:tiempo')[0] ?? 'Desconocido');

    // Clasificación del mundial
    $primero = (string) ($xml->xpath('//ns:clasificados/ns:primero')[0] ?? 'Desconocido');
    $segundo = (string) ($xml->xpath('//ns:clasificados/ns:segundo')[0] ?? 'Desconocido');
    $tercero = (string) ($xml->xpath('//ns:clasificados/ns:tercero')[0] ?? 'Desconocido');
}
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
            <a href="clasificaciones.html" title="Información de las clasificaciones" class="active">Clasificaciones</a>
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