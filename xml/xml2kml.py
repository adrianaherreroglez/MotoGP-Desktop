# xml2kml.py
# -*- coding: utf-8 -*-
"""
Genera un archivo KML y un PDF de la planimetría del circuito
a partir del archivo circuitoEsquema.xml usando la clase Kml.
"""

import xml.etree.ElementTree as ET

# NAMESPACE del XML
NS = {'uni': 'http://www.uniovi.es'}

class Kml:
    def __init__(self, xml_file, kml_file):
        self.xml_file = xml_file
        self.kml_file = kml_file
        self.coords = []

    def leer_xml(self):
        """Lee el XML y extrae las coordenadas"""
        try:
            tree = ET.parse(self.xml_file)
            root = tree.getroot()
        except Exception as e:
            print("Error al leer el archivo XML:", e)
            return False

        # Coordenadas del punto de origen
        origen_lon = root.find('.//uni:puntoOrigen/uni:longitudOrigen', NS).text
        origen_lat = root.find('.//uni:puntoOrigen/uni:latitud', NS).text
        self.coords.append((float(origen_lon), float(origen_lat), 0))

        # Coordenadas de los tramos
        for tramo in root.findall('.//uni:tramo', NS):
            lon = tramo.find('.//uni:longitudPunto', NS).text
            lat = tramo.find('.//uni:latitudPunto', NS).text
            self.coords.append((float(lon), float(lat), 0))

        return True

    def generar_kml(self):
        """Genera el archivo KML con las coordenadas"""
        if not self.coords:
            print("No hay coordenadas para generar KML")
            return

        with open(self.kml_file, "w", encoding="utf-8") as f:
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

            # Escribir coordenadas en formato KML
            for lon, lat, alt in self.coords:
                f.write(f"  {lat},{lon},{alt}\n")

            f.write('</coordinates>\n')
            f.write('<altitudeMode>relativeToGround</altitudeMode>\n')
            f.write('</LineString>\n')
            f.write('</Placemark>\n')
            f.write('</Document>\n')
            f.write('</kml>\n')

        print(f"Archivo {self.kml_file} generado correctamente")


def main():
    xml_file = "circuitoEsquema.xml"
    kml_file = "circuito.kml"

    kml = Kml(xml_file, kml_file)
    if kml.leer_xml():
        kml.generar_kml()


if __name__ == "__main__":
    main()
