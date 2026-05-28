import random


def generar_calidadbeneficios(numeroSimulaciones, max_id_programa):
    beneficios = []

    for i in range(1, numeroSimulaciones + 1):
        beneficio = {
            "idbeneficio": i,
            "acreditacionaltacalidad": random.choice([True, False]),
            "dobletitulacion": random.choice([True, False]),
            "ofrecebecas": random.choice([True, False]),
            "requieresegundoidioma": random.choice([True, False]),
            "idprograma": random.randint(1, max_id_programa)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.15:
            beneficio["idbeneficio"] = None
        elif probabilidadError < 0.30:
            beneficio["acreditacionaltacalidad"] = random.choice(["si", "no", None, 1, 0])
        elif probabilidadError < 0.45:
            beneficio["dobletitulacion"] = random.choice(["si", "no", None, 1, 0])
        elif probabilidadError < 0.60:
            beneficio["ofrecebecas"] = random.choice(["si", "no", None, 1, 0])
        elif probabilidadError < 0.75:
            beneficio["requieresegundoidioma"] = random.choice(["si", "no", None, 1, 0])

        beneficios.append(beneficio)

    return beneficios
