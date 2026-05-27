import pandas as pd


def transformar_sedesinstituciones(data_frame_limpio):
    # Transformacion 1: contar sedes por ciudad
    filtro1 = data_frame_limpio.query("ciudad == 'bogotá' or ciudad == 'medellín' or ciudad == 'cali'")
    agrupacion1 = filtro1.groupby("ciudad")["idsede"].count().reset_index(name="conteo")

    # Transformacion 2: sedes principales por ciudad
    filtro2 = data_frame_limpio.query("essedeprincipal == True")
    agrupacion2 = filtro2.groupby("ciudad")["idsede"].count().reset_index(name="conteo")

    # Transformacion 3: sedes por ciudad y tipo (principal vs secundaria)
    filtro3 = data_frame_limpio.query("idsede > 0")
    agrupacion3 = filtro3.groupby(["ciudad", "essedeprincipal"])["idsede"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen
