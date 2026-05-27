import pandas as pd


def transformar_instituciones(data_frame_limpio):
    # Transformacion 1: contar instituciones por naturaleza
    filtro1 = data_frame_limpio.query("naturaleza == 'oficial' or naturaleza == 'privada'")
    agrupacion1 = filtro1.groupby("naturaleza")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 2: instituciones registradas despues del año 2010
    filtro2 = data_frame_limpio.query("fecharegistro >= '2010-01-01'")
    agrupacion2 = filtro2.groupby("naturaleza")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 3: contar instituciones por nombre oficial y naturaleza
    filtro3 = data_frame_limpio.query("naturaleza == 'oficial'")
    agrupacion3 = filtro3.groupby(["nombreoficial", "naturaleza"])["idinstitucion"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen
