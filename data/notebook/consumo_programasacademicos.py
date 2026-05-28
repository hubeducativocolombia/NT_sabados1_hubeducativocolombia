import requests


def consumir_programasacademicos():
    url = "http://localhost:8080/programas"
    respuesta = requests.get(url)
    respuesta.raise_for_status()
    datos = respuesta.json()
    return datos
