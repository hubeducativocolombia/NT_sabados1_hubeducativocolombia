import random

def generar_simulacion(numeroSimulaciones):
    nombres_programas = [
        "Ingenieria de Sistemas",
        "Administracion de Empresas",
        "Medicina",
        "Derecho",
        "Psicologia"
    ]
    niveles_formacion = ["tecnico", "tecnologo", "profesional", "especializacion", "maestria", "doctorado"]
    simulaciones = []

    for i in range(numeroSimulaciones):
        programa = {
            "idprograma": i + 1,
            "codigosnies": f"SNIES{random.randint(10000, 99999)}",
            "estaactivo": random.choice([True, False]),
            "idinstitucion": random.randint(1, 50),
            "nivelformacion": random.choice(niveles_formacion),
            "nombreprograma": random.choice(nombres_programas),
            "totalsemestres": random.randint(4, 12),
            "pkidinstitucion": random.randint(1, 50)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.2:
            programa["idprograma"] = None
        elif probabilidadError < 0.4:
            programa["codigosnies"] = random.choice(["   ", "INVALIDO", None])
        elif probabilidadError < 0.5:
            programa["nombreprograma"] = None
        elif probabilidadError < 0.6:
            programa["nivelformacion"] = random.choice(["basico", "avanzado", "123"])
        elif probabilidadError < 0.7:
            programa["totalsemestres"] = random.choice([0, -1, None])
        elif probabilidadError < 0.8:
            programa["estaactivo"] = random.choice([None, "si", "no"])
        elif probabilidadError < 0.9:
            programa["idinstitucion"] = random.choice([None, -1, 0])

        simulaciones.append(programa)

    return simulaciones