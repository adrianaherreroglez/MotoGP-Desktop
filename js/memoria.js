// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict"
class Memoria{

    constructor(){
        this.tablero_bloqueado = true;
        this.primera_carta = null;
        this.segunda_carta = null;

        this.barajarCartas();

    }

    voltearCarta(carta){
        carta.dataset.estado = "volteada";
    }

    barajarCartas() {
        // Obtener el contenedor principal
        var main = document.querySelector("main");

        // Obtener todos los hijos del main y quedarnos solo con los <article>
        var hijos = main.children;
        var cartas = [];

        for (var i = 0; i < hijos.length; i++) {
            if (hijos[i].tagName.toLowerCase() === "article") {
                cartas.push(hijos[i]);
            }
        }

        // Barajar las cartas
        for (var i = cartas.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = cartas[i];
            cartas[i] = cartas[j];
            cartas[j] = temp;
        }

        // Volver a añadir las cartas al <main> en el nuevo orden
        for (var k = 0; k < cartas.length; k++) {
            main.appendChild(cartas[k]);
        }
    }
}