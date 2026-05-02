from datetime import datetime, timedelta
import random

def simular_instituciones(numeroInstituciones):

    listaNombresOficiales = [
        "Universidad Nacional de Colombia",
        "Universidad de Antioquia",
        "Universidad de los Andes",
        "Universidad del Valle",
        "Universidad Industrial de Santander",
        "Universidad Pontificia Bolivariana",
        "Universidad EAFIT",
        "Universidad del Rosario",
        "Universidad Javeriana",
        "Universidad Externado de Colombia"
    ]
    listaNaturalezas = ["Publica", "Privada", "Mixta"]

    fechaInicial = datetime(1987, 5, 7)

    instituciones = []

    for _ in range(numeroInstituciones):
        fechaSimulada = fechaInicial + timedelta(days=random.randint(0, 60))
        institucion = {
            "id_institucion": random.randint(0, 500),
            "nombre_oficial": random.choice(listaNombresOficiales),
            "naturaleza": random.choice(listaNaturalezas),
            "fecha_registro": fechaSimulada.strftime("%Y/%m/%d %H:%M:%S")
        }

        # Ejecutando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.1:
            institucion["id_institucion"] = random.choice([None, -1, 0])
            institucion["nombre_oficial"] = None
        elif probabilidadError < 0.25:
            institucion["fecha_registro"] = None
        elif probabilidadError < 0.4:
            institucion["nombre_oficial"] = " " + institucion["nombre_oficial"] + " "
            institucion["naturaleza"] = institucion["naturaleza"].lower()
        elif probabilidadError < 0.7:
            institucion["naturaleza"] = random.choice(["N/A", "Desconocida", "", None])
        elif probabilidadError < 0.9:
            institucion["nombre_oficial"] = random.choice(["Institución Inválida", "???", "N/A"])
            institucion["fecha_registro"] = random.choice(["99/99/9999 00:00:00", "00/00/0000 00:00:00", "fecha_invalida"])

        instituciones.append(institucion)

    return instituciones