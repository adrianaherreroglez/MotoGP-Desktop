<?php
// Ruta: Cronometro.php está en la raíz, subimos un nivel
include_once('../Cronometro.php');

class FormularioPrueba
{
    private $db;

    public function __construct()
    {
        // Conexión obligatoria con mysqli y el usuario de la práctica
        $this->db = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "uo287543_db");

        if ($this->db->connect_error) {
            die("Error de conexión: " . $this->db->connect_error);
        }
    }

    // Obtener datos para los SELECT del mini-formulario inicial
    public function obtenerOpciones($tabla)
    {
        return $this->db->query("SELECT * FROM $tabla");
    }

    // Tarea: Registrar datos del usuario al inicio
    public function registrarDatosIniciales($profesion, $edad, $genero, $pericia)
    {
        $stmt = $this->db->prepare("INSERT INTO usuarios (profesion_id, edad, genero_id, pericia_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiii", $profesion, $edad, $genero, $pericia);
        $stmt->execute();
        $id = $this->db->insert_id;
        $stmt->close();
        return $id;
    }

    // EL MÉTODO QUE FALTABA: Guarda todo al finalizar la prueba
    public function guardarFinales($userId, $tiempo, $comentarios)
    {
        // 1. Insertar en resultados_test (Dispositivo 1 = PC por defecto)
        $completado = 1;
        $valoracion_dummy = 5; // Valor por defecto para cumplir con la estructura
        $stmt = $this->db->prepare("INSERT INTO resultados_test (codigo_usuario_id, dispositivo_id, tiempo, completado, valoracion) VALUES (?, 1, ?, ?, ?)");
        $tiempoInt = (int) $tiempo;
        $stmt->bind_param("iiii i", $userId, $tiempoInt, $completado, $valoracion_dummy);
        $stmt->execute();
        $idTest = $this->db->insert_id;
        $stmt->close();

        // 2. Insertar en observaciones_facilitador (Tarea 3 del PDF)
        $stmtObs = $this->db->prepare("INSERT INTO observaciones_facilitador (id_test, comentario) VALUES (?, ?)");
        $stmtObs->bind_param("is", $idTest, $comentarios);
        $stmtObs->execute();
        $stmtObs->close();

        // 3. Insertar en la tabla intermedia de tiempos solicitada
        $stmtT = $this->db->prepare("INSERT INTO tiempos_usuarios (codigo_usuario_id, tiempo_segundos) VALUES (?, ?)");
        $stmtT->bind_param("id", $userId, $tiempo);
        $stmtT->execute();
        $stmtT->close();
    }
}

// Lógica de sesión para el cronómetro
if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = serialize(new Cronometro());
}
$cronometro = unserialize($_SESSION['cronometro']);
$gestion = new FormularioPrueba();

// Procesar acciones del formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Si el usuario pulsa "Iniciar Prueba" tras rellenar sus datos
    if (isset($_POST['iniciar_prueba'])) {
        $idUser = $gestion->registrarDatosIniciales($_POST['profesion'], $_POST['edad'], $_POST['genero'], $_POST['pericia']);
        $_SESSION['usuario_id'] = $idUser;

        $cronometro->arrancar(); // Arranca el tiempo PHP
        $_SESSION['paso'] = 2;   // Cambiamos a la vista de preguntas
    }

    // Si el usuario pulsa "Terminar Prueba" tras las 10 preguntas
    if (isset($_POST['terminar_prueba'])) {
        $cronometro->parar(); // Para el tiempo PHP
        $tiempoTotal = $cronometro->getTiempo();

        $gestion->guardarFinales($_SESSION['usuario_id'], $tiempoTotal, $_POST['obs_facilitador']);

        $_SESSION['paso'] = 3; // Vista final de éxito
        $_SESSION['tiempo_final_formateado'] = $cronometro->mostrar();
    }
}
// Guardar estado del cronómetro
$_SESSION['cronometro'] = serialize($cronometro);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Usabilidad</title>
    <meta name="author" content="Adriana Herrero González" />
    <meta name="description" content="usabilidad de MotoGP-Desktop" />
    <meta name="keywords" content="motogp,motos,usabilidad, edad, pericia,cronometro" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.ico" />
</head>

<body>
    <h1>Prueba de Usabilidad</h1>

    <main>
        <?php if (!isset($_SESSION['paso']) || $_SESSION['paso'] == 1): ?>
            <form action="formulario.php" method="post">
                <section>
                    <h2>Datos Personales del Participante</h2>
                    <p>Por favor, rellene sus datos antes de comenzar la prueba.</p>

                    <label for="profesion">Profesión:</label>
                    <select id="profesion" name="profesion">
                        <?php
                        $res = $gestion->obtenerOpciones('profesiones');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='" . $r['profesion_id'] . "'>" . $r['nombre'] . "</option>";
                        ?>
                    </select>

                    <label for="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" required min="1" max="120">

                    <label for="genero">Género:</label>
                    <select id="genero" name="genero">
                        <?php
                        $res = $gestion->obtenerOpciones('generos');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='" . $r['genero_id'] . "'>" . $r['nombre'] . "</option>";
                        ?>
                    </select>

                    <label for="pericia">Nivel de Pericia:</label>
                    <select id="pericia" name="pericia">
                        <?php
                        $res = $gestion->obtenerOpciones('pericias');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='" . $r['pericia_id'] . "'>" . $r['nivel'] . "</option>";
                        ?>
                    </select>

                    <button type="submit" name="iniciar_prueba">Iniciar Prueba</button>
                </section>
            </form>

        <?php elseif ($_SESSION['paso'] == 2): ?>
            <form action="formulario.php" method="post">
                <h2>Cuestionario de Usabilidad</h2>
                <p>Navegue por la aplicación MotoGP Desktop y responda:</p>

                <?php for ($i = 1; $i <= 10; $i++): ?>
                    <section>
                        <label for="p<?php echo $i; ?>">Tarea <?php echo $i; ?>: ¿Cómo calificaría la facilidad para encontrar
                            los resultados de carrera?</label>
                        <input type="text" id="p<?php echo $i; ?>" name="preguntas[]" required>
                    </section>
                <?php endfor; ?>

                <fieldset>
                    <legend>Espacio para el Observador</legend>
                    <label for="obs">Escriba aquí sus comentarios adicionales sobre el desempeño del usuario:</label>
                    <textarea id="obs" name="obs_facilitador"></textarea>
                </fieldset>

                <button type="submit" name="terminar_prueba">Terminar Prueba</button>
            </form>

        <?php else: ?>
            <section>
                <h2>Prueba Completada con Éxito</h2>
                <p>El código de usuario generado ha sido: <strong><?php echo $_SESSION['usuario_id']; ?></strong></p>
                <p>Tiempo total registrado: <strong><?php echo $_SESSION['tiempo_final_formateado']; ?></strong></p>
                <p>Los datos han sido almacenados en la base de datos <code>uo287543_db</code>.</p>
                <a href="formulario.php">Realizar un nuevo test</a>
            </section>
            <?php session_destroy(); ?>
        <?php endif; ?>
    </main>
</body>

</html>