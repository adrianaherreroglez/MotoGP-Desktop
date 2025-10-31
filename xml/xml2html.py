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
