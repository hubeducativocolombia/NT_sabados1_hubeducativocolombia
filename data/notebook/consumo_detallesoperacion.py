import requests


def consumir_detallesoperacion():
    url = "http://localhost:8080/detalles"
    respuesta = requests.get(url)
    respuesta.raise_for_status()
    datos = respuesta.json()
    return datos
