CREATE DATABASE IF NOT EXISTS usabilidad;
USE usabilidad;

--  TABLAS AUXILIARES (3NF)

-- Tabla de profesiones
CREATE TABLE profesiones (
    profesion_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de géneros
CREATE TABLE generos (
    genero_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de niveles de pericia informática
CREATE TABLE pericias (
    pericia_id INT AUTO_INCREMENT PRIMARY KEY,
    nivel VARCHAR(50) NOT NULL
);

-- Tabla de dispositivos
CREATE TABLE dispositivos (
    dispositivo_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);


--  TABLA PRINCIPAL: USUARIOS
CREATE TABLE usuarios (
    codigo_usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    profesion_id INT NOT NULL,
    edad INT NOT NULL,
    genero_id INT NOT NULL,
    pericia_id INT NOT NULL,
    FOREIGN KEY (profesion_id) REFERENCES profesiones(profesion_id),
    FOREIGN KEY (genero_id) REFERENCES generos(genero_id),
    FOREIGN KEY (pericia_id) REFERENCES pericias(pericia_id)
);


--  TABLA DE RESULTADOS DEL TEST
CREATE TABLE resultados_test (
    id_test INT AUTO_INCREMENT PRIMARY KEY,
    codigo_usuario_id INT NOT NULL,
    dispositivo_id INT NOT NULL,
    tiempo INT NOT NULL,
    completado BOOLEAN NOT NULL,
    comentarios TEXT,
    propuestas TEXT,
    valoracion INT CHECK (valoracion BETWEEN 0 AND 10),
    FOREIGN KEY (codigo_usuario_id) REFERENCES usuarios(codigo_usuario_id),
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(dispositivo_id)
);


--  TABLA DE OBSERVACIONES DEL FACILITADOR
CREATE TABLE observaciones_facilitador (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_test INT NOT NULL,
    comentario TEXT NOT NULL,
    FOREIGN KEY (id_test) REFERENCES resultados_test(id_test)
);
