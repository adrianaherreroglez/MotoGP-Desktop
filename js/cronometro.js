
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Curso 2025-2026   
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
        this.mostrar();
    }


    arrancar() {
        // Llama a actualizar() cada décima de segundo (100 ms)
        this.corriendo = setInterval(this.actualizar.bind(this), 100);
    }

    mostrar() {
        // Convertimos milisegundos en minutos, segundos y décimas
        let minutos = parseInt(this.tiempo / 60000);            // 1 min = 60000 ms
        let segundos = parseInt((this.tiempo % 60000) / 1000);  
        let decimas  = parseInt((this.tiempo % 1000) / 100);    

        // Damos formato (mm:ss.d)
        let mm = String(minutos).padStart(2, "0");
        let ss = String(segundos).padStart(2, "0");
        let d  = String(decimas);

        let texto = `${mm}:${ss}.${d}`;

        // Mostrar el resultado en el primer <p> dentro de <main>
        const p = document.querySelector("main p");
        p.textContent = texto;
    }

    parar(){
        clearInterval(this.corriendo);
    }

    reiniciar(){
        this.parar();
        this.tiempo = 0;
        this.mostrar();
    }
}