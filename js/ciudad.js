
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict";        
class Ciudad {            
    constructor (nombre,pais,gentilicio){                
        this.nombre = nombre;            
        this.pais = pais;
        this.gentilicio = gentilicio;
    }       
    
    rellenarDatos(poblacion,latitud,longitud){
        this.poblacion = poblacion;
         this.coordenadas = {
            latitud: latitud, 
            longitud: longitud
        };

    }

    getNombre() {
        document.currentScript.insertAdjacentText("beforebegin", this.nombre);
    }

    getPais() {
        document.currentScript.insertAdjacentText("beforebegin", this.pais);
    }

    getInfoSecundaria() {
        const script = document.currentScript;

        const contenedor = document.createElement("section");
        contenedor.innerHTML = `
            <ul>
                <li>Gentilicio: ${this.gentilicio}</li>
                <li>Población: ${this.poblacion}</li>
            </ul>
        `;

        while (contenedor.firstChild) {
            script.parentNode.insertBefore(contenedor.firstChild, script);
        }
    }

    getCoordenadas(){
        document.write(
            ` <p>Latitud: ${this.coordenadas.latitud}</p> 
        <p>Longitud: ${this.coordenadas.longitud}</p>`
        ); 
    }
             
}        

