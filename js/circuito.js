
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
            console.log("El navegador soporta el API File.");

        }
        else {
            const error = document.createElement("p");
            error.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.body.appendChild(error);
        }
    }


    leerArchivoHTML(files) {
        const archivo = files[0];

        // Solo archivos HTML
        const tipoHTML = /text\/html/;

        if (archivo.type.match(tipoHTML)) {
            const lector = new FileReader();

            lector.onload = function () {
                // Guardamos el contenido en memoria
                this.#contenidoArchivo = lector.result;
                console.log("Archivo HTML cargado en memoria.");
                this.volcarInformacion(); 
            }.bind(this);

            lector.readAsText(archivo);
        } else {
            console.error("Error: ¡Archivo no válido, debe ser HTML!");
        }
    }

    volcarInformacion() {
    if (!this.#contenidoArchivo) {
        console.error("No hay contenido cargado en memoria.");
        return;
    }

    // 1. Parsear el HTML cargado en memoria
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.#contenidoArchivo, "text/html");

    // 2. Extraer el título del circuito (<h1>)
    const h1 = doc.getElementsByTagName("h1")[0];
    const titulo = h1 ? h1.textContent : "Circuito sin título";

    // 3. Crear un <h2> en circuito.html con el título
    const main = document.querySelector("main"); // donde volcamos la info
    const h2Titulo = document.createElement("h2");
    h2Titulo.textContent = titulo;
    main.appendChild(h2Titulo);

    // 4. Extraer y volcar los datos del circuito (primer <section>)
    const secciones = doc.getElementsByTagName("section");
    if (secciones.length > 0) {
        const datosCircuito = secciones[0]; // primer section: "Datos del circuito"
        const ul = datosCircuito.getElementsByTagName("ul")[0];
        if (ul) {
            const ulCopia = document.createElement("ul");
            // recorrer todos los <li> y copiarlos
            Array.from(ul.getElementsByTagName("li")).forEach(li => {
                const liNuevo = document.createElement("li");
                liNuevo.textContent = li.textContent;
                ulCopia.appendChild(liNuevo);
            });
            main.appendChild(ulCopia);
        }
    }

    // 5. Podrías hacer lo mismo para otras secciones: referencias, galería, videos, etc.
    console.log("Información del circuito volcada al DOM.");
}


}