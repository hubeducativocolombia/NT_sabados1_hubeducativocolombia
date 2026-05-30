import pandas as pd


def transformar_instituciones(data_frame_limpio):

    # Transformacion 1 (instituciones por naturaleza) → GRÁFICA DE BARRAS
    filtro1 = data_frame_limpio.query("naturaleza == 'publica' or naturaleza == 'privada' or naturaleza == 'mixta'")
    agrupacion1 = filtro1.groupby("naturaleza")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 2 (instituciones registradas después del año 2010) → GRÁFICA DE LÍNEAS
    filtro2 = data_frame_limpio.query("fecharegistro >= '2010-01-01'")
    agrupacion2 = filtro2.groupby("naturaleza")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 3 (naturaleza vs nombre oficial para mapa de calor) → MAPA DE CALOR
    filtro3 = data_frame_limpio.query("idinstitucion > 0")
    agrupacion3 = filtro3.groupby(["naturaleza", "nombreoficial"])["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 4 (instituciones públicas por nombre) → GRÁFICA DE BARRAS
    filtro4 = data_frame_limpio.query("naturaleza == 'publica'")
    agrupacion4 = filtro4.groupby("nombreoficial")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 5 (instituciones privadas registradas antes del 2005) → GRÁFICA DE TORTA
    filtro5 = data_frame_limpio.query("naturaleza == 'privada' and fecharegistro <= '2005-01-01'")
    agrupacion5 = filtro5.groupby("nombreoficial")["idinstitucion"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3,
        "agrupacion4": agrupacion4,
        "agrupacion5": agrupacion5
    }

    return agrupacion_resumen