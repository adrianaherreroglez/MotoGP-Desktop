
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

        // Copiar h1 como h3
        const h1 = doc.querySelector("h1");
        if (h1) {
            const h3 = document.createElement("h3");
            h3.textContent = h1.textContent;
            document.body.appendChild(h3);
        }

        // Recorrer secciones
        const secciones = doc.querySelectorAll("main > section");
        for (let i = 0; i < secciones.length; i++) {
            const seccion = secciones[i];
            const seccionCopia = document.createElement("section");

            // Copiar h2 como h4
            const h2 = seccion.querySelector("h2");
            if (h2) {
                const h4 = document.createElement("h4");
                h4.textContent = h2.textContent;
                seccionCopia.appendChild(h4);
            }

            // Copiar listas <ul>
            const uls = seccion.getElementsByTagName("ul");
            for (let j = 0; j < uls.length; j++) {
                const ul = uls[j];
                const ulCopia = document.createElement("ul");
                const items = ul.getElementsByTagName("li");
                for (let k = 0; k < items.length; k++) {
                    const liNuevo = document.createElement("li");
                    liNuevo.textContent = items[k].textContent;
                    ulCopia.appendChild(liNuevo);
                }
                seccionCopia.appendChild(ulCopia);
            }

            // Copiar listas <ol>
            const ols = seccion.getElementsByTagName("ol");
            for (let j = 0; j < ols.length; j++) {
                const ol = ols[j];
                const olCopia = document.createElement("ol");
                const items = ol.getElementsByTagName("li");
                for (let k = 0; k < items.length; k++) {
                    const liNuevo = document.createElement("li");
                    liNuevo.textContent = items[k].textContent;
                    olCopia.appendChild(liNuevo);
                }
                seccionCopia.appendChild(olCopia);
            }

            // Copiar referencias (<p><a>)
            const paras = seccion.getElementsByTagName("p");
            for (let j = 0; j < paras.length; j++) {
                const p = paras[j];
                const a = p.querySelector("a");
                if (a) {
                    const pNuevo = document.createElement("p");
                    const aNuevo = document.createElement("a");
                    aNuevo.href = a.href;
                    aNuevo.target = "_blank";
                    aNuevo.textContent = a.textContent;
                    pNuevo.appendChild(aNuevo);
                    seccionCopia.appendChild(pNuevo);
                }
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

            // Copiar vencedor (Piloto y Tiempo)
            if (h2 && h2.textContent.toLowerCase().includes("vencedor")) {
                const ps = seccion.getElementsByTagName("p");
                for (let j = 0; j < ps.length; j++) {
                    const pNuevo = document.createElement("p");
                    pNuevo.textContent = ps[j].textContent;
                    seccionCopia.appendChild(pNuevo);
                }
            }

            document.body.appendChild(seccionCopia);
        }
    }


}

"use strict"
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
        // Crear contenedor <section> al final del body
        var contenedor = document.createElement("section");

        // Crear título
        var tituloSVG = document.createElement("h3");
        tituloSVG.textContent = "Altimetría del circuito";
        contenedor.appendChild(tituloSVG);

        // Parsear SVG como XML
        var parser = new DOMParser();
        var docSVG = parser.parseFromString(this.#contenidoArchivoSVG, "image/svg+xml");
        var svgElement = docSVG.documentElement;

        // Insertar SVG en el contenedor
        contenedor.appendChild(svgElement);

        // Insertar contenedor al final del body
        document.body.appendChild(contenedor);
    }
}

"use strict"
class CargadorKML {

    #contenidoArchivoKML;
    #documentoKML;

    constructor() {
        this.#contenidoArchivoKML = "";
        this.#documentoKML = "";

        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yODc1NDMiLCJhIjoiY21icjlsZjNiMDZkazJscXVlOWNla28xbCJ9.TeUE3PFpwcAravLU5lnbgA';

        const divMapa = document.createElement('div');
        document.body.appendChild(divMapa);

        // Inicializar el mapa usando el div creado
        this.map = new mapboxgl.Map({
            container: divMapa,  // <-- aquí usamos la referencia, no un id
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [51.44953333968715, 25.48928989802003],
            zoom: 14
        });

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
