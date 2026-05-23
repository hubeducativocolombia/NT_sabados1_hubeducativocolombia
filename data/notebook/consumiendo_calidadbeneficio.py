# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : consumiendo_calidadbeneficio.py
# PROPÓSITO  : Consumir servicios RESTful desarrollados en el backend de Spring Boot, específicamente diseñados
#              para la tabla 'calidadbeneficio' de la base de datos MySQL.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : random, datetime
#
# =============================================================================


# Pasos para conectarme conectarme con el backend (Consumir API)

import requests
def consumir_servicios_calidadbeneficios():
    # 1. Almacenar la URL + Endpoint en una variable
    url="http://localhost:8080/api/calidadbeneficio"

    # 2 .Activar Requets
    respuesta = requests.get(url)


    # 3. Esperar el status code
    respuesta.raise_for_status() # Si el status code es diferente a 200, se lanzará una excepción

    
    # 4. Verificar el formato de respuesta
    datos = respuesta.json() # Convertir la respuesta a formato JSON


    #5. Retornar la respuesta
    return datos