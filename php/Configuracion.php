<?php
class Configuracion
{
    private $servername = "localhost";
    private $username = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $database = "uo287543_db";
    private $conn;
    public $mensajes = [];

    public function __construct()
    {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->database);
        if ($this->conn->connect_error) {
            exit("<h2>ERROR de conexión: " . $this->conn->connect_error . "</h2>");
        }
    }

    public function reiniciarTablas()
    {
        $tablas = ['observaciones_facilitador', 'resultados_test', 'usuarios', 'dispositivos', 'pericias', 'generos', 'profesiones'];
        foreach ($tablas as $tabla) {
            $result = $this->conn->query("SHOW TABLES LIKE '$tabla'");
            if ($result && $result->num_rows > 0) {
                $this->conn->query("TRUNCATE TABLE $tabla");
                $this->mensajes[] = "Tabla '$tabla' reiniciada.";
            } else {
                $this->mensajes[] = "Tabla '$tabla' no existe, no se puede reiniciar.";
            }
        }
    }

    public function eliminarBaseDatos()
    {
        $this->conn->close();
        $conn = new mysqli($this->servername, $this->username, $this->password);
        if ($conn->connect_error) {
            exit("<h2>ERROR de conexión: " . $conn->connect_error . "</h2>");
        }
        $sql = "DROP DATABASE IF EXISTS " . $this->database;
        if ($conn->query($sql)) {
            $this->mensajes[] = "Base de datos eliminada correctamente.";
        } else {
            $this->mensajes[] = "Error al eliminar la base de datos: " . $conn->error;
        }
        $conn->close();
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->database);
    }

    public function exportarTodasTablasCSV()
    {
        $tablas = ['profesiones', 'generos', 'pericias', 'dispositivos', 'usuarios', 'resultados_test', 'observaciones_facilitador'];
        foreach ($tablas as $tabla) {
            $resultado = $this->conn->query("SELECT * FROM $tabla");
            if ($resultado && $resultado->num_rows > 0) {
                $archivo = $tabla . '.csv';
                $file = fopen($archivo, 'w');
                if (!$file) {
                    $this->mensajes[] = "No se pudo crear el archivo $archivo. Revisa permisos.";
                    continue;
                }
                $campos = $resultado->fetch_fields();
                $header = [];
                foreach ($campos as $campo) {
                    $header[] = $campo->name;
                }
                fputcsv($file, $header);
                while ($fila = $resultado->fetch_assoc()) {
                    fputcsv($file, $fila);
                }
                fclose($file);
                $this->mensajes[] = "Tabla '$tabla' exportada a $archivo.";
            } else {
                $this->mensajes[] = "Tabla '$tabla' está vacía. No se generó CSV.";
            }
        }
    }

    public function cerrarConexion()
    {
        if ($this->conn)
            $this->conn->close();
    }
}

$config = new Configuracion();

// Procesar POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['reiniciar'])) {
        $config->reiniciarTablas();
    }
    if (isset($_POST['eliminar'])) {
        $config->eliminarBaseDatos();
    }
    if (isset($_POST['exportar'])) {
        $config->exportarTodasTablasCSV();
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>MotoGP-Configuración</title>
    <meta name="author" content="Adriana Herrero González" />
    <meta name="description" content="Aplicación de utilidad del proyecto MotoGP-Desktop" />
    <meta name="keywords" content="motogp,motos,reiniciar,eliminar,exportar" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../estilo/estilo.css" />
    <link rel="stylesheet" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.ico" />
</head>
</head>

<body>
    <h1>Configuración Base de Datos</h1>
    <main>
        <!-- Mostrar mensajes -->
        <?php if (!empty($config->mensajes)): ?>
            <?php foreach ($config->mensajes as $msg): ?>
                <p><?= htmlspecialchars($msg) ?></p>
            <?php endforeach; ?>
        <?php endif; ?>

        <form method="post">
            <button type="submit" name="reiniciar">Reiniciar todas las tablas</button>
            <button type="submit" name="eliminar">Eliminar base de datos</button>
            <button type="submit" name="exportar">Exportar todas las tablas a CSV</button>
        </form>
    </main>
</body>

</html>

<?php
$config->cerrarConexion();
?>