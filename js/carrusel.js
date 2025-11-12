// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026  
"use strict";

class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #fotosJSON;

    constructor() {
        this.#busqueda = "Lusail International Circuit"; // término de búsqueda
        this.#actual = 0; // índice de la foto actual
        this.#maximo = 4; // número máximo de fotos a mostrar
        this.#fotosJSON = null;
    }

    getFotografias() {
        var url = "https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.ajax({
            dataType: "json",
            url: url,
            method: "GET",
            data: {
                tags: this.#busqueda,
                tagmode: "any",
                format: "json"
            },
            success: function(datos) {
                this.#fotosJSON = datos; 
                this.procesarJSONFotografias();
                this.mostrarFotografias();
            }.bind(this), 
            error: function() {
                var h3 = document.createElement("h3");
                h3.innerHTML = "¡Tenemos problemas! No puedo obtener JSON de <a href='https://www.flickr.com/'>Flickr</a>";
                document.body.appendChild(h3);
            }
        });
    }

    procesarJSONFotografias() {
        if (!this.#fotosJSON || !this.#fotosJSON.items) return;

        // Extraemos hasta 5 fotos y tenemos tamaño a _z (640px)
        const fotos = [];
        for (var i = 0; i < this.#fotosJSON.items.length && i < 5; i++) {
            fotos.push(this.#fotosJSON.items[i].media.m.replace("_m.", "_z."));
        }

        this.#fotosJSON = { fotos: fotos };
    }

    mostrarFotografias() {
        if (!this.#fotosJSON || this.#fotosJSON.fotos.length === 0) return;

        var articulo = document.createElement("article");

        var encabezado = document.createElement("h2");
        encabezado.textContent = "Imágenes del circuito de " + this.#busqueda;
        articulo.appendChild(encabezado);

        var imagen = document.createElement("img");
        imagen.src = this.#fotosJSON.fotos[this.#actual];
        imagen.alt = "Fotografía del circuito";
        articulo.appendChild(imagen);

        document.body.appendChild(articulo);
    }
}
