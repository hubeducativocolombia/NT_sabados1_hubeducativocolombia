import random


def generar_sedes(numeroSimulaciones, max_id_institucion):
    nombres_sedes = [
        "Sede Principal",
        "Sede Norte",
        "Sede Sur",
        "Sede Centro",
        "Sede Occidente",
        "Sede Palmira",
        "Sede Medellín",
        "Sede Bogotá"
    ]
    ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Manizales", "Pereira"]
    direcciones = [
        "Calle 45 # 26-85",
        "Carrera 30 # 45-03",
        "Avenida El Dorado # 44-02",
        "Calle 67 # 53-108",
        "Carrera 13 # 32-76"
    ]
    sedes = []

    for i in range(1, numeroSimulaciones + 1):
        sede = {
            "idsede": i,
            "ciudad": random.choice(ciudades),
            "direccionfisica": random.choice(direcciones),
            "essedeprincipal": random.choice([True, False]),
            "nombresede": random.choice(nombres_sedes),
            "idinstitucion": random.randint(1, max_id_institucion)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.15:
            sede["idsede"] = None
        elif probabilidadError < 0.30:
            sede["ciudad"] = random.choice(["bogotá", "MEDELLÍN", " Cali", None])
        elif probabilidadError < 0.45:
            sede["direccionfisica"] = random.choice([None, "", "sin dirección"])
        elif probabilidadError < 0.60:
            sede["nombresede"] = random.choice(["", None, "  "])
        elif probabilidadError < 0.75:
            sede["essedeprincipal"] = random.choice([None, "si", "no"])

        sedes.append(sede)

    return sedes