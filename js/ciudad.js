
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
    #datosCarrera;
    #datosEntrenos
    #datosCarreraProcesados;
    #mediasEntrenos;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
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
        const title = document.createElement("h2");
        title.textContent = "Meteorología en " + this.#getNombre();
        const pais = document.createElement("p");
        pais.textContent = this.#getNombre() + " es una ciudad del país de " + this.#getPais() + ".";
        document.currentScript.parentElement.appendChild(title);
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


    // MÉTODOS PARA MOSTRAR LA METEOROLOGÍA

    // Meteo de la carrera
    getMeteorologiaCarrera() {
        const fechaCarrera = "2025-04-13";
        const sesiones = [19];
        this.#datosCarrera = { fecha: fechaCarrera, amanecer: "", atardecer: "", datosHorarios: [] };

        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${this.#coordenadas.latitud}&longitude=${this.#coordenadas.longitud}&start_date=${fechaCarrera}&end_date=${fechaCarrera}&hourly=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&timezone=Asia/Qatar`;

        $.ajax({
            dataType: "json",
            url: url,
            method: "GET",
            success: function (data) {
                // Procesar amanecer y atardecer
                this.#datosCarrera.amanecer = new Date(data.daily.sunrise[0]).toLocaleTimeString("es-QA", { hour: "2-digit", minute: "2-digit" });
                this.#datosCarrera.atardecer = new Date(data.daily.sunset[0]).toLocaleTimeString("es-QA", { hour: "2-digit", minute: "2-digit" });

                // Procesar datos horarios
                const times = data.hourly.time;
                const temp = data.hourly.temperature_2m;
                const sens = data.hourly.apparent_temperature;
                const lluvia = data.hourly.precipitation;
                const humedad = data.hourly.relative_humidity_2m;
                const vientoVel = data.hourly.windspeed_10m;
                const vientoDir = data.hourly.winddirection_10m;

                for (let i = 0; i < times.length; i++) {
                    const [date, time] = times[i].split("T");
                    const hour = parseInt(time.split(":")[0]);
                    if (date === fechaCarrera && sesiones.includes(hour)) {
                        this.#datosCarrera.datosHorarios.push({
                            hora: times[i],
                            temperatura_2m: temp[i],
                            sensacion_termica: sens[i],
                            lluvia: lluvia[i],
                            humedad_2m: humedad[i],
                            viento_velocidad_10m: vientoVel[i],
                            viento_direccion_10m: vientoDir[i]
                        });
                    }
                }
                this.#procesarJSONCarrera();
                this.#imprimirMeteorologiaCarrera();

            }.bind(this)
        });
    }



    // Procesar meteo de la carrera
    #procesarJSONCarrera() {
        const datos = this.#datosCarrera;

        // Creamos un JSON con la información extraída
        this.#datosCarreraProcesados = {
            fecha: datos.fecha,
            amanecer: datos.amanecer,
            atardecer: datos.atardecer,
            datosHorarios: []
        };

        // Extraer los datos horarios (franjas de carrera)
        for (let i = 0; i < datos.datosHorarios.length; i++) {

            const d = datos.datosHorarios[i];

            this.#datosCarreraProcesados.datosHorarios.push({
                hora: d.hora,
                temperatura_2m: d.temperatura_2m,
                sensacion_termica: d.sensacion_termica,
                lluvia: d.lluvia,
                humedad_2m: d.humedad_2m,
                viento_velocidad_10m: d.viento_velocidad_10m,
                viento_direccion_10m: d.viento_direccion_10m,
            });
        }
    }


    // Meteo de los entrenos
    getMeteorologiaEntrenos() {

        // Días de entrenamientos previos a la carrera
        const fechas = ["2025-04-10", "2025-04-11", "2025-04-12"];

        // Franjas horarias
        const sesionesEntrenos = {
            "2025-04-10": [14, 15, 19],
            "2025-04-11": [14, 19],
            "2025-04-12": [14, 15, 19]
        };

        // Objeto JSON resultado de la tarea
        this.#datosEntrenos = {
            periodo: { inicio: fechas[0], fin: fechas[2] },
            datosPorHora: []
        };

        let completadas = 0;

        for (let f = 0; f < fechas.length; f++) {

            const fecha = fechas[f];

            const url =
                `https://archive-api.open-meteo.com/v1/archive?latitude=` + this.#coordenadas.latitud +
                `&longitude=` + this.#coordenadas.longitud +
                `&start_date=${fecha}&end_date=${fecha}` +
                `&hourly=temperature_2m,precipitation,relative_humidity_2m,windspeed_10m` +
                `&timezone=Asia/Qatar`;

            $.ajax({
                dataType: "json",
                url: url,
                method: "GET",

                success: function (data) {

                    const times = data.hourly.time;
                    const temp = data.hourly.temperature_2m;
                    const lluvia = data.hourly.precipitation;
                    const humedad = data.hourly.relative_humidity_2m;
                    const vientoVel = data.hourly.windspeed_10m;

                    for (let i = 0; i < times.length; i++) {

                        const [date, time] = times[i].split("T");
                        const hour = parseInt(time.split(":")[0]);

                        // Solo guardamos si coincide con la franja de entrenamientos
                        if (sesionesEntrenos[date] && sesionesEntrenos[date].includes(hour)) {

                            this.#datosEntrenos.datosPorHora.push({
                                fecha: date,
                                hora: times[i],
                                temperatura_2m: temp[i],
                                lluvia: lluvia[i],
                                humedad_2m: humedad[i],
                                viento_velocidad_10m: vientoVel[i]
                            });
                        }
                    }

                    completadas++;

                    if (completadas === fechas.length) {
                        this.#procesarJSONEntrenos();
                        this.#imprimirMeteorologiaEntrenos();
                    }


                }.bind(this),

                error: function () {
                    const error = "<h3>No se pudo obtener la meteorología de los entrenos </h3>";
                    $("body").append(tituloPrincipal);
                }
            });
        }
    }

    // Procesar meteo de los entrenos
    #procesarJSONEntrenos() {

        this.#mediasEntrenos = {};

        const acumulados = {};

        for (let i = 0; i < this.#datosEntrenos.datosPorHora.length; i++) {

            const d = this.#datosEntrenos.datosPorHora[i];
            const fecha = d.fecha;

            // Si aún no existe la fecha, la creamos
            if (!acumulados[fecha]) {
                acumulados[fecha] = {
                    temp: 0,
                    lluvia: 0,
                    humedad: 0,
                    viento: 0,
                    contador: 0
                };
            }

            acumulados[fecha].temp += d.temperatura_2m;
            acumulados[fecha].lluvia += d.lluvia;
            acumulados[fecha].humedad += d.humedad_2m;
            acumulados[fecha].viento += d.viento_velocidad_10m;
            acumulados[fecha].contador++;
        }

        // Cálculo de medias por día
        for (const fecha in acumulados) {

            const datos = acumulados[fecha];

            this.#mediasEntrenos[fecha] = {
                temperatura_media: (datos.temp / datos.contador).toFixed(2),
                lluvia_media: (datos.lluvia / datos.contador).toFixed(2),
                humedad_media: (datos.humedad / datos.contador).toFixed(2),
                viento_media: (datos.viento / datos.contador).toFixed(2)
            };
        }
    }


    // Imprimir datos de la carrera
    #imprimirMeteorologiaCarrera() {

        const tituloPrincipal = "<h3>Meteorología el día de la carrera (13 de abril de 2025) </h3>";
        $("body").append(tituloPrincipal);

        const tituloSol = document.createElement("h4");
        tituloSol.textContent = "Salida y puesta del sol";
        $("body").append(tituloSol);

        const ulSol = document.createElement("ul");

        const liAmanecer = document.createElement("li");
        liAmanecer.textContent = "Amanecer: " + this.#datosCarrera.amanecer;
        ulSol.appendChild(liAmanecer);

        const liAtardecer = document.createElement("li");
        liAtardecer.textContent = "Atardecer: " + this.#datosCarrera.atardecer;
        ulSol.appendChild(liAtardecer);

        $("body").append(ulSol);

        const tituloHoras = "<h4>Datos por hora en las franjas de carrera</h4>";
        $("body").append(tituloHoras);

        for (let i = 0; i < this.#datosCarreraProcesados.datosHorarios.length; i++) {
            const dato = this.#datosCarreraProcesados.datosHorarios[i];

            const ulDatos = document.createElement("ul");

            const liHora = document.createElement("li");
            liHora.textContent = "Hora: " + dato.hora;
            ulDatos.appendChild(liHora);

            const liTemp = document.createElement("li");
            liTemp.textContent = "Temperatura: " + dato.temperatura_2m + " ºC";
            ulDatos.appendChild(liTemp);

            const liSens = document.createElement("li");
            liSens.textContent = "Sensación térmica: " + dato.sensacion_termica + " ºC";
            ulDatos.appendChild(liSens);

            const liLluvia = document.createElement("li");
            liLluvia.textContent = "Lluvia: " + dato.lluvia + " mm";
            ulDatos.appendChild(liLluvia);

            const liHumedad = document.createElement("li");
            liHumedad.textContent = "Humedad: " + dato.humedad_2m + " %";
            ulDatos.appendChild(liHumedad);

            const liVientoVel = document.createElement("li");
            liVientoVel.textContent = "Viento velocidad: " + dato.viento_velocidad_10m + " km/h";
            ulDatos.appendChild(liVientoVel);

            const liVientoDir = document.createElement("li");
            liVientoDir.textContent = "Viento dirección: " + dato.viento_direccion_10m + " º";
            ulDatos.appendChild(liVientoDir);

            const liDesc = document.createElement("li");
            liDesc.textContent = "Descripción: " + dato.tipo;
            ulDatos.appendChild(liDesc);


            $("body").append(ulDatos);
        }

    }



    // Imprimir datos del entreno
    #imprimirMeteorologiaEntrenos() {

        const tituloPrincipal = "<h3>Meteorología durante los entrenos</h3>";
        $("body").append(tituloPrincipal);

        for (const fecha in this.#mediasEntrenos) {
            const tituloDia = document.createElement("h4");
            tituloDia.textContent = "Día " + fecha;
            $("body").append(tituloDia);

            const ul = document.createElement("ul");

            const liTemp = document.createElement("li");
            liTemp.textContent = "Temperatura media: " + this.#mediasEntrenos[fecha].temperatura_media + " ºC";
            ul.appendChild(liTemp);

            const liLluvia = document.createElement("li");
            liLluvia.textContent = "Lluvia media: " + this.#mediasEntrenos[fecha].lluvia_media + " mm";
            ul.appendChild(liLluvia);

            const liHumedad = document.createElement("li");
            liHumedad.textContent = "Humedad media: " + this.#mediasEntrenos[fecha].humedad_media + " %";
            ul.appendChild(liHumedad);

            const liViento = document.createElement("li");
            liViento.textContent = "Viento medio: " + this.#mediasEntrenos[fecha].viento_media + " km/h";
            ul.appendChild(liViento);

            $("body").append(ul);

        }
    }

}