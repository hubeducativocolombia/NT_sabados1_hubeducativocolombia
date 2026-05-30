import pandas as pd


def transformar_sedesinstituciones(data_frame_limpio):

    # Transformacion 1 (sedes por ciudad) → GRÁFICA DE BARRAS
    filtro1 = data_frame_limpio.query("ciudad == 'bogotá' or ciudad == 'medellín' or ciudad == 'cali'")
    agrupacion1 = filtro1.groupby("ciudad")["idsede"].count().reset_index(name="conteo")

    # Transformacion 2 (sedes principales por ciudad) → GRÁFICA DE LÍNEAS
    filtro2 = data_frame_limpio.query("essedeprincipal == True")
    agrupacion2 = filtro2.groupby("ciudad")["idsede"].count().reset_index(name="conteo")

    # Transformacion 3 (ciudad vs tipo de sede para mapa de calor) → MAPA DE CALOR
    filtro3 = data_frame_limpio.query("idsede > 0")
    agrupacion3 = filtro3.groupby(["ciudad", "essedeprincipal"])["idsede"].count().reset_index(name="conteo")

    # Transformacion 4 (sedes secundarias por ciudad) → GRÁFICA DE BARRAS
    filtro4 = data_frame_limpio.query("essedeprincipal == False")
    agrupacion4 = filtro4.groupby("ciudad")["idsede"].count().reset_index(name="conteo")

    # Transformacion 5 (nombre de sede vs ciudad) → GRÁFICA DE TORTA
    filtro5 = data_frame_limpio.query("essedeprincipal == True")
    agrupacion5 = filtro5.groupby("nombresede")["idsede"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3,
        "agrupacion4": agrupacion4,
        "agrupacion5": agrupacion5
    }

    return agrupacion_resumen