
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
    
    infoSecundaria(poblacion,latitud,longitud){
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
                <li>Población: ${this.poblacion}</li>
            </ul>
        `;
    }

    getCoordenadas(){
        // ¿Hay que usar deprecated?
        document.write(
        `<p>Coordenadas de ${this.nombre}: 
        Latitud ${this.coordenadas.latitud}, 
        Longitud ${this.coordenadas.longitud}</p>`
        ); 
    }
             
}        

let ciudad = new Ciudad("Lusail","Qatar","Lusailense");             
ciudad.rellenarDatos(200000, 25.41854617669826, 51.50062601649862); // Población, latitud, longitud

