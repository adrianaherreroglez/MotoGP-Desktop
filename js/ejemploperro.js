// version 1.0 01\10\2011 Juan Manuel Cueva Lovelle. Universidad de Oviedo         
// Version 1.1 23\10\2021 Refoma de head         
//  Version 1.2 24\10\2025 Sin usar document.write()        
"use strict";        
class Perro {            
    constructor (nombre){                
        this.nombre=nombre;            
    }            
    
    ladra(){                
        //document.write("<p>"+this.nombre+" dice guau <\p>");                
        // Aunque algunos navegadores aún soportan document.write()                
        // ya no forma parte de las prácticas recomendadas                
        // podría dejar de funcionar en futuras versiones                 
        const mensaje = document.createElement("p");                 
        mensaje.textContent = this.nombre + " dice guau";                 
        document.body.appendChild(mensaje);            
    }        
}        

let tom = new Perro("Tom");        
tom.ladra();        
let zar = new Perro("Zar");        
zar.ladra();                
let pio = new Perro("Pio");        
pio.ladra();