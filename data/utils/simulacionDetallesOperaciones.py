import random

from datetime import datetime, timedelta

def simular_detallesOperacion(numerodetallesOperacion):
    
    #Semilla de datos
    id_detallesOperacion=["Ingenieria de Sistemas","Contador","Diseñador","Economista","Administracion de Empresas"]

    listaIdPrograma=["AM123","AM124","AM125","AM126","AM127"]

    fechaInicial=datetime(1971,2,4)

    servicios = []

    for i in range(numerodetallesOperacion):
        fechaSimulada=fechaInicial + timedelta(days=random.randint(0,60))
        servicio={
            "id_programa":random.choice(listaIdPrograma),
            "costo_semestre":random.randint(3500000,5000000),
            "modalidad":random.choice(["presencial","virtual","hibrida"]),
            "jornada":random.choice(["diurna","nocturna"]),
            "fechaActualización":fechaSimulada.strftime("%Y/%m/%d"),
            "estudiantes_activos":random.randint(100,500),
            "id_detallesOperacion":random.choice(id_detallesOperacion)
        }

        #Inyectando errores controlados
        probabilidad_error=random.random()
        if probabilidad_error <0.1:
            servicio["id"]=random.choice([None,-1,0])
            servicio["servicio"]=" "+servicio["servicio"]+" "
        elif probabilidad_error <0.25:
            servicio["fechaActualización"]=None
        elif probabilidad_error <0.4:
            servicio["id_programa"]=servicio["id_programa"].lower()
            servicio["costo_semestre"]=random.choice([-100000,0,200])
            servicio["id"]=None
        elif probabilidad_error <0.7:
            servicio["costo_semestre"]=0;
        elif probabilidad_error <0.9:
            servicio["servicio"]=random.choice(["papitas montañeras","gaseosa doble"])

        servicios.append(servicio)
    
    return servicios