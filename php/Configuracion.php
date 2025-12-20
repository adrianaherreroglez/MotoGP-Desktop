<?php
class Configuracion {
    private $servername = "localhost";
    private $username = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $database = "uo287543_db"; 
    private $conn;

    public function __construct() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->database);
        if ($this->conn->connect_error) {
            exit("<h2>ERROR de conexión: " . $this->conn->connect_error . "</h2>");
        }
    }

    // 1. Reiniciar todas las tablas (borrar datos)
    public function reiniciarTablas() {
        $tablas = ['observaciones_facilitador', 'resultados_test', 'usuarios', 'dispositivos', 'pericias', 'generos', 'profesiones'];
        foreach ($tablas as $tabla) {
            $sql = "TRUNCATE TABLE $tabla";
            $this->conn->query($sql);
        }
        echo "<p>Se han reiniciado todas las tablas.</p>";
    }

    // 2. Eliminar la base de datos
    public function eliminarBaseDatos() {
        $sql = "DROP DATABASE IF EXISTS " . $this->database;
        if ($this->conn->query($sql)) {
            echo "<p>Base de datos eliminada correctamente.</p>";
        } else {
            echo "<p>Error al eliminar la base de datos: " . $this->conn->error . "</p>";
        }
    }

    // 3. Exportar todas las tablas a CSV
    public function exportarTodasTablasCSV() {
        // Lista de tablas de la base de datos
        $tablas = ['profesiones','generos','pericias','dispositivos','usuarios','resultados_test','observaciones_facilitador'];

        foreach ($tablas as $tabla) {
            $sql = "SELECT * FROM $tabla";
            $resultado = $this->conn->query($sql);

            if ($resultado && $resultado->num_rows > 0) {
                $archivo = $tabla . '.csv';
                $file = fopen($archivo, 'w');

                // Cabecera
                $campos = $resultado->fetch_fields();
                $header = [];
                foreach($campos as $campo) {
                    $header[] = $campo->name;
                }
                fputcsv($file, $header);

                // Filas
                $resultado->data_seek(0);
                while($fila = $resultado->fetch_assoc()) {
                    fputcsv($file, $fila);
                }

                fclose($file);
                echo "<p>Tabla '$tabla' exportada a $archivo</p>";
            } else {
                echo "<p>Tabla '$tabla' está vacía. No se generó CSV.</p>";
            }
        }
    }

    public function cerrarConexion() {
        $this->conn->close();
    }
}

// --- INTERFAZ HTML ---
$config = new Configuracion();

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../estilo/estilo.css" />
    <link rel="stylesheet" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.ico" />
</head>
<body>
    <h1>Configuración Base de Datos</h1>
    <main>
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
