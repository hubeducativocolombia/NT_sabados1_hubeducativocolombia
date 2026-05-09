import random

def simular_sedes(numeroSedes):

    listaNombresSedes = ["Sede Norte", "Sede Sur", "Sede Centro", "Sede Oriente", "Sede Occidente"]
    listaCiudades = ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"]
    listaDirecciones = ["Cra 15 #23-10", "Cll 45 #12-30", "Av 68 #5-20", "Cra 7 #80-15", "Cll 100 #50-40"]

    sedes = []

    for _ in range(numeroSedes):
        sede = {
            "id_sede": random.randint(0, 500),
            "id_institucion": random.randint(0, 500),
            "nombre_sede": random.choice(listaNombresSedes),
            "ciudad": random.choice(listaCiudades),
            "direccion_fisica": random.choice(listaDirecciones),
            "es_sede_principal": random.choice([0, 1])
        }

        # Ejecutando errores controlados
        probabilidadError = random.random()
        if probabilidadError < 0.1:
            sede["id_sede"] = random.choice([None, -1, 0])
            sede["id_institucion"] = random.choice([None, -1, 0])
        elif probabilidadError < 0.25:
            sede["ciudad"] = None
            sede["direccion_fisica"] = None
        elif probabilidadError < 0.4:
            sede["nombre_sede"] = " " + sede["nombre_sede"] + " "
            sede["ciudad"] = sede["ciudad"].lower()
        elif probabilidadError < 0.7:
            sede["es_sede_principal"] = random.choice([None, 99, -1])
        elif probabilidadError < 0.9:
            sede["nombre_sede"] = random.choice(["Sede Invalida", "N/A", "???"])
            sede["direccion_fisica"] = random.choice(["", "  ", "N/A"])

        sedes.append(sede)

    return sedes