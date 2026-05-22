import pandas as pd

def transform_datos(data_frame_limpio):
    filtro=data_frame_limpio.query("id_detallesOperacion=='Ingenieria de Sistemas'")
    agrupacion=filtro.groupby("fechaActualizacion")["id_programa"].count().reset_index(name="conteo")

    filtro2=data_frame_limpio.query("costo_semestre>=2500000")
    agrupacion2=filtro2.groupby("id_programa")["costo_semestre"].sum().reset_index(name="sumatoria")

    transformacion_resumen={
        "conteoIngenieriaDeSistemasPorFecha":agrupacion,
        "sumatoriaCostosPorProgramaAltoCosto":agrupacion2
    }

    return transformacion_resumen