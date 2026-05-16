import random
from datetime import datetime, timedelta

def generar_simulacion(numeroSimulaciones):
    nombres_instituciones = [
        "Universidad Nacional de Colombia",
        "Universidad de los Andes",
        "Universidad Javeriana",
        "Universidad del Rosario",
        "Universidad EAFIT"
    ]
    naturalezas = ["publica", "privada"]
    sitios_web = [
        "https://unal.edu.co",
        "https://uniandes.edu.co",
        "https://javeriana.edu.co",
        "https://urosario.edu.co",
        "https://eafit.edu.co"
    ]

    fechaInicio = datetime(2020, 1, 1)
    simulaciones = []

    for i in range(numeroSimulaciones):
        institucion = {
            "idinstitucion": i + 1,
            "fecharegistro": fechaInicio + timedelta(days=random.randint(0, 1000)),
            "naturaleza": random.choice(naturalezas),
            "nombreoficial": random.choice(nombres_instituciones),
            "sitioweb": random.choice(sitios_web)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.2:
            institucion["idinstitucion"] = None
        elif probabilidadError < 0.4:
            institucion["naturaleza"] = random.choice(["mixta", "internacional", "123"])
        elif probabilidadError < 0.5:
            institucion["nombreoficial"] = None
        elif probabilidadError < 0.7:
            institucion["sitioweb"] = " " + institucion["sitioweb"].upper()
        elif probabilidadError < 0.9:
            institucion["fecharegistro"] = None

        simulaciones.append(institucion)

    return simulaciones