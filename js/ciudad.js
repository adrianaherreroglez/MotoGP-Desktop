// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict";        
class Ciudad {            
    constructor (nombre,pais,gentilicio,poblacion,coordenadas){                
        this.nombre=nombre;            
        this.pais=pais;
        this.gentilicio = gentilicio;
        this.poblacion = poblacion;
        this.coordenadas = coordenadas; // { latitud: ..., longitud: ... }
    }            
             
}        

let ciudad = new Ciudad("Lusail","Qatar","Lusailense",200.000, { latitud: 25.418852825791216, longitud: 51.500839854808376 });             
