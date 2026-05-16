import random
from datetime import datetime, timedelta

def generar_simulacion(numeroSimulaciones):
    jornadas = ["manana", "tarde", "noche", "mixta"]
    modalidades = ["presencial", "virtual", "semipresencial"]
    fechaInicio = datetime(2020, 1, 1)
    simulaciones = []

    for i in range(numeroSimulaciones):
        detalle = {
            "iddetalle": i + 1,
            "costosemestre": round(random.uniform(1000000, 15000000), 2),
            "estudiantesactivos": random.randint(10, 500),
            "fechaactualizacion": fechaInicio + timedelta(days=random.randint(0, 1000)),
            "idprograma": random.randint(1, 50),
            "jornada": random.choice(jornadas),
            "modalidad": random.choice(modalidades),
            "pkidprograma": random.randint(1, 50)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.2:
            detalle["iddetalle"] = None
        elif probabilidadError < 0.4:
            detalle["jornada"] = random.choice(["fin de semana", "especial", "123"])
        elif probabilidadError < 0.5:
            detalle["modalidad"] = random.choice(["hibrida", "remota", "456"])
        elif probabilidadError < 0.6:
            detalle["costosemestre"] = random.choice([0, -500000, None])
        elif probabilidadError < 0.7:
            detalle["estudiantesactivos"] = random.choice([0, -10, None])
        elif probabilidadError < 0.8:
            detalle["fechaactualizacion"] = None
        elif probabilidadError < 0.9:
            detalle["idprograma"] = random.choice([None, -1, 0])

        simulaciones.append(detalle)

    return simulaciones