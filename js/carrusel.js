// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026  
"use strict";

class Carrusel {

    #busqueda;
    #fotosJSON;
    #actual;
    #maximo;

    constructor() {
        this.#busqueda = "Lusail International Circuit";
        this.#fotosJSON = [];
        this.#actual = 0;   // índice de la foto actualmente mostrada
        this.#maximo = 4;   // número máximo de fotos a mostrar
    }


    getFotografias() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.ajax({
            dataType: "json",
            url: flickrAPI,
            method: "GET",
            data: {
                tags: this.#busqueda,
                tagmode: "any",
                format: "json"
            },
            success: (function (datos) {
                // Forzar tamaño 640px (_z)
                var fotos = [];
                for (var i = 0; i < 5 && i < datos.items.length; i++) {
                    var item = datos.items[i];
                    fotos.push(item.media.m.replace("_m.", "_z."));
                }
                this.#fotosJSON = fotos;

                this.procesarJSONFotografias();
                this.mostrarFotografias();

            }).bind(this),
            error: (function () {
                var error = document.createElement("p");
                error.textContent = "¡Tenemos problemas! No se pudieron obtener las imágenes del feed público de Flickr.";
                document.body.appendChild(error);
            }).bind(this)
        });
    }

    procesarJSONFotografias() {
        const fotosProcesadas = {
            fotos: this.#fotosJSON.slice(0, 5) // extraemos hasta 5 fotos
        };

        fotosProcesadas.ver = fotosProcesadas.fotos.slice.bind(fotosProcesadas.fotos);

        this.#fotosJSON = fotosProcesadas;

        return this.#fotosJSON;
    }



    mostrarFotografias() {
        // Comprobar que existen fotos
        if (!this.#fotosJSON || this.#fotosJSON.length === 0) return;

        var articulo = document.createElement("article");

        var encabezado = document.createElement("h2");
        encabezado.textContent = "Imágenes del circuito de " + this.#busqueda;
        articulo.appendChild(encabezado);

        // Obtener la primera foto (índice #actual)
        var fotoURL = this.#fotosJSON.ver()[this.#actual];

        // Crear la imagen
        var imagen = document.createElement("img");
        imagen.src = fotoURL;
        imagen.alt = "Fotografía del circuito";

        articulo.appendChild(imagen);
        document.body.appendChild(articulo);
    }

}
