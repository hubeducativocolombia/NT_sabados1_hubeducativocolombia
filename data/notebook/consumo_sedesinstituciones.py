import requests


def consumir_sedesinstituciones():
    url = "http://localhost:8080/api/sedes"
    respuesta = requests.get(url)
    respuesta.raise_for_status()
    datos = respuesta.json()
    return datos
