# xml2altimetria.py
# -*- coding: utf-8 -*-
"""
Genera un archivo SVG con la altimetría del circuito
a partir del archivo circuitoEsquema.xml usando expresiones XPath,
con polilínea cerrada, relleno y línea de suelo roja gruesa.

@version 1.3
@author: Adriana Herrero González
@universidad: Universidad de Oviedo
"""

import xml.etree.ElementTree as ET

class Svg(object):
    def __init__(self):
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")

    def addPolyline(self, points, stroke="black", strokeWidth="2", fill="none"):
        ET.SubElement(self.raiz,'polyline',
                      points=points,
                      stroke=stroke,
                      **{'stroke-width': strokeWidth},
                      fill=fill)

    def addLine(self, x1, y1, x2, y2, stroke="black", strokeWidth="2"):
        ET.SubElement(self.raiz, 'line',
                      x1=str(x1),
                      y1=str(y1),
                      x2=str(x2),
                      y2=str(y2),
                      stroke=stroke,
                      **{'stroke-width': strokeWidth})

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

def generar_altimetria(xml_file, svg_file, ancho=800, alto=400):
    NS = {'uni': 'http://www.uniovi.es'}
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
    except Exception as e:
        print("Error al leer el archivo XML:", e)
        return

    # Extraer altitudes y distancias acumuladas
    altitudes = []
    distancias = []
    distancia_acum = 0.0

    tramos = root.findall('.//uni:tramo', NS)
    for tramo in tramos:
        distancia = float(tramo.find('uni:distancia', NS).text)  # XPath explícito
        alt = float(tramo.find('.//uni:altitudPunto', NS).text)  # XPath explícito
        distancia_acum += distancia
        distancias.append(distancia_acum)
        altitudes.append(alt)

    if not distancias:
        print("No hay tramos en el XML")
        return

    # Normalizar valores a coordenadas SVG
    max_dist = max(distancias)
    max_alt = max(altitudes)
    min_alt = min(altitudes)

    # Convertir a coordenadas SVG
    puntos_svg = []
    for d, a in zip(distancias, altitudes):
        x = (d / max_dist) * ancho
        y = alto - ((a - min_alt) / (max_alt - min_alt) * alto)
        puntos_svg.append((x, y))

    # Añadir efecto suelo y relleno: cerramos polilínea
    puntos_svg_cerrados = [(0, alto)] + puntos_svg + [(ancho, alto)]
    puntos_svg_str = " ".join(f"{x},{y}" for x, y in puntos_svg_cerrados)

    # Crear SVG y añadir polilínea con relleno
    svg = Svg()
    svg.addPolyline(puntos_svg_str, stroke="red", strokeWidth="3", fill="lightcoral")

    # Añadir línea de suelo roja gruesa como la polilínea
    svg.addLine(0, alto, ancho, alto, stroke="red", strokeWidth="3")

    svg.escribir(svg_file)
    print(f"Archivo SVG '{svg_file}' generado correctamente con suelo y relleno.")

def main():
    xml_file = "circuitoEsquema.xml"
    svg_file = "altimetria.svg"
    generar_altimetria(xml_file, svg_file)

if __name__ == "__main__":
    main()
