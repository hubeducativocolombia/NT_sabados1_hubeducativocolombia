import random

def simular_programas_academicos(numeroProgramas):
    
    # Semilla de datos
    listaNombresProgramas = [
        "Psicología",
        "Ingeniería de Sistemas",
        "Administración de Empresas",
        "Derecho",
        "Medicina"
    ]

    listaNivelesFormacion = [
        "Pregrado",
        "Especialización",
        "Maestría",
        "Doctorado",
        "Tecnología"
    ]

    programas_academicos = []

    for i in range(numeroProgramas):
        programa = {
            "idprograma": random.randint(1, 5000),
            "idinstitucion": random.randint(1, 100),
            "codigosnies": random.randint(10000, 99999),
            "nombreprograma": random.choice(listaNombresProgramas),
            "nivelformacion": random.choice(listaNivelesFormacion),
            "totalsemestres": random.randint(2, 12)
        }

        programas_academicos.append(programa)
    
    return programas_academicos