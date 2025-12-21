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
            const seccion = document.createElement("section");
            document.body.appendChild(seccion);

            const mensaje = document.createElement("p");
            mensaje.textContent = "Error al obtener las noticias.";
            seccion.appendChild(mensaje);
        }
    }

    #procesarInformacion(datos) {
        const seccion = document.createElement("section");
        document.body.appendChild(seccion);

        const encabezadoSeccion = document.createElement("h2");
        encabezadoSeccion.textContent = "Noticias relacionadas";
        seccion.appendChild(encabezadoSeccion);

        if (datos.data && datos.data.length > 0) {
            datos.data.forEach(noticia => {
                const titular = document.createElement("h3");
                titular.textContent = noticia.title;
                seccion.appendChild(titular);

                const entradilla = document.createElement("p");
                entradilla.textContent = noticia.description || "Sin descripción";
                seccion.appendChild(entradilla);

                const enlace = document.createElement("a");
                enlace.href = noticia.url;
                enlace.textContent = "Leer más";
                seccion.appendChild(enlace);

                const fuente = document.createElement("p");
                fuente.textContent = "Fuente: " + (noticia.source || "Desconocida");
                seccion.appendChild(fuente);
            });
        } else {
            const mensaje = document.createElement("p");
            mensaje.textContent = "No se encontraron noticias.";
            seccion.appendChild(mensaje);
        }
    }
}
