# xml2html.py
# -*- coding: utf-8 -*-
"""
Genera un archivo HTML InfoCircuito.html a partir de circuitoEsquema.xml
Excluye el punto de origen y los tramos del circuito
Corrige rutas de multimedia cuando HTML está en xml/
@author: Adriana Herrero González
"""

import xml.etree.ElementTree as ET
import os

# Namespace del XML
NS = {'uni': 'http://www.uniovi.es'}

class Html:
    def __init__(self, xml_file, html_file):
        self.xml_file = xml_file
        self.html_file = html_file
        self.datos = {}

    def leer_xml(self):
        """Extrae información del XML usando XPath, excluyendo punto de origen y tramos"""
        try:
            tree = ET.parse(self.xml_file)
            root = tree.getroot()
        except Exception as e:
            print("Error al leer el archivo XML:", e)
            return False

        # Datos básicos del circuito
        self.datos['nombre'] = root.find('./uni:nombre', NS).text
        self.datos['longitud'] = root.find('./uni:longitud', NS).text
        self.datos['anchura'] = root.find('./uni:anchuraMedia', NS).text
        self.datos['fecha'] = root.find('./uni:fecha', NS).text
        self.datos['horaInicio'] = root.find('./uni:horaInicio', NS).text
        self.datos['vueltas'] = root.find('./uni:vueltas', NS).text
        self.datos['localidad'] = root.find('./uni:localidad', NS).text
        self.datos['pais'] = root.find('./uni:pais', NS).text
        self.datos['patrocinador'] = root.find('./uni:patrocinador', NS).text

        # Referencias
        self.datos['referencias'] = [r.text for r in root.findall('./uni:referencias/uni:referencia', NS)]

        # Galería de fotos
        self.datos['fotos'] = [f.text for f in root.findall('./uni:galeriaFotografias/uni:foto', NS)]

        # Galería de videos
        self.datos['videos'] = [v.text for v in root.findall('./uni:galeriaVideos/uni:video', NS)]

        # Vencedor
        vencedor = root.find('./uni:vencedor', NS)
        if vencedor is not None:
            self.datos['vencedor'] = {
                'nombrePiloto': vencedor.find('./uni:nombrePiloto', NS).text,
                'tiempo': vencedor.find('./uni:tiempo', NS).text
            }
        else:
            self.datos['vencedor'] = {}

        # Clasificados
        clasificados = root.find('./uni:clasificados', NS)
        if clasificados is not None:
            self.datos['clasificados'] = {
                'primero': clasificados.find('./uni:primero', NS).text,
                'segundo': clasificados.find('./uni:segundo', NS).text,
                'tercero': clasificados.find('./uni:tercero', NS).text
            }
        else:
            self.datos['clasificados'] = {}

        return True

    def generar_html(self):
        """Genera el archivo HTML adaptativo y accesible con rutas de multimedia corregidas"""
        html = []
        html.append('<!DOCTYPE HTML>')
        html.append('<html lang="es">')
        html.append('<head>')
        html.append('    <meta charset="UTF-8">')
        html.append(f'    <title>{self.datos.get("nombre","Circuito")}</title>')
        html.append('    <meta name="author" content="Adriana Herrero González"/>')
        html.append(f'    <meta name="description" content="Información del circuito {self.datos.get("nombre","")}"/>')
        html.append('    <meta name="keywords" content="circuito,referencias,videos,galeria,fotos,vencedor,piloto,tiempo,clasificados"/>')
        html.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
        html.append('    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css"/>')
        html.append('    <link rel="stylesheet" type="text/css" href="../estilo/layout.css"/>')
        html.append('    <link rel="icon" href="../multimedia/favicon.ico"/>')
        html.append('</head>')
        html.append('<body>')
        html.append(f'    <h1>{self.datos.get("nombre","Circuito")}</h1>')
        html.append('    <main>')

        # Datos básicos
        html.append('        <section>')
        html.append('            <h2>Datos del circuito</h2>')
        html.append('            <ul>')
        for key in ['longitud','anchura','fecha','horaInicio','vueltas','localidad','pais','patrocinador']:
            html.append(f'                <li>{key.capitalize()}:{self.datos.get(key,"")}</li>')
        html.append('            </ul>')
        html.append('        </section>')

        # Referencias
        html.append('        <section>')
        html.append('            <h2>Referencias</h2>')
        for ref in self.datos['referencias']:
            html.append(f'                <p><a href="{ref}" target="_blank">{ref}</a></p>')
        html.append('        </section>')

        # Galería de fotos (adaptable con <picture>)
        html.append('        <section>')
        html.append('            <h2>Galería de Fotos</h2>')
        for foto in self.datos['fotos']:
            # Extraemos nombre y extensión
            base, ext = os.path.splitext(foto)
            original = f'../{foto}'
            html.append(f'                <img src="{original}" alt="Foto del circuito"/>')
        html.append('        </section>')


        # Galería de videos
        html.append('        <section>')
        html.append('            <h2>Galería de Videos</h2>')
        for video in self.datos['videos']:
            video_path = os.path.join("..", video).replace("\\","/")
            html.append(f'                <video controls><source src="{video_path}" type="video/mp4">Tu navegador no soporta video HTML5.</video>')
        html.append('        </section>')

        # Vencedor
        if self.datos['vencedor']:
            html.append('        <section>')
            html.append('            <h2>Vencedor</h2>')
            html.append(f'            <p>Piloto: {self.datos["vencedor"]["nombrePiloto"]}</p>')
            html.append(f'            <p>Tiempo:{self.datos["vencedor"]["tiempo"]}</p>')
            html.append('        </section>')

        # Clasificados
        if self.datos['clasificados']:
            html.append('        <section>')
            html.append('            <h2>Clasificados</h2>')
            html.append('            <ol>')
            for pos in ['primero','segundo','tercero']:
                html.append(f'                <li>{self.datos["clasificados"][pos]}</li>')
            html.append('            </ol>')
            html.append('        </section>')

        html.append('    </main>')
        html.append('</body>')
        html.append('</html>')

        # Guardar en archivo
        try:
            with open(self.html_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(html))
            print(f'Archivo {self.html_file} generado correctamente.')
        except Exception as e:
            print('Error al escribir el archivo HTML:', e)


def main():
    xml_file = "circuitoEsquema.xml"
    html_file = "InfoCircuito.html"

    html = Html(xml_file, html_file)
    if html.leer_xml():
        html.generar_html()


if __name__ == "__main__":
    main()
