import pandas as pd

def transformar_instituciones(df_limpio):
    # Transformacion 1 (instituciones por naturaleza)
    agrupacion1 = df_limpio.groupby("naturaleza")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 2 (instituciones registradas por fecha)
    agrupacion2 = df_limpio.groupby("fecharegistro")["idinstitucion"].count().reset_index(name="conteo")

    # Transformacion 3 (naturaleza vs fecha para mapa de calor)
    agrupacion3 = df_limpio.groupby(["naturaleza", "fecharegistro"])["idinstitucion"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen