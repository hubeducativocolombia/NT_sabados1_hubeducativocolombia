# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : transformacion_usuario.py
# PROPÓSITO  : Transformar los datos obtenidos de los servicios RESTful para la tabla 'usuarios'
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : random, datetime
#
# =============================================================================

import pandas as pd

def transformar_datos(data_frame_limpio):
    filtro1=data_frame_limpio.query("rol=='ADMIN'")
    agrupacion1=filtro1.groupby("fechacreacion")["idusuario"].count().reset_index(name="contarrol")
    
    filtro2=data_frame_limpio.query("ocupacion=='ASPIRANTE'")
    agrupacion2=filtro2.groupby("fechacreacion")["idusuario"].count().reset_index(name="contarocupacion")

    # Diccionario para almacenar los resultados de las transformaciones:
    transformacion_resumen={
        "contarrol": agrupacion1,
        "contarocupacion": agrupacion2
    }

    return transformacion_resumen
    