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
    #imagenElemento;

    constructor() {
        this.#busqueda = "Qatar MotoGP";
        this.#actual = 0;
        this.#maximo = 4; // índices 0-4
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
        let main = document.querySelector("main");

        // Si no existe <main>, lo creamos
        if (!main) {
            main = document.createElement("main");
            document.body.appendChild(main);
        }

        const articulo = document.createElement("article");

        const encabezado = document.createElement("h2");
        encabezado.textContent = "Imágenes del circuito de Lusail International Circuit";
        articulo.appendChild(encabezado);

        const imagen = document.createElement("img");
        imagen.src = this.#fotosJSON.fotos[this.#actual];
        imagen.alt = "Fotografía del circuito";
        articulo.appendChild(imagen);

        main.appendChild(articulo);

        this.#imagenElemento = imagen;


        setInterval(this.cambiarFotografia.bind(this), 3000);

    }

    cambiarFotografia() {
        this.#actual++;
        if (this.#actual > this.#maximo) this.#actual = 0;

        if (this.#imagenElemento) {
            this.#imagenElemento.src = this.#fotosJSON.fotos[this.#actual];
        }
    }
}
