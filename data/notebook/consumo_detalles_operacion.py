# Pasos para conectarme conectarme con el backend (Consumir API)

import requests
def consumir_id_programa_tabla_detalles_operacion():
    # 1. Almacenar la URL + Endpoint en una variable
    url="http://localhost:8080/api/servicios"

    # 2 .Activar Requets
    respuesta = requests.get(url)


    # 3. Esperar el status code
    respuesta.raise_for_status() # Si el status code es diferente a 200, se lanzará una excepción

    
    # 4. Verificar el formato de respuesta
    datos = respuesta.json() # Convertir la respuesta a formato JSON


    #5. Retornar la respuesta
    return datos