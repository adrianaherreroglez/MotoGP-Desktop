
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
        // ¿Hay que usar write aunque esté deprecated?
        document.write(
            ` <p>Latitud: ${this.coordenadas.latitud}</p> 
        <p>Longitud: ${this.coordenadas.longitud}</p>`
        ); 
    }
             
}        

