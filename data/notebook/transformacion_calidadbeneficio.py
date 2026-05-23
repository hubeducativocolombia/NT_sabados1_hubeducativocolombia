# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : transformacion_calidadbeneficio.py
# PROPÓSITO  : Transformar los datos obtenidos de los servicios RESTful para la tabla 'usuarios'
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : random, datetime
#
# =============================================================================

import pandas as pd

def transformar_datos(data_frame_limpio):
    filtro1=data_frame_limpio.query("ofrecebecas==true")
    agrupacion1=filtro1.groupby("ofrecebecas")["idbeneficio"].count().reset_index(name="becas")
    
    filtro2=data_frame_limpio.query("acreditacionaltacalidad==true")
    agrupacion2=filtro2.groupby("acreditacionaltacalidad")["idbeneficio"].count().reset_index(name="acreditacion")

    # Diccionario para almacenar los resultados de las transformaciones:
    transformacion_resumen={
        "becas": agrupacion1,
        "acreditacion": agrupacion2
    }

    return transformacion_resumen
    