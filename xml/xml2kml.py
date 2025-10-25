# xml2kml.py
# -*- coding: utf-8 -*-
"""
Genera un archivo KML y un PDF de la planimetría del circuito
a partir del archivo circuitoEsquema.xml

@version 1.0
@author: Adriana Herrero González
@universidad: Universidad de Oviedo
"""

import xml.etree.ElementTree as ET
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages

# NAMESPACE del XML
NS = {'uni': 'http://www.uniovi.es'}

def generar_kml(xml_file, kml_file):
    """Lee circuitoEsquema.xml y genera circuito.kml"""
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
    except Exception as e:
        print("Error al leer el archivo XML:", e)
        return

    # Extraer coordenadas con expresiones XPath
    origen_lon = root.find('.//uni:puntoOrigen/uni:longitudOrigen', NS).text
    origen_lat = root.find('.//uni:puntoOrigen/uni:latitud', NS).text

    coords = [(float(origen_lon), float(origen_lat), 0)]

    # Añadir los puntos de los tramos
    for tramo in root.findall('.//uni:tramo', NS):
        lon = tramo.find('.//uni:longitudPunto', NS).text
        lat = tramo.find('.//uni:latitudPunto', NS).text
        coords.append((float(lon), float(lat), 0))

    # Escritura manual del archivo KML (basado en plantillas)
    with open(kml_file, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        f.write('<Document>\n')
        f.write('<Placemark>\n')
        f.write('<name>Circuito</name>\n')
        f.write('<Style id="lineaRoja">\n')
        f.write('  <LineStyle><color>#ff0000ff</color><width>4</width></LineStyle>\n')
        f.write('</Style>\n')
        f.write('<LineString>\n')
        f.write('<extrude>1</extrude>\n<tessellate>1</tessellate>\n')
        f.write('<coordinates>\n')

        # Escribir coordenadas en formato KML (lon y lat se intercambian): lat,lon,alt
        for lon, lat, alt in coords:
            f.write(f"  {lat},{lon},{alt}\n")

        f.write('</coordinates>\n')
        f.write('<altitudeMode>relativeToGround</altitudeMode>\n')
        f.write('</LineString>\n')
        f.write('</Placemark>\n')
        f.write('</Document>\n')
        f.write('</kml>\n')

    print(f"Archivo {kml_file} generado correctamente")


def main():
    xml_file = "circuitoEsquema.xml"
    kml_file = "circuito.kml"

    generar_kml(xml_file, kml_file)
   

if __name__ == "__main__":
    main()
