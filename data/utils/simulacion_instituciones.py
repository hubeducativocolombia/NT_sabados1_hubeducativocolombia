import random
from datetime import datetime, timedelta


def generar_instituciones(numeroSimulaciones):
    nombres = [
        "Universidad Nacional de Colombia",
        "Universidad de Antioquia",
        "Universidad del Valle",
        "Universidad Javeriana",
        "Universidad de los Andes",
        "Universidad EAFIT",
        "Universidad del Rosario",
        "Universidad Externado de Colombia"
    ]
    naturalezas = ["oficial", "privada"]
    sitios = [
        "www.unal.edu.co",
        "www.udea.edu.co",
        "www.univalle.edu.co",
        "www.javeriana.edu.co",
        "www.uniandes.edu.co"
    ]
    fechaInicio = datetime(2000, 1, 1)
    instituciones = []

    for i in range(1, numeroSimulaciones + 1):
        institucion = {
            "idinstitucion": i,
            "fecharegistro": fechaInicio + timedelta(days=random.randint(0, 8000)),
            "naturaleza": random.choice(naturalezas),
            "nombreoficial": random.choice(nombres),
            "sitioweb": random.choice(sitios)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.15:
            institucion["idinstitucion"] = None
        elif probabilidadError < 0.30:
            institucion["naturaleza"] = random.choice(["OFICIAL", " privada", "Privada"])
        elif probabilidadError < 0.45:
            institucion["nombreoficial"] = random.choice(["", None, "  "])
        elif probabilidadError < 0.60:
            institucion["sitioweb"] = random.choice([None, "sin sitio", ""])
        elif probabilidadError < 0.75:
            institucion["fecharegistro"] = None

        instituciones.append(institucion)

    return instituciones