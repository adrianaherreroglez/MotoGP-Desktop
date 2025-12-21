<?php
include('../Cronometro.php');

class FormularioPrueba
{
    private $db;

    public function __construct()
    {
        $this->db = new mysqli("localhost", "DBUSER2025", "DBPSWD2025", "uo287543_db");
        if ($this->db->connect_error) {
            die("Error de conexión: " . $this->db->connect_error);
        }
    }

    public function obtenerOpciones($tabla, $condicion = '')
    {
        $sql = "SELECT * FROM $tabla";
        if ($condicion != '') {
            $sql .= " WHERE $condicion";
        }
        return $this->db->query($sql);
    }

    public function registrarDatosIniciales($profesion, $edad, $genero, $pericia)
    {
        $stmt = $this->db->prepare("INSERT INTO usuarios (profesion_id, edad, genero_id, pericia_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiii", $profesion, $edad, $genero, $pericia);
        $stmt->execute();
        $id = $stmt->insert_id;
        $stmt->close();
        return $id;
    }

    public function guardarFinales($userId, $dispositivoId, $tiempoSegundos, $comentariosFacilitador, $comentariosUsuario, $propuestas, $valoracion, $respuestas)
    {
        $horas = floor($tiempoSegundos / 3600);
        $minutos = floor(($tiempoSegundos % 3600) / 60);
        $segundos = $tiempoSegundos % 60;
        $tiempoSQL = sprintf("%02d:%02d:%02d", $horas, $minutos, $segundos);

        $completado = 1;

        // Guardar resultados_test
        $stmt = $this->db->prepare("INSERT INTO resultados_test (codigo_usuario_id, dispositivo_id, tiempo, completado, comentarios, propuestas, valoracion) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iisissi", $userId, $dispositivoId, $tiempoSQL, $completado, $comentariosUsuario, $propuestas, $valoracion);
        $stmt->execute();
        $idTest = $stmt->insert_id;
        $stmt->close();

        // Guardar observaciones del facilitador
        if (!empty($comentariosFacilitador)) {
            $stmtObs = $this->db->prepare("INSERT INTO observaciones_facilitador (id_test, comentario) VALUES (?, ?)");
            $stmtObs->bind_param("is", $idTest, $comentariosFacilitador);
            $stmtObs->execute();
            $stmtObs->close();
        }
    }

    public function usuarioExiste($userId)
    {
        $result = $this->db->query("SELECT * FROM usuarios WHERE codigo_usuario_id = $userId");
        return $result->num_rows > 0;
    }
}

// Cronómetro
if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = serialize(new Cronometro());
}
$cronometro = unserialize($_SESSION['cronometro']);
$gestion = new FormularioPrueba();

// Validar si el usuario de sesión aún existe
if (isset($_SESSION['usuario_id'])) {
    if (!$gestion->usuarioExiste($_SESSION['usuario_id'])) {
        unset($_SESSION['usuario_id']);
        unset($_SESSION['dispositivo_id']);
        $_SESSION['paso'] = 1; // Volver al paso inicial
    }
}

// Procesar POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['iniciar_prueba'])) {
        $idUser = $gestion->registrarDatosIniciales(
            $_POST['profesion'],
            $_POST['edad'],
            $_POST['genero'],
            $_POST['pericia']
        );
        $_SESSION['usuario_id'] = $idUser;
        $_SESSION['dispositivo_id'] = $_POST['dispositivo'];
        $cronometro->arrancar();
        $_SESSION['paso'] = 2;
    }

    if (isset($_POST['terminar_prueba'])) {
        $cronometro->parar();
        $tiempoTotal = $cronometro->getTiempo();

        $respuestas = $_POST['preguntas'];
        $comentariosFacilitador = $_POST['obs_facilitador'] ?? '';
        $comentariosUsuario = $_POST['comentarios_usuario'] ?? '';
        $propuestas = $_POST['propuestas'] ?? '';
        $valoracion = (int) $_POST['valoracion'];

        $gestion->guardarFinales(
            $_SESSION['usuario_id'],
            $_SESSION['dispositivo_id'],
            $tiempoTotal,
            $comentariosFacilitador,
            $comentariosUsuario,
            $propuestas,
            $valoracion,
            $respuestas
        );
        $_SESSION['paso'] = 3;
    }
}

$_SESSION['cronometro'] = serialize($cronometro);

