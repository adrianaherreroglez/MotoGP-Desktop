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
    
    infoSecundaria(){
        this.poblacion = 200000;
        this.coordenadas = this.coordenadas;

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
             
}        

let ciudad = new Ciudad("Lusail","Qatar","Lusailense");             
