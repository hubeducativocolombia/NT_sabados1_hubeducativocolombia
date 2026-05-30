import pandas as pd


def transformar_detallesoperacion(data_frame_limpio):

    # Transformacion 1 (detalles por modalidad) → GRÁFICA DE TORTA
    filtro1 = data_frame_limpio.query("modalidad == 'presencial' or modalidad == 'virtual'")
    agrupacion1 = filtro1.groupby("modalidad")["iddetalle"].count().reset_index(name="conteo")

    # Transformacion 2 (conteo de programas por jornada) → GRÁFICA DE BARRAS
    filtro2 = data_frame_limpio.query("costosemestre > 0")
    agrupacion2 = filtro2.groupby("jornada")["iddetalle"].count().reset_index(name="conteo")

    # Transformacion 3 (modalidad vs jornada para mapa de calor) → MAPA DE CALOR
    filtro3 = data_frame_limpio.query("estudiantesactivos > 0")
    agrupacion3 = filtro3.groupby(["modalidad", "jornada"])["estudiantesactivos"].sum().reset_index(name="total_estudiantes")

    # Transformacion 4 (programas con mas de 200 estudiantes activos) → GRÁFICA DE BARRAS
    filtro4 = data_frame_limpio.query("estudiantesactivos > 200")
    agrupacion4 = filtro4.groupby("jornada")["iddetalle"].count().reset_index(name="conteo")

    # Transformacion 5 (programas costosos actualizados después de 2024) → GRÁFICA DE BARRAS
    filtro5 = data_frame_limpio.query("costosemestre >= 8000000 and fechaactualizacion >= '2024-01-01'")
    agrupacion5 = filtro5.groupby("modalidad")["iddetalle"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3,
        "agrupacion4": agrupacion4,
        "agrupacion5": agrupacion5
    }

    return agrupacion_resumen
