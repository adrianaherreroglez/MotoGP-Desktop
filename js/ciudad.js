
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict";
class Ciudad {

    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #coordenadas;
    #unidades;
    #idioma;
    #apikey;
    #datosCarrera;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#unidades = "&units=metric";
        this.#idioma = "&lang=es";
        this.#apikey = "bd03caa7f315e23ca909aadf2c8ea59e"; // tu API key
    }

    rellenarDatos(poblacion, latitud, longitud) {
        this.#poblacion = poblacion;
        this.#coordenadas = { latitud: latitud, longitud: longitud };
    }

    #getNombre() {
        return this.#nombre;
    }

    #getPais() {
        return this.#pais;
    }

    showIntroduction() {
        const pais = document.createElement("p");
        pais.textContent = this.#getNombre() + " es una ciudad del país de " + this.#getPais() + ".";
        document.currentScript.parentElement.appendChild(pais);
    }

    showInfo() {
        const seccionLista = document.createElement("section");
        const tituloLista = document.createElement("h3");
        tituloLista.textContent = "Información sobre " + this.#getNombre();
        seccionLista.appendChild(tituloLista);

        const lista = document.createElement("ul");
        const item1 = document.createElement("li");
        item1.textContent = "Gentilicio: " + this.#gentilicio;
        lista.appendChild(item1);

        const item2 = document.createElement("li");
        item2.textContent = "Población: " + this.#poblacion + " habitantes";
        lista.appendChild(item2);

        seccionLista.appendChild(lista);
        document.currentScript.parentElement.appendChild(seccionLista);
    }

    getCoordenadas() {
        const seccion = document.createElement("section");
        const titulo = document.createElement("h3");
        titulo.textContent = "Coordenadas de " + this.#getNombre();
        seccion.appendChild(titulo);

        const latitud = document.createElement("p");
        latitud.textContent = "Latitud: " + this.#coordenadas.latitud;
        seccion.appendChild(latitud);

        const longitud = document.createElement("p");
        longitud.textContent = "Longitud: " + this.#coordenadas.longitud;
        seccion.appendChild(longitud);

        document.currentScript.parentElement.appendChild(seccion);
    }

    getMeteorologiaCarrera() {
        var fechas = ["2025-04-11", "2025-04-12", "2025-04-13"];
        var lat = this.#coordenadas.latitud;
        var lon = this.#coordenadas.longitud;
        this.#datosCarrera = {
            circuito: "Lusail International Circuit",
            ciudad: this.#nombre,
            pais: this.#pais,
            periodo: { inicio: fechas[0], fin: fechas[2] },
            datosPorHora: []
        };

        var llamadasCompletadas = 0;

        fechas.forEach(function(fecha) {
            var timestamp = Math.floor(new Date(fecha + "T00:00:00Z").getTime() / 1000);
            var url = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" +
                      lat + "&lon=" + lon + "&dt=" + timestamp +
                      "&units=metric&lang=es&appid=" + this.#apikey;

            $.ajax({
                dataType: "json",
                url: url,
                method: "GET",
                success: function(datos) {
                    for (var i = 0; i < datos.hourly.length; i++) {
                        var h = datos.hourly[i];
                        this.#datosCarrera.datosPorHora.push({
                            hora: new Date(h.dt * 1000).toISOString().replace("T", " ").substr(0, 19),
                            temperatura_2m: h.temp,
                            sensacion_termica: h.feels_like,
                            humedad_2m: h.humidity,
                            lluvia: h.rain ? (h.rain["1h"] || 0) : 0,
                            viento_velocidad_10m: h.wind_speed,
                            viento_direccion_10m: h.wind_deg,
                            descripcion: h.weather[0].description
                        });
                    }
                    llamadasCompletadas++;
                    if (llamadasCompletadas === fechas.length) {
                        this.procesarJSONCarrera();
                    }
                }.bind(this),
                error: function() {
                    llamadasCompletadas++;
                    if (llamadasCompletadas === fechas.length) {
                        this.procesarJSONCarrera();
                    }
                }.bind(this)
            });
        }.bind(this));
    }

    procesarJSONCarrera() {
        if (!this.#datosCarrera || this.#datosCarrera.datosPorHora.length === 0) {
            const error = document.createElement("p");
            error.textContent = "No hay datos meteorológicos disponibles para el circuito.";
            const contenedorError = document.createElement("section");
            contenedorError.appendChild(error);
            document.body.appendChild(contenedorError);
            return;
        }

        var datos = this.#datosCarrera;

        const seccion = document.createElement("section");

        const titulo = document.createElement("h2");
        titulo.textContent = "Meteorología - " + datos.circuito;
        seccion.appendChild(titulo);

        const infoBasica = document.createElement("p");
        infoBasica.textContent = datos.ciudad + ", " + datos.pais +
                                " (" + datos.periodo.inicio + " a " + datos.periodo.fin + ")";
        seccion.appendChild(infoBasica);

        const ulGeneral = document.createElement("ul");
        const amanecer = document.createElement("li");
        amanecer.textContent = "Amanecer: --";
        ulGeneral.appendChild(amanecer);
        const atardecer = document.createElement("li");
        atardecer.textContent = "Atardecer: --";
        ulGeneral.appendChild(atardecer);
        seccion.appendChild(ulGeneral);

        const subtitulo = document.createElement("h3");
        subtitulo.textContent = "Predicción por hora";
        seccion.appendChild(subtitulo);

        const listaHoras = document.createElement("ul");
        for (var i = 0; i < datos.datosPorHora.length; i++) {
            var item = datos.datosPorHora[i];
            const li = document.createElement("li");
            li.innerHTML =
                "<strong>" + item.hora + ":</strong> " +
                item.descripcion + ", " +
                item.temperatura_2m + "°C (sensación " + item.sensacion_termica + "°C), " +
                "Humedad " + item.humedad_2m + "%, " +
                "Viento " + item.viento_velocidad_10m + " m/s (" + item.viento_direccion_10m + "°), " +
                "Lluvia " + item.lluvia + " mm";
            listaHoras.appendChild(li);
        }
        seccion.appendChild(listaHoras);

        document.body.appendChild(seccion);
    }
}
