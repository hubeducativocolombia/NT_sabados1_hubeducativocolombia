import random
from datetime import datetime, timedelta


def generar_detallesoperacion(numeroSimulaciones, max_id_programa):
    jornadas = ["diurna", "nocturna", "mixta", "fines de semana"]
    modalidades = ["presencial", "virtual", "distancia", "semipresencial"]
    detalles = []

    for i in range(1, numeroSimulaciones + 1):
        fechaActualizacion = datetime(2023, 1, 1) + timedelta(days=random.randint(0, 730))
        detalle = {
            "iddetalle": i,
            "costosemestre": round(random.uniform(1500000, 15000000), 2),
            "estudiantesactivos": random.randint(10, 500),
            "fechaactualizacion": fechaActualizacion,
            "jornada": random.choice(jornadas),
            "modalidad": random.choice(modalidades),
            "idprograma": random.randint(1, max_id_programa)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.15:
            detalle["iddetalle"] = None
        elif probabilidadError < 0.30:
            detalle["costosemestre"] = random.choice([0, -500000, None])
        elif probabilidadError < 0.45:
            detalle["estudiantesactivos"] = random.choice([0, -10, None])
        elif probabilidadError < 0.60:
            detalle["jornada"] = random.choice(["DIURNA", " nocturna", "Mixta"])
        elif probabilidadError < 0.75:
            detalle["modalidad"] = random.choice(["VIRTUAL", " presencial", None])
        elif probabilidadError < 0.90:
            detalle["fechaactualizacion"] = None

        detalles.append(detalle)

    return detalles