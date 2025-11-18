
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict"
class Circuito {

    #contenidoArchivo;

    constructor() {

        this.#contenidoArchivo = "";
        this.comprobarApiFile();
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            //El navegador soporta el API File
            this.leerArchivoHTML();

        }
        else {
            const error = document.createElement("p");
            error.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.body.appendChild(error);
        }
    }

    leerArchivoHTML(archivo) {
        // Solo archivos HTML
        var tipoHTML = /text\/html/;
        if (archivo.type.match(tipoHTML)) {

            var lector = new FileReader();

            lector.onload = function() {
                this.contenidoArchivo = lector.result;
                console.log("Archivo HTML cargado en memoria. Listo para procesar.");
                // console.log(this.contenidoArchivo); // para ver el contenido
            }.bind(this);

            lector.readAsText(archivo);
        } else {
            console.error("Error: ¡¡¡ Archivo no válido, debe ser HTML !!!");
        }
    }
}