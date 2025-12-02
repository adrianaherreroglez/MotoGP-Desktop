
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
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            //El navegador no soporta el API File
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
    
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.#contenidoArchivo, "text/html");
    
        const main = document.querySelector("main section");
    
        const contenedorHTML = document.createElement("section");
        contenedorHTML.classList.add("contenedor-html");
    
        // Copiar <h1>
        const h1 = doc.getElementsByTagName("h1")[0];
        if (h1) {
            const h2Titulo = document.createElement("h2");
            h2Titulo.textContent = h1.textContent;
            contenedorHTML.appendChild(h2Titulo);
        }
    
        // Recorrer todas las secciones
        const secciones = doc.getElementsByTagName("section");
        for (let i = 0; i < secciones.length; i++) {
            const seccion = secciones[i];
            const seccionCopia = document.createElement("section");
            seccionCopia.classList.add("seccion-copia");
    
            // Copiar <h2>
            const h2 = seccion.getElementsByTagName("h2")[0];
            if (h2) {
                const h2Nuevo = document.createElement("h2");
                h2Nuevo.textContent = h2.textContent;
                seccionCopia.appendChild(h2Nuevo);
            }
    
            // Copiar listas <ul> y <ol>
            const ul = seccion.getElementsByTagName("ul")[0];
            if (ul) {
                const ulCopia = document.createElement("ul");
                const items = ul.getElementsByTagName("li");
                for (let j = 0; j < items.length; j++) {
                    const liNuevo = document.createElement("li");
    
                    const a = items[j].getElementsByTagName("a")[0];
                    if (a) {
                        const aNuevo = document.createElement("a");
                        aNuevo.href = a.href;
                        aNuevo.target = "_blank";
                        aNuevo.textContent = a.textContent;
                        liNuevo.appendChild(aNuevo);
                    } else {
                        liNuevo.textContent = items[j].textContent;
                    }
                    ulCopia.appendChild(liNuevo);
                }
                seccionCopia.appendChild(ulCopia);
            }
    
            const ol = seccion.getElementsByTagName("ol")[0];
            if (ol) {
                const olCopia = document.createElement("ol");
                const items = ol.getElementsByTagName("li");
                for (let j = 0; j < items.length; j++) {
                    const liNuevo = document.createElement("li");
                    liNuevo.textContent = items[j].textContent;
                    olCopia.appendChild(liNuevo);
                }
                seccionCopia.appendChild(olCopia);
            }
    
            // Copiar imágenes <img> con ruta corregida
            const imgs = seccion.getElementsByTagName("img");
            for (let j = 0; j < imgs.length; j++) {
                const imgNuevo = document.createElement("img");
                const nombreArchivo = imgs[j].src.split("/").pop(); // solo el nombre del archivo
                imgNuevo.src = "multimedia/" + nombreArchivo;       // ruta relativa desde index.html
                imgNuevo.alt = imgs[j].alt;
                seccionCopia.appendChild(imgNuevo);
            }
    
            // Copiar videos <video> con ruta corregida
            const videos = seccion.getElementsByTagName("video");
            for (let j = 0; j < videos.length; j++) {
                const videoNuevo = document.createElement("video");
                videoNuevo.controls = true;
    
                const source = videos[j].getElementsByTagName("source")[0];
                if (source) {
                    const sourceNuevo = document.createElement("source");
                    const nombreArchivo = source.src.split("/").pop(); // solo el nombre del archivo
                    sourceNuevo.src = "multimedia/" + nombreArchivo;   // ruta relativa desde index.html
                    sourceNuevo.type = source.type;
                    videoNuevo.appendChild(sourceNuevo);
                }
    
                seccionCopia.appendChild(videoNuevo);
            }
    
            // Copiar párrafos <p>
            const ps = seccion.getElementsByTagName("p");
            for (let j = 0; j < ps.length; j++) {
                const pNuevo = document.createElement("p");
                pNuevo.textContent = ps[j].textContent;
                seccionCopia.appendChild(pNuevo);
            }
    
            contenedorHTML.appendChild(seccionCopia);
        }
    
        main.appendChild(contenedorHTML);
    }
    
}    


class CargadorSVG {
    #contenidoArchivoSVG;

    constructor() {
        this.#contenidoArchivoSVG = "";
    }

    leerArchivoSVG(files) {
        const archivo = files[0];
    
        // Solo archivos SVG
        const tipoSVG = /image\/svg\+xml/;
    
        if (archivo.type.match(tipoSVG)) {
            const lector = new FileReader();
    
            lector.onload = function () {
                // Guardamos el contenido en memoria
                this.#contenidoArchivoSVG = lector.result;
                console.log("Archivo SVG cargado en memoria.");
                this.insertarSVG();
            }.bind(this);
    
            lector.readAsText(archivo);
        } else {
            console.error("Error: ¡Archivo no válido, debe ser SVG!");
        }
    }
    

    insertarSVG() {
        const contenedor = document.querySelector("main section");

        if (!contenedor) {
            console.error("No se encontró el contenedor para mostrar el SVG.");
            return;
        }

      

        // Parsear SVG como XML
        const parser = new DOMParser();
        const docSVG = parser.parseFromString(this.#contenidoArchivoSVG, "image/svg+xml");
        const svgElement = docSVG.documentElement;

        // Insertar SVG en el contenedor
        contenedor.appendChild(svgElement);
    }
}

class CargadorKML{

    #contenidoArchivoKML;
    #documentoKML;

    constructor() {

        this.#contenidoArchivoKML = "";
        this.#documentoKML = "";
    }

    leerArchivoKML(files) {
        const archivo = files[0];
    
            // Tipo MIME estándar de KML
            const tipoKML = "application/vnd.google-earth.kml+xml";
    
            if (archivo.type === tipoKML || archivo.name.endsWith(".kml")) {
    
                const lector = new FileReader();
    
                lector.onload = function() {
    
                    this.#contenidoArchivoKML = lector.result;
                    console.log("Archivo KML cargado en memoria.");
    
                   
                    const parser = new DOMParser();
                    this.#documentoKML = parser.parseFromString(
                        this.#contenidoArchivoKML,
                        "application/xml"
                    );
    
                    console.log("KML parseado correctamente:");
                    console.log(this.#documentoKML);
    
                    this.insertarCapaKML();
                }.bind(this);
    
                lector.readAsText(archivo);
    
            } else {
                console.error("Error: ¡Archivo no válido, debe ser KML!");
            }
        
    }

    insertarCapaKML(){
        const contenedor = document.querySelector("div");

        if (!contenedor) {
            console.error("No se encontró el contenedor para mostrar el KML.");
            return;
        }

      

        // Parsear KML como XML
        const parser = new DOMParser();
        const docKML = parser.parseFromString(this.#contenidoArchivoKML, "application/xml");
        const kmlElement = docKML.documentElement;

        // Insertar KML en el contenedor
        contenedor.appendChild(kmlElement);
    
    }

}