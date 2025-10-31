<<<<<<< HEAD
import xml.etree.ElementTree as ET

class Html:
    def __init__(self, xml_file):
        self.xml_file = xml_file
        self.ns = {'u': 'http://www.uniovi.es'}  # Namespace del XML

    def generar_html(self):
        tree = ET.parse(self.xml_file)
        root = tree.getroot()

        # Extracción de información mediante XPath
        nombre = root.find('u:nombre', self.ns).text
        longitud = root.find('u:longitud', self.ns).text
        unidad_long = root.find('u:longitud', self.ns).attrib['unidad']
        anchura = root.find('u:anchuraMedia', self.ns).text
        unidad_anch = root.find('u:anchuraMedia', self.ns).attrib['unidad']
        fecha = root.find('u:fecha', self.ns).text
        hora = root.find('u:horaInicio', self.ns).text
        vueltas = root.find('u:vueltas', self.ns).text
        localidad = root.find('u:localidad', self.ns).text
        pais = root.find('u:pais', self.ns).text
        patrocinador = root.find('u:patrocinador', self.ns).text

        # Listas
        referencias = [r.text.strip() for r in root.findall('u:referencias/u:referencia', self.ns)]
        fotos = [f.text.strip() for f in root.findall('u:galeriaFotografias/u:foto', self.ns)]
        videos = [v.text.strip() for v in root.findall('u:galeriaVideos/u:video', self.ns)]

        # Vencedor y clasificados
        vencedor = root.find('u:vencedor/u:nombrePiloto', self.ns).text
        tiempo = root.find('u:vencedor/u:tiempo', self.ns).text
        primero = root.find('u:clasificados/u:primero', self.ns).text
        segundo = root.find('u:clasificados/u:segundo', self.ns).text
        tercero = root.find('u:clasificados/u:tercero', self.ns).text

        # HTML final
        html = f"""<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Información del circuito - {nombre}</title>
    <meta name="author" content="Proyecto MotoGP Desktop" />
    <meta name="description" content="Información detallada del circuito {nombre}" />
    <meta name="keywords" content="MotoGP, circuito, {pais}, {nombre}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="icon" href="multimedia/favicon.ico" />
</head>

<body>
    <header>
        <h1><a href="index.html" title="Página de inicio">MotoGP Desktop</a></h1>
        <nav>
            <a href="index.html" title="Inicio">Inicio</a>
            <a href="piloto.html" title="Piloto">Piloto</a>
            <a href="circuito.html" title="Circuito" class="active">Circuito</a>
            <a href="meteorología.html" title="Meteorología">Meteorología</a>
            <a href="clasificaciones.html" title="Clasificaciones">Clasificaciones</a>
            <a href="juegos.html" title="Juegos">Juegos</a>
            <a href="ayuda.html" title="Ayuda">Ayuda</a>
        </nav>
    </header>

    <p>Estás en <a href="index.html" title="Página de inicio">Inicio</a> >> Circuito</p>

    <main>
        <h2>Información del circuito {nombre}</h2>

        <section>
            <h3>Datos generales</h3>
            <ul>
                <li>Longitud: {longitud} {unidad_long}</li>
                <li>Anchura media: {anchura} {unidad_anch}</li>
                <li>Fecha: {fecha}</li>
                <li>Hora de inicio: {hora}</li>
                <li>Vueltas: {vueltas}</li>
                <li>Localidad: {localidad}</li>
                <li>País: {pais}</li>
                <li>Patrocinador: {patrocinador}</li>
            </ul>
        </section>

        <section>
            <h3>Vencedor</h3>
            <p>Piloto ganador: {vencedor}</p>
            <p>Tiempo total: {tiempo}</p>
        </section>

        <section>
            <h3>Clasificación</h3>
            <ol>
                <li>{primero}</li>
                <li>{segundo}</li>
                <li>{tercero}</li>
            </ol>
        </section>

        <section>
            <h3>Galería de fotografías</h3>
            <ul>
                {''.join(f'<img src="{f}" alt="Fotografía del circuito {nombre}">' for f in fotos)}
            </ul>
        </section>

        <section>
            <h3>Galería de vídeos</h3>
            <ul>
                {''.join(f'<video controls src="{v}">Tu navegador no soporta la etiqueta vídeo.</video>' for v in videos)}
            </ul>
        </section>

        <section>
            <h3>Referencias</h3>
            <ul>
                {''.join(f'<li><a href="{r}" target="_blank" rel="noopener noreferrer">{r}</a></li>' for r in referencias)}
            </ul>
        </section>
    </main>
</body>
</html>
"""

        # Guardar archivo HTML
        with open("InfoCircuito.html", "w", encoding="utf-8") as f:
            f.write(html)

        print("Archivo InfoCircuito.html generado correctamente.")

# Ejecución directa
if __name__ == "__main__":
    html = Html("circuitoEsquema.xml")
    html.generar_html()
=======
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
        html.append('    <meta name="author" content="Adriana Herrero González">')
        html.append(f'    <meta name="description" content="Información del circuito {self.datos.get("nombre","")}">')
        html.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
        html.append('    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css">')
        html.append('    <link rel="icon" href="../multimedia/favicon.ico">')
        html.append('</head>')
        html.append('<body>')
        html.append(f'    <header><h1><a href="InfoCircuito.html" title="Información del circuito">{self.datos.get("nombre","Circuito")}</a></h1></header>')
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
        html.append('            <ul>')
        for ref in self.datos['referencias']:
            html.append(f'                <li><a href="{ref}" target="_blank">{ref}</a></li>')
        html.append('            </ul>')
        html.append('        </section>')

        # Galería de fotos (adaptable con <picture>)
        html.append('        <section>')
        html.append('            <h2>Galería de Fotos</h2>')
        for foto in self.datos['fotos']:
            # Extraemos nombre y extensión
            base, ext = os.path.splitext(foto)
            small = f'../{base}-small{ext}'
            medium = f'../{base}-medium{ext}'
            original = f'../{foto}'
            html.append('            <picture>')
            html.append(f'                <source media="(max-width: 465px)" srcset="{small}">')
            html.append(f'                <source media="(max-width:799px)" srcset="{medium}">')
            html.append(f'                <source media="(min-width:800px)" srcset="{original}">')
            html.append(f'                <img src="{original}" alt="Foto del circuito">')
            html.append('            </picture>')
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
            html.append(f'            <p><strong>Piloto:</strong> {self.datos["vencedor"]["nombrePiloto"]}</p>')
            html.append(f'            <p><strong>Tiempo:</strong> {self.datos["vencedor"]["tiempo"]}</p>')
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
>>>>>>> 2fd50820071083a48acc3a6582cb4e54fa18a80c
