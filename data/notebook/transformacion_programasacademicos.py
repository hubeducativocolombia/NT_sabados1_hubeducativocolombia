import pandas as pd


def transformar_programasacademicos(data_frame_limpio):

    # Transformacion 1 (programas activos por nivel de formacion) → GRÁFICA DE TORTA
    filtro1 = data_frame_limpio.query("estaactivo == True")
    agrupacion1 = filtro1.groupby("nivelformacion")["idprograma"].count().reset_index(name="conteo")

    # Transformacion 2 (conteo de programas por nivel de formacion) → GRÁFICA DE LÍNEAS
    filtro2 = data_frame_limpio.query("totalsemestres > 0")
    agrupacion2 = filtro2.groupby("nivelformacion")["idprograma"].count().reset_index(name="conteo")

    # Transformacion 3 (nivel de formacion vs nombre de programa para mapa de calor) → MAPA DE CALOR
    filtro3 = data_frame_limpio.query("idprograma > 0")
    agrupacion3 = filtro3.groupby(["nivelformacion", "nombreprograma"])["idprograma"].count().reset_index(name="conteo")

    # Transformacion 4 (programas con mas de 8 semestres por nivel) → GRÁFICA DE BARRAS
    filtro4 = data_frame_limpio.query("totalsemestres > 8")
    agrupacion4 = filtro4.groupby("nivelformacion")["idprograma"].count().reset_index(name="conteo")

    # Transformacion 5 (programas inactivos por nombre de programa) → GRÁFICA DE BARRAS
    filtro5 = data_frame_limpio.query("estaactivo == False")
    agrupacion5 = filtro5.groupby("nombreprograma")["idprograma"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3,
        "agrupacion4": agrupacion4,
        "agrupacion5": agrupacion5
    }

    return agrupacion_resumen
