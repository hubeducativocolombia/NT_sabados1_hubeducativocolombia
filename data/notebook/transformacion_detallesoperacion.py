import pandas as pd


def transformar_detallesoperacion(data_frame_limpio):
    # Transformacion 1: contar detalles por modalidad
    filtro1 = data_frame_limpio.query("modalidad == 'presencial' or modalidad == 'virtual'")
    agrupacion1 = filtro1.groupby("modalidad")["iddetalle"].count().reset_index(name="conteo")

    # Transformacion 2: costo promedio por jornada
    filtro2 = data_frame_limpio.query("costosemestre >= 1500000")
    agrupacion2 = filtro2.groupby("jornada")["costosemestre"].mean().reset_index(name="promedio_costo")

    # Transformacion 3: estudiantes activos por modalidad y jornada
    filtro3 = data_frame_limpio.query("estudiantesactivos > 0")
    agrupacion3 = filtro3.groupby(["modalidad", "jornada"])["estudiantesactivos"].sum().reset_index(name="total_estudiantes")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen