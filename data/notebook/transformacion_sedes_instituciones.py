import pandas as pd

def transformar_sedes(df_limpio):
    # Transformacion 1 (sedes por ciudad)
    agrupacion1 = df_limpio.groupby("ciudad")["idsede"].count().reset_index(name="conteo")

    # Transformacion 2 (sedes principales por institucion)
    filtro2 = df_limpio.query("essedepprincipal == True")
    agrupacion2 = filtro2.groupby("idinstitucion")["idsede"].count().reset_index(name="conteo")

    # Transformacion 3 (sedes por ciudad e institucion para mapa de calor)
    agrupacion3 = df_limpio.groupby(["ciudad", "idinstitucion"])["idsede"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen