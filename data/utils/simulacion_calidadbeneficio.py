import random

def generar_simulacion(numeroSimulaciones):
    simulaciones = []

    for i in range(numeroSimulaciones):
        beneficio = {
            "idbeneficio": i + 1,
            "acreditacionaltacalidad": random.choice([True, False]),
            "dobletitulacion": random.choice([True, False]),
            "idprograma": random.randint(1, 50),
            "ofrecebecas": random.choice([True, False]),
            "requieresegundoidioma": random.choice([True, False]),
            "pkidprograma": random.randint(1, 50)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.2:
            beneficio["idbeneficio"] = None
        elif probabilidadError < 0.4:
            beneficio["acreditacionaltacalidad"] = random.choice([None, "si", "no", 2])
        elif probabilidadError < 0.5:
            beneficio["dobletitulacion"] = random.choice([None, "si", "no", 2])
        elif probabilidadError < 0.6:
            beneficio["ofrecebecas"] = random.choice([None, "si", "no", 2])
        elif probabilidadError < 0.7:
            beneficio["requieresegundoidioma"] = random.choice([None, "si", "no", 2])
        elif probabilidadError < 0.9:
            beneficio["idprograma"] = random.choice([None, -1, 0])

        simulaciones.append(beneficio)

    return simulaciones