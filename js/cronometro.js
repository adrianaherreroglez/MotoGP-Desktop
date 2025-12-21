
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Curso 2025-2026   
"use strict"
class Cronometro {

    #tiempo;
    #tiempoTotal;
    #corriendo;
    #inicio;

    constructor() {
        this.#tiempo = 0;         // tiempo acumulado en milisegundos
        this.#tiempoTotal = 0;    // tiempo mostrado actualmente
        this.#corriendo = null;
        this.#manageEvents();
    }

    #manageEvents() {
        const buttons = document.querySelectorAll("button");
        for(let i = 0; i < buttons.length; i++){
            buttons[i].addEventListener("click", this.#manageButton.bind(this));
        }
    }

    #manageButton(evento) {
        const texto = evento.target.textContent;

        switch (texto) {
          case "Arrancar":
            this.arrancar();
            break;
          case "Parar":
            this.#parar();
            break;
          case "Reiniciar":
            this.#reiniciar();
            break;
        }
    }

    arrancar() {
        if (this.#corriendo) return; // evita crear otro intervalo si ya hay uno
        try {
            this.#inicio = Temporal.Now.instant();
        } catch (err) {
            this.#inicio = new Date();
        }

        this.#corriendo = setInterval(this.#actualizar.bind(this), 100);
    }


    #actualizar() {
        let ahora;
        try {
            ahora = Temporal.Now.instant();
            const diff = ahora.epochMilliseconds - this.#inicio.epochMilliseconds;
            this.#tiempoTotal = this.#tiempo + diff;
        } catch (err) {
            ahora = new Date();
            const diff = ahora.getTime() - this.#inicio.getTime();
            this.#tiempoTotal = this.#tiempo + diff;
        }
        this.#mostrar(this.#tiempoTotal);
    }

    #mostrar() {
        // Muestra siempre el tiempo total actual
        let minutos = parseInt(this.#tiempoTotal / 60000);
        let segundos = parseInt((this.#tiempoTotal % 60000) / 1000);
        let decimas = parseInt((this.#tiempoTotal % 1000) / 100);

        let mm = String(minutos).padStart(2, "0");
        let ss = String(segundos).padStart(2, "0");
        let d = String(decimas);

        document.querySelector("main p").textContent = `${mm}:${ss}.${d}`;
    }

    #parar() {
        if (!this.#corriendo) return;

        clearInterval(this.#corriendo);
        this.#corriendo = null;

        try {
            const ahora = Temporal.Now.instant();
            this.#tiempo += ahora.epochMilliseconds - this.#inicio.epochMilliseconds;
        } catch (err) {
            const ahora = new Date();
            this.#tiempo += ahora.getTime() - this.#inicio.getTime();
        }

        // Al parar, sincronizamos tiempoTotal con el acumulado
        this.#tiempoTotal = this.#tiempo;
        this.#mostrar();
    }

    #reiniciar() {
        this.#parar();
        this.#tiempo = 0;
        this.#tiempoTotal = 0;
        this.#mostrar();
    }
}

 
