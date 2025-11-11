// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict"
class Memoria {

    #tablero_bloqueado;
    #primera_carta;
    #segunda_carta;
    #crono;

    constructor() {
        this.#tablero_bloqueado = true;
        this.#primera_carta = null;
        this.#segunda_carta = null;

        this.#barajarCartas();
        this.#manageEvents();

        this.#tablero_bloqueado = false;

        this.#crono = new Cronometro();
        this.#crono.arrancar();
    }

    voltearCarta(carta) {
        if (this.#tablero_bloqueado) return; // Si el tablero está bloqueado, no hacer nada
        if (carta.dataset.estado === "volteada") return; // Si la carta ya está volteada, no hacer nada
        if (carta.dataset.estado === "revelada") return; // Si la carta ya está emparejada, no hacer nada

        carta.dataset.estado = "volteada";

        // Si no hay primera carta, esta es la primera
        if (!this.#primera_carta) {
            this.#primera_carta = carta;
            return; // Salimos porque falta la segunda carta
        }

        // Si ya hay una primera, esta será la segunda
        this.#segunda_carta = carta;

        this.#tablero_bloqueado = true;

  
        this.#comprobarPareja();
    }

    #comprobarPareja() {
        const img1 = this.#primera_carta.children[1].getAttribute('src');
        const img2 = this.#segunda_carta.children[1].getAttribute('src');

        (img1 === img2) ? this.#deshabilitarCartas() : this.#cubrirCartas();
    }

    #deshabilitarCartas() {
        this.#primera_carta.dataset.estado = "revelada";
        this.#segunda_carta.dataset.estado = "revelada";
        this.#comprobarJuego();
        this.#reiniciarAtributos();
    }

    #cubrirCartas() {
        this.#tablero_bloqueado = true;

        setTimeout(function () {
            if (this.#primera_carta) {
                this.#primera_carta.removeAttribute('data-estado');
            }
            if (this.#segunda_carta) {
                this.#segunda_carta.removeAttribute('data-estado');
            }
            this.#reiniciarAtributos();
        }.bind(this), 1500);
    }

    #comprobarJuego() {
        const cartas = document.querySelectorAll('main article');
        let todasReveladas = true;
        for (let i = 0; i < cartas.length; i++) {
            if (cartas[i].dataset.estado != 'revelada') {
                todasReveladas = false;
                break;
            }
        }
        if (todasReveladas) {
            // Finalizar
            this.#crono.parar();
        }
    }

    #reiniciarAtributos() {
        this.#tablero_bloqueado = false;
        this.#primera_carta = null;
        this.#segunda_carta = null;
    }

    #manageEvents() {
        const cartas = document.querySelectorAll("main article");
        for(let i = 0; i < cartas.length; i++){
            cartas[i].addEventListener("click", this.voltearCarta(this));
        }
    }

   

    #barajarCartas() {
        var main = document.querySelector("main");
        var hijos = main.children;
        var cartas = [];

        // Solo se tienen en cuenta los article
        for (var i = 0; i < hijos.length; i++) {
            if (hijos[i].tagName.toLowerCase() === "article") {
                cartas.push(hijos[i]);
            }
        }

        for (var i = cartas.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = cartas[i];
            cartas[i] = cartas[j];
            cartas[j] = temp;
        }

        for (var k = 0; k < cartas.length; k++) {
            main.appendChild(cartas[k]);
        }
    } 
}
