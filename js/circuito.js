
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict"
class Circuito {

    #contenidoArchivo;

    constructor() {

        this.#contenidoArchivo = "";
        this.#comprobarApiFile();
    }

    #comprobarApiFile() {
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
                this.#contenidoArchivo = lector.result;
                this.#volcarInformacion();
            }.bind(this);

            lector.readAsText(archivo);
        }
    }

    #volcarInformacion() {
        if (!this.#contenidoArchivo) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(this.#contenidoArchivo, "text/html");

        // Seleccionamos el primer section dentro de body
        const main = document.querySelector("body > section");

        // Crear contenedor
        const contenedorHTML = document.createElement("section");
        contenedorHTML.classList.add("contenedor-html");

        // Copiar <h1>
        const h1 = doc.getElementsByTagName("h1")[0];
        if (h1) {
            const h3Titulo = document.createElement("h3");
            h3Titulo.textContent = h1.textContent;
            contenedorHTML.appendChild(h3Titulo);
        }

        // Recorrer secciones y copiar contenido
        const secciones = doc.getElementsByTagName("section");
        for (let i = 0; i < secciones.length; i++) {
            const seccion = secciones[i];
            const seccionCopia = document.createElement("section");
            seccionCopia.classList.add("seccion-copia");

            // Copiar <h2> → <h4>
            const h2 = seccion.getElementsByTagName("h2")[0];
            if (h2) {
                const h4Nuevo = document.createElement("h4");
                h4Nuevo.textContent = h2.textContent;
                seccionCopia.appendChild(h4Nuevo);
            }

            // Copiar listas <ul>
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

            // Copiar listas <ol>
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

            // Copiar imágenes
            const imgs = seccion.getElementsByTagName("img");
            for (let j = 0; j < imgs.length; j++) {
                const imgNuevo = document.createElement("img");
                const nombreArchivo = imgs[j].src.split("/").pop();
                imgNuevo.src = "multimedia/" + nombreArchivo;
                imgNuevo.alt = imgs[j].alt;
                seccionCopia.appendChild(imgNuevo);
            }

            // Copiar videos
            const videos = seccion.getElementsByTagName("video");
            for (let j = 0; j < videos.length; j++) {
                const videoNuevo = document.createElement("video");
                videoNuevo.controls = true;

                const source = videos[j].getElementsByTagName("source")[0];
                if (source) {
                    const sourceNuevo = document.createElement("source");
                    const nombreArchivo = source.src.split("/").pop();
                    sourceNuevo.src = "multimedia/" + nombreArchivo;
                    sourceNuevo.type = source.type;
                    videoNuevo.appendChild(sourceNuevo);
                }

                seccionCopia.appendChild(videoNuevo);
            }

            // Copiar párrafos
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
                this.#contenidoArchivoSVG = lector.result;
                this.#insertarSVG();
            }.bind(this);

            lector.readAsText(archivo);
        }
    }


    #insertarSVG() {
        var contenedor = document.querySelector("body > section");

        // Si no existe, crear uno
        if (!contenedor) {
            contenedor = document.createElement("section");
            document.body.appendChild(contenedor);
        }

        // Parsear SVG como XML con DOMParser
        var parser = new DOMParser();
        var docSVG = parser.parseFromString(this.#contenidoArchivoSVG, "image/svg+xml");
        var svgElement = docSVG.documentElement;

        //Crear título
        var tituloSVG = document.createElement("h3");
        tituloSVG.textContent = "Altimetría del circuito";
        contenedor.appendChild(tituloSVG);
        // Insertar SVG en el contenedor
        contenedor.appendChild(svgElement);
    }

}

class CargadorKML {

    #contenidoArchivoKML;
    #documentoKML;

    constructor() {
        this.#contenidoArchivoKML = "";
        this.#documentoKML = "";

        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yODc1NDMiLCJhIjoiY21icjlsZjNiMDZkazJscXVlOWNla28xbCJ9.TeUE3PFpwcAravLU5lnbgA';

        this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [51.44953333968715, 25.48928989802003],
            zoom: 14
        });

        var divMapa = document.querySelector('body > div');

    }

    leerArchivoKML(files) {
        const archivo = files[0];

        if (!archivo || !archivo.name.endsWith(".kml")) {
            return;
        }

        const lector = new FileReader();

        lector.onload = function () {

            this.#contenidoArchivoKML = lector.result;

            const parser = new DOMParser();
            this.#documentoKML = parser.parseFromString(
                this.#contenidoArchivoKML,
                "application/xml"
            );

            this.#insertarCapaKML();

        }.bind(this);

        lector.readAsText(archivo);
    }

    #insertarCapaKML() {

        const coordinatesText = this.#documentoKML.querySelector("LineString > coordinates");

        if (!coordinatesText) {
            return;
        }

        var coordsArray = [];
        // Separar las coordenadas por espacios
        var coordStrings = coordinatesText.textContent.trim().split(/\s+/);

        for (var i = 0; i < coordStrings.length; i++) {
            var parts = coordStrings[i].split(',');
            var lng = parseFloat(parts[0]);
            var lat = parseFloat(parts[1]);
            coordsArray.push([lng, lat]);
        }

        const geojson = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coordsArray
            }
        };

        if (!this.map.getSource("circuitoKML")) {
            this.map.addSource("circuitoKML", {
                "type": "geojson",
                "data": geojson
            });
        } else {
            this.map.getSource("circuitoKML").setData(geojson);
        }

        if (!this.map.getLayer("rutaKML")) {
            this.map.addLayer({
                "id": "rutaKML",
                "type": "line",
                "source": "circuitoKML",
                "layout": { "line-join": "round", "line-cap": "round" },
                "paint": { "line-width": 4, "line-color": "#FF0000" }
            });
        }

        // Ajustar vista
        var bounds = new mapboxgl.LngLatBounds();
        for (var i = 0; i < coordsArray.length; i++) {
            bounds.extend(coordsArray[i]);
        }
        this.map.fitBounds(bounds, { padding: 50 });

        // Marcador en el inicio
        new mapboxgl.Marker()
            .setLngLat(coordsArray[0])
            .addTo(this.map);
    }
}
