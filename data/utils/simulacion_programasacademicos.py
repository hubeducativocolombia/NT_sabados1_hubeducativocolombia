import random


def generar_programasacademicos(numeroSimulaciones, max_id_institucion):
    nombres_programas = [
        "Ingeniería de Sistemas", "Medicina", "Derecho", "Administración de Empresas",
        "Psicología", "Ingeniería Civil", "Contaduría Pública", "Enfermería",
        "Arquitectura", "Comunicación Social", "Ingeniería Industrial", "Biología"
    ]
    niveles = ["pregrado", "posgrado", "maestría", "doctorado", "especialización", "tecnología", "técnica"]
    programas = []

    for i in range(1, numeroSimulaciones + 1):
        programa = {
            "idprograma": i,
            "codigosnies": f"SNIES{random.randint(10000, 99999)}",
            "estaactivo": random.choice([True, False]),
            "nivelformacion": random.choice(niveles),
            "nombreprograma": random.choice(nombres_programas),
            "totalsemestres": random.randint(4, 12),
            "idinstitucion": random.randint(1, max_id_institucion)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.15:
            programa["idprograma"] = None
        elif probabilidadError < 0.30:
            programa["codigosnies"] = random.choice([None, "", " snies123"])
        elif probabilidadError < 0.45:
            programa["nombreprograma"] = random.choice(["", None, "  "])
        elif probabilidadError < 0.60:
            programa["nivelformacion"] = random.choice(["PREGRADO", " posgrado", "Maestría"])
        elif probabilidadError < 0.75:
            programa["totalsemestres"] = random.choice([0, -2, None])

        programas.append(programa)

    return programas