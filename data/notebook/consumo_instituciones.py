import requests


def consumir_instituciones():
    url = "http://localhost:8080/instituciones"
    respuesta = requests.get(url)
    respuesta.raise_for_status()
    datos = respuesta.json()
    return datos