// Preguntas sobre MotoGP-Desktop
$preguntas = [
    "¿Cuántas vueltas tiene el circuito?",
    "¿Quién ganó el premio de Qatar en 2025?",
    "¿Qué tiempo hizo el ganador?",
    "¿Quién quedó tercero en el mundial tras la carrera?",
    "¿Qué temperatura hizo el día de la carrera?",
    "¿Cuántos puntos hizo Marc Márquez esta temporada?",
    "¿Cuál fue el cuarto equipo por el que ha pasado Marc Márquez?",
    "Anchura media del circuito",
    "Hora de inicio de la carrera",
    "¿En qué localidad nació Marc Márquez?"
];
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Prueba de Usabilidad MotoGP</title>
    <meta name="author" content="Adriana Herrero González" />
    <meta name="description" content="Aplicación de utilidad del proyecto MotoGP-Desktop" />
    <meta name="keywords" content="prueba,usabilidad,formulario,edad,profesion,moto,marc,genero,vueltas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel="stylesheet" href="../estilo/layout.css">
    <link rel="icon" href="../multimedia/favicon.ico" />
</head>

<body>
    <h1>Prueba de Usabilidad MotoGP</h1>
    <main>

        <?php if (!isset($_SESSION['paso']) || $_SESSION['paso'] == 1): ?>
            <form method="post">
                <h2>Datos del Participante</h2>

                <fieldset>
                    <h3>Profesión</h3>
                    <select name="profesion" required>
                        <option value="">Seleccione su profesión</option>
                        <?php
                        $res = $gestion->obtenerOpciones('profesiones');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='{$r['profesion_id']}'>{$r['nombre']}</option>";
                        ?>
                    </select>
                </fieldset>

                <fieldset>
                    <h3>Edad</h3>
                    <input type="number" name="edad" required min="1" max="120">
                </fieldset>

                <fieldset>
                    <h3>Género</h3>
                    <select name="genero" required>
                        <option value="">Seleccione su género</option>
                        <?php
                        $res = $gestion->obtenerOpciones('generos');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='{$r['genero_id']}'>{$r['nombre']}</option>";
                        ?>
                    </select>
                </fieldset>

                <fieldset>
                    <h3>Pericia</h3>
                    <select name="pericia" required>
                        <option value="">Seleccione nivel de pericia</option>
                        <?php
                        $res = $gestion->obtenerOpciones('pericias');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='{$r['pericia_id']}'>{$r['nivel']}</option>";
                        ?>
                    </select>
                </fieldset>

                <fieldset>
                    <h3>Dispositivo</h3>
                    <select name="dispositivo" required>
                        <option value="">Seleccione su dispositivo</option>
                        <?php
                        $res = $gestion->obtenerOpciones('dispositivos');
                        while ($r = $res->fetch_assoc())
                            echo "<option value='{$r['dispositivo_id']}'>{$r['nombre']}</option>";
                        ?>
                    </select>
                </fieldset>

                <button type="submit" name="iniciar_prueba">Iniciar Prueba</button>
            </form>

        <?php elseif ($_SESSION['paso'] == 2): ?>
            <form method="post">
                <h2>Cuestionario de Usabilidad</h2>

                <?php foreach ($preguntas as $i => $pregunta): ?>
                    <fieldset>
                        <h3>Pregunta <?= $i + 1 ?></h3>
                        <label for="p<?= $i ?>"><?= $pregunta ?></label>
                        <input type="text" id="p<?= $i ?>" name="preguntas[]" required>
                    </fieldset>
                <?php endforeach; ?>

                <fieldset>

                    <h3>Otras cuestiones</h3>
                    <label for="comentarios_usuario">Comentarios del Usuario:</label>
                    <textarea id="comentarios_usuario" name="comentarios_usuario" required></textarea>



                    <label for="propuestas">Propuestas del Usuario:</label>
                    <textarea id="propuestas" name="propuestas" required></textarea>



                    <label for="valoracion">Valoración de la experiencia:</label>
                    <select id="valoracion" name="valoracion" required>
                        <option value="">Seleccione valor</option>
                        <?php for ($v = 1; $v <= 10; $v++): ?>
                            <option value="<?= $v ?>"><?= $v ?></option>
                        <?php endfor; ?>
                    </select>



                    <label for="obs_facilitador">Comentarios del Observador:</label>
                    <textarea id="obs_facilitador" name="obs_facilitador"></textarea>
                </fieldset>

                <button type="submit" name="terminar_prueba">Terminar Prueba</button>
            </form>

        <?php else: ?>
            <p>Prueba completada.</p>
            <a href="formulario.php" onclick="<?php session_destroy(); ?>">Realizar nuevo test</a>
        <?php endif; ?>

    </main>
</body>

</html>