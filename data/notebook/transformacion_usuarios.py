import pandas as pd


def transformar_usuarios(data_frame_limpio):
    # Transformacion 1: contar usuarios por rol
    filtro1 = data_frame_limpio.query("rol == 'ADMIN' or rol == 'UNIVERSIDAD' or rol == 'ASPIRANTE'")
    agrupacion1 = filtro1.groupby("rol")["idusuario"].count().reset_index(name="conteo")

    # Transformacion 2: usuarios activos por ocupacion
    filtro2 = data_frame_limpio.query("estaactivo == 1")
    agrupacion2 = filtro2.groupby("ocupacion")["idusuario"].count().reset_index(name="conteo")

    # Transformacion 3: usuarios por rol y estado activo
    filtro3 = data_frame_limpio.query("idusuario > 0")
    agrupacion3 = filtro3.groupby(["rol", "estaactivo"])["idusuario"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen