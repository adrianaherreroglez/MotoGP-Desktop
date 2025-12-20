-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS uo287543_db;
USE uo287543_db;

-- TABLAS AUXILIARES (3NF)

-- Tabla de profesiones
CREATE TABLE IF NOT EXISTS profesiones (
    profesion_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de géneros
CREATE TABLE IF NOT EXISTS generos (
    genero_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de niveles de pericia informática
CREATE TABLE IF NOT EXISTS pericias (
    pericia_id INT AUTO_INCREMENT PRIMARY KEY,
    nivel VARCHAR(50) NOT NULL
);

-- Tabla de dispositivos
CREATE TABLE IF NOT EXISTS dispositivos (
    dispositivo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- TABLA PRINCIPAL: USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    codigo_usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    profesion_id INT NOT NULL,
    edad INT NOT NULL,
    genero_id INT NOT NULL,
    pericia_id INT NOT NULL,
    FOREIGN KEY (profesion_id) REFERENCES profesiones(profesion_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(genero_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (pericia_id) REFERENCES pericias(pericia_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- TABLA DE RESULTADOS DEL TEST
CREATE TABLE IF NOT EXISTS resultados_test (
    id_test INT AUTO_INCREMENT PRIMARY KEY,
    codigo_usuario_id INT NOT NULL,
    dispositivo_id INT NOT NULL,
    tiempo TIME NOT NULL,
    completado BOOLEAN NOT NULL,
    comentarios TEXT,
    propuestas TEXT,
    valoracion INT CHECK (valoracion BETWEEN 0 AND 10),
    FOREIGN KEY (codigo_usuario_id) REFERENCES usuarios(codigo_usuario_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(dispositivo_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- TABLA DE OBSERVACIONES DEL FACILITADOR
CREATE TABLE IF NOT EXISTS observaciones_facilitador (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_test INT NOT NULL,
    comentario TEXT NOT NULL,
    FOREIGN KEY (id_test) REFERENCES resultados_test(id_test) ON DELETE CASCADE ON UPDATE CASCADE
);


-- INSERTAR DATOS INICIALES
INSERT IGNORE INTO profesiones (nombre) VALUES 
('Estudiante'), ('Estudiante de Ingeniería Informática'), ('Jubilado/a'), ('Docente'), ('Administrativo/a'), ('Médico/a'), ('Abogado/a'), ('Otro');

INSERT IGNORE INTO generos (nombre) VALUES 
('Masculino'), ('Femenino'), ('No binario'), ('Prefiero no decirlo');

INSERT IGNORE INTO pericias (nivel) VALUES 
('1'), ('2'), ('3'), ('4'), ('5'), ('6'), ('7'), ('8'), ('9'), ('10') ;

INSERT IGNORE INTO dispositivos (nombre) VALUES 
('Ordenador'), ('Teléfono'), ('Tablet');