
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
        this.#apikey = "bd03caa7f315e23ca909aadf2c8ea59e"; 
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
        const fechas = ["2025-04-11", "2025-04-12", "2025-04-13"];
        const sesionesMotoGP = {
            "2025-04-11": [14,19],
            "2025-04-12": [14,15,19],
            "2025-04-13": [19]
        };
    
        this.#datosCarrera = {
            circuito: "Lusail International Circuit",
            ciudad: this.#nombre,
            pais: this.#pais,
            periodo: { inicio: fechas[0], fin: fechas[2] },
            datosPorHora: [],
            amanecer: {},
            atardecer: {}
        };
    
        let completadas = 0;
    
        fechas.forEach(function(fecha) {
            const url =
                `https://archive-api.open-meteo.com/v1/archive?latitude=` + this.#coordenadas.latitud + `&longitude=` + this.#coordenadas.longitud +
                `&start_date=${fecha}&end_date=${fecha}` +
                `&hourly=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,windspeed_10m,winddirection_10m` +
                `&daily=sunrise,sunset` +
                `&timezone=Asia/Qatar`;
    
            $.getJSON(url, function(data) {
                // Guardamos amanecer y atardecer formateados a HH:MM
                const amanecerUTC = data.daily.sunrise[0];
                const atardecerUTC = data.daily.sunset[0];
    
                this.#datosCarrera.amanecer[fecha] = new Date(amanecerUTC).toLocaleTimeString("es-QA", { hour: "2-digit", minute: "2-digit" });
                this.#datosCarrera.atardecer[fecha] = new Date(atardecerUTC).toLocaleTimeString("es-QA", { hour: "2-digit", minute: "2-digit" });
    
                // Guardamos datos por hora de las franjas de sesiones
                const times = data.hourly.time;
                const temps = data.hourly.temperature_2m;
                const sensacion = data.hourly.apparent_temperature;
                const lluvia = data.hourly.precipitation;
                const humedad = data.hourly.relative_humidity_2m;
                const vientoVel = data.hourly.windspeed_10m;
                const vientoDir = data.hourly.winddirection_10m;
    
                for (let i = 0; i < times.length; i++) {
                    const [date, time] = times[i].split("T");
                    const hour = parseInt(time.split(":")[0]);
    
                    if (sesionesMotoGP[date] && sesionesMotoGP[date].includes(hour)) {
                        this.#datosCarrera.datosPorHora.push({
                            hora: times[i],
                            temperatura_2m: temps[i],
                            sensacion_termica: sensacion[i],
                            lluvia: lluvia[i],
                            humedad_2m: humedad[i],
                            viento_velocidad_10m: vientoVel[i],
                            viento_direccion_10m: vientoDir[i],
                            descripcion: "Datos archivados"
                        });
                    }
                }
    
                completadas++;
                if (completadas === fechas.length) {
                    this.procesarJSONCarrera();
                }
            }.bind(this));
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
    
        const datos = this.#datosCarrera;
    
        const seccion = document.createElement("section");
    
        // Título
        const titulo = document.createElement("h2");
        titulo.textContent = "Meteorología - " + datos.circuito;
        seccion.appendChild(titulo);
    
        // Información básica
        const infoBasica = document.createElement("p");
        infoBasica.textContent = `${datos.ciudad}, ${datos.pais} (${datos.periodo.inicio} a ${datos.periodo.fin})`;
        seccion.appendChild(infoBasica);
    
        // Amanecer y atardecer por día
        const ulSolar = document.createElement("ul");
        for (const fecha in datos.amanecer) {
            const li = document.createElement("li");
            li.textContent = `${fecha}: Amanecer ${datos.amanecer[fecha]}, Atardecer ${datos.atardecer[fecha]}`;
            ulSolar.appendChild(li);
        }
        seccion.appendChild(ulSolar);
    
        // Subtítulo de predicción por hora
        const subtitulo = document.createElement("h3");
        subtitulo.textContent = "Predicción por hora de las sesiones MotoGP";
        seccion.appendChild(subtitulo);
    
        // Lista de datos horarios
        const listaHoras = document.createElement("ul");
        datos.datosPorHora.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML =
                `${item.hora}: ${item.descripcion}, ` +
                `Temp: ${item.temperatura_2m}°C (sensación ${item.sensacion_termica}°C), ` +
                `Humedad: ${item.humedad_2m}%, ` +
                `Viento: ${item.viento_velocidad_10m} m/s (${item.viento_direccion_10m}°), ` +
                `Lluvia: ${item.lluvia} mm`;
            listaHoras.appendChild(li);
        });
        seccion.appendChild(listaHoras);
    
        document.body.appendChild(seccion);
    }
    

}