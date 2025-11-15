// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict";
class Noticias {
    #url;
    #apiKey;
    #busqueda;

    constructor() {
        this.#url = "https://api.thenewsapi.com/v1/news";
        this.#apiKey = "1A9rOEVIUr1d3yOulKU45mxxHzTfnHpCkEoO6TDs";
        this.#busqueda = "MotoGP";
    }

    async buscar() {
        const url = `${this.#url}/all?api_token=${this.#apiKey}&search=${encodeURIComponent(this.#busqueda)}&language=es&limit=3`;

        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();

            this.#procesarInformacion(datos);

        } catch (error) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "Error al obtener las noticias.";
            main.appendChild(mensaje);
        }
    }

    #procesarInformacion(datos) {
        const main = document.querySelector("main");
        if (!main) return;

        // Sección para las noticias
        const seccionNoticias = document.createElement("section");

        // Encabezado de la sección
        const encabezadoSeccion = document.createElement("h2");
        encabezadoSeccion.textContent = "Noticias relacionadas";
        seccionNoticias.appendChild(encabezadoSeccion);

        if (datos.data && datos.data.length > 0) {
            for (let i = 0; i < datos.data.length; i++) {
                const noticia = datos.data[i];

                // Titular
                const titular = document.createElement("h3");
                titular.textContent = noticia.title;
                seccionNoticias.appendChild(titular);

                // Entradilla
                const entradilla = document.createElement("p");
                entradilla.textContent = noticia.description || "Sin descripción";
                seccionNoticias.appendChild(entradilla);

                // Enlace
                const enlace = document.createElement("a");
                enlace.href = noticia.url;
                enlace.textContent = "Leer más";
                enlace.target = "_blank";
                seccionNoticias.appendChild(enlace);

                // Fuente
                const fuente = document.createElement("p");
                fuente.textContent = "Fuente: " + (noticia.source|| "Desconocida");
                seccionNoticias.appendChild(fuente);
            }
        } else {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No se encontraron noticias para tu búsqueda.";
            seccionNoticias.appendChild(mensaje);
        }

        main.appendChild(seccionNoticias);
    }
}
