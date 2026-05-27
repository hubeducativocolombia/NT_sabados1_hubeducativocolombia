import pandas as pd


def transformar_programasacademicos(data_frame_limpio):
    # Transformacion 1: contar programas por nivel de formacion
    filtro1 = data_frame_limpio.query("estaactivo == True")
    agrupacion1 = filtro1.groupby("nivelformacion")["idprograma"].count().reset_index(name="conteo")

    # Transformacion 2: promedio de semestres por nivel de formacion
    filtro2 = data_frame_limpio.query("totalsemestres > 0")
    agrupacion2 = filtro2.groupby("nivelformacion")["totalsemestres"].mean().reset_index(name="promedio_semestres")

    # Transformacion 3: programas por nivel de formacion e institucion
    filtro3 = data_frame_limpio.query("idprograma > 0")
    agrupacion3 = filtro3.groupby(["nivelformacion", "idinstitucion"])["idprograma"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen