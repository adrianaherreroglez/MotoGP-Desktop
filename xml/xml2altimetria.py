# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

class Svg(object):
    def __init__(self, ancho=800, alto=400):
        # Añadimos width, height y viewBox para que el navegador sepa el tamaño total
        self.raiz = ET.Element('svg', {
            'xmlns': "http://www.w3.org/2000/svg",
            'version': "2.0",
            'width': str(ancho),
            'height': str(alto),
            'viewBox': f"0 0 {ancho} {alto}", # Define el área visible completa
            'preserveAspectRatio': "xMidYMid meet" # Asegura que no se deforme
        })

    def addPolyline(self, points, stroke="black", strokeWidth="2", fill="none"):
        ET.SubElement(
            self.raiz,
            'polyline',
            points=points,
            stroke=stroke,
            **{'stroke-width': str(strokeWidth)},
            fill=fill
        )

    def addLine(self, x1, y1, x2, y2, stroke="black", strokeWidth="2"):
        ET.SubElement(
            self.raiz,
            'line',
            x1=str(x1),
            y1=str(y1),
            x2=str(x2),
            y2=str(y2),
            stroke=stroke,
            **{'stroke-width': str(strokeWidth)}
        )

    def escribir(self, nombreArchivoSVG):
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

def generar_altimetria(xml_file, svg_file, ancho=800, alto=400, margen_sup=0.05):
    NS = {'uni': 'http://www.uniovi.es'}

    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
    except Exception as e:
        print("Error al leer el archivo XML:", e)
        return

    tramos = root.findall('.//uni:tramo', NS)
    if not tramos:
        return

    altitudes = []
    distancias_acum = [0.0]
    dist_total = 0.0

    for tramo in tramos:
        distancia = float(tramo.find('uni:distancia', NS).text)
        alt = float(tramo.find('uni:coordenadas/uni:altitudPunto', NS).text)
        dist_total += distancia
        distancias_acum.append(dist_total)
        altitudes.append(alt)

    max_dist = distancias_acum[-1]
    max_alt = max(altitudes)
    # Dejamos un margen para que los picos no toquen el borde superior
    margen_px = alto * margen_sup
    altura_util = alto - margen_px

    puntos_grafica = []
    for i in range(len(altitudes)):
        x = (distancias_acum[i] / max_dist) * ancho
        y = alto - (altitudes[i] / max_alt * altura_util)
        puntos_grafica.append((x, y))
    
    x_final = puntos_grafica[-1][0]
    puntos_svg_cerrados = [(0, alto)] + puntos_grafica + [(x_final, alto)]
    puntos_svg_str = " ".join(f"{x},{y}" for x, y in puntos_svg_cerrados)

    # Inicializamos la clase pasándole el ancho y alto deseados
    svg = Svg(ancho, alto)
    svg.addPolyline(puntos_svg_str, stroke="red", strokeWidth="3", fill="lightcoral")
    svg.addLine(0, alto, x_final, alto, stroke="red", strokeWidth="3")

    svg.escribir(svg_file)
    print(f"SVG generado con viewBox: {svg_file}")

if __name__ == "__main__":
    generar_altimetria("circuitoEsquema.xml", "altimetria.svg")