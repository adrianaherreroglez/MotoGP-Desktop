"use strict"
class Cronometro {
    constructor() {
        this.tiempo = 0;
    }

    arrancar() {
        try {
            this.inicio = Temporal.Now.instant();
        } catch (err) {
            this.inicio = new Date();
        }
    }

    actualizar() {
        try {
            let ahora = Temporal.Now.instant();
            this.tiempo = ahora.epochMilliseconds - this.inicio.epochMilliseconds;
        } catch (err) {
            let ahora = new Date();
            this.tiempo = ahora.getTime() - this.inicio.getTime();
        }
    }


    arrancar() {
        // Llama a actualizar() cada décima de segundo (100 ms)
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }
}