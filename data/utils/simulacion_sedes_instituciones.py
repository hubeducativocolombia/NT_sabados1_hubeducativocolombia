import random

def generar_simulacion(numeroSimulaciones):
    ciudades = ["Bogota", "Medellin", "Cali", "Barranquilla", "Bucaramanga"]
    nombres_sedes = ["Sede Principal", "Sede Norte", "Sede Sur", "Sede Centro", "Sede Occidente"]
    direcciones = [
        "Calle 45 # 26-85",
        "Carrera 7 # 40-62",
        "Avenida El Poblado # 5-75",
        "Calle 100 # 15-30",
        "Carrera 50 # 18-20"
    ]

    simulaciones = []

    for i in range(numeroSimulaciones):
        sede = {
            "idsede": i + 1,
            "ciudad": random.choice(ciudades),
            "direccionfisica": random.choice(direcciones),
            "essedepprincipal": random.choice([True, False]),
            "idinstitucion": random.randint(1, 50),
            "nombresede": random.choice(nombres_sedes),
            "pkidinstitucion": random.randint(1, 50)
        }

        # Inyectando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.2:
            sede["idsede"] = None
        elif probabilidadError < 0.4:
            sede["ciudad"] = random.choice(["Ciudad Inventada", "   ", "123"])
        elif probabilidadError < 0.5:
            sede["nombresede"] = None
        elif probabilidadError < 0.7:
            sede["direccionfisica"] = " " + sede["direccionfisica"].upper()
        elif probabilidadError < 0.9:
            sede["essedepprincipal"] = random.choice([None, "si", "no"])

        simulaciones.append(sede)

    return simulaciones