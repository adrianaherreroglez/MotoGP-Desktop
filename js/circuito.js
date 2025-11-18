
// versión 1.0 
// Adriana Herrero González
// Universidad de Oviedo
// Cursd 2025-2026   
"use strict"
class Circuito{

    constructor(){

        comprobarApiFile();
    }

    comprobarApiFile(){
        if (window.File && window.FileReader && window.FileList && window.Blob) 
            {  
                //El navegador soporta el API File
                
            }
        else{
            const error = document.createElement("p");
            error.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
            document.body.appendChild(error);
        }
    }

    leerArchivoHTML(){
        
    }

   
}