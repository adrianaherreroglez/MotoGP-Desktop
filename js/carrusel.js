"use strict";

class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #fotosJSON;
    #imagenElemento;

    constructor() {
        this.#busqueda = "Qatar MotoGP";
        this.#actual = 0;
        this.#maximo = 4;
        this.#fotosJSON = { fotos: [] };
        this.#imagenElemento = null;
    }

    getFotografias() {
        const url = "https://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.ajax({
            dataType: "json",
            url: url,
            method: "GET",
            data: {
                tags: this.#busqueda,
                tagmode: "any",
                format: "json"
            },
            success: function (datos) {
                this.procesarJSONFotografias(datos);
                this.mostrarFotografias();
            }.bind(this),
            error: function () {
                const h2 = document.createElement("h2");
                h2.innerHTML = "¡Tenemos problemas! No puedo obtener JSON de <a href='https://www.flickr.com/'>Flickr</a>";
                document.body.appendChild(h2);
            }
        });
    }

    procesarJSONFotografias(datos) {
        const fotos = [];

        for (let i = 0; i < datos.items.length && fotos.length <= this.#maximo; i++) {
            const url = datos.items[i].media.m.replace("_m.", "_z.");
            if (!fotos.includes(url)) fotos.push(url);
        }

        this.#fotosJSON.fotos = fotos;
        this.#actual = 0;
    }

    mostrarFotografias() {
        // Crear article dinámicamente
        const articulo = document.createElement("article");
        document.body.appendChild(articulo);

        const encabezado = document.createElement("h2");
        encabezado.textContent = "Imágenes del circuito de Lusail International Circuit";
        articulo.appendChild(encabezado);

        const imagen = document.createElement("img");
        imagen.src = this.#fotosJSON.fotos[this.#actual];
        imagen.alt = "Fotografía del circuito";
        articulo.appendChild(imagen);

        this.#imagenElemento = imagen;

        setInterval(() => {
            this.#actual++;
            if (this.#actual > this.#maximo || this.#actual >= this.#fotosJSON.fotos.length) this.#actual = 0;
            this.#imagenElemento.src = this.#fotosJSON.fotos[this.#actual];
        }, 3000);
    }
}
