import pandas as pd

def transform_datos(data_frame_limpio):
    filtro=data_frame_limpio.query("id_programa=='Ingenieria de Sistemas'")
    agrupacion=filtro.groupby("fecha")["id"].count().reset_index(name="conteo")

    filtro2=data_frame_limpio.query("costo>=250000")
    agrupacion2=filtro2.groupby("id_programa")["costo"].sum().reset_index(name="sumatoria")

    transformacion_resumen={
        "conteoIngenieriaDeSistemasPorFecha":agrupacion,
        "sumatoriaCostosPorProgramaAltoCosto":agrupacion2
    }

    return transformacion_resumen