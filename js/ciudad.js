
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict";
class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
    }

    rellenarDatos(poblacion, latitud, longitud) {
        this.poblacion = poblacion;
        this.coordenadas = {
            latitud: latitud,
            longitud: longitud
        };

    }

    getNombre() {
        return this.nombre;
    }

    getPais() {
        return this.pais;
    }

    getInfoSecundaria() {
        return `
        <ul>
            <li>Gentilicio: ${this.gentilicio}</li>
            <li>Población: ${this.poblacion} habitantes</li>
        </ul>
    `;
    }

    escribirCoordenadas() {
        document.write("<section>");
        document.write("<h3>Coordenadas de " + this.getNombre() + "</h3>");
        document.write("<p>Latitud: " + this.coordenadas.latitud + "</p>");
        document.write("<p>Longitud: " + this.coordenadas.longitud + "</p>");
        document.write("</section>");
    }


    mostrarInfo() {
        const titulo = document.createElement("h2");
        titulo.textContent = "Meteorología en " + this.getNombre();
        document.body.appendChild(titulo);

        const seccion = document.createElement("section");

        const pais = document.createElement("p");
        pais.textContent = this.getNombre() + " es una ciudad del país de " + this.getPais() + ".";
        seccion.appendChild(pais);

        const seccionLista = document.createElement("section");

        const tituloLista = document.createElement("h3");
        tituloLista.textContent = "Información sobre " + this.getNombre();
        seccionLista.appendChild(tituloLista);

        const lista = document.createElement("ul");

        const item1 = document.createElement("li");
        item1.textContent = "Gentilicio: " + this.gentilicio;
        lista.appendChild(item1);

        const item2 = document.createElement("li");
        item2.textContent = "Población: " + this.poblacion + " habitantes";
        lista.appendChild(item2);

        seccionLista.appendChild(lista);

        seccion.appendChild(seccionLista);

        document.body.appendChild(seccion);

        
    }
}





