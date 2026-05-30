import pandas as pd


def transformar_usuarios(data_frame_limpio):

    # Transformacion 1 (usuarios por rol) → GRÁFICA DE TORTA
    filtro1 = data_frame_limpio.query("rol == 'Master' or rol == 'Admin' or rol == 'User'")
    agrupacion1 = filtro1.groupby("rol")["idusuario"].count().reset_index(name="conteo")

    # Transformacion 2 (usuarios activos por ocupacion) → GRÁFICA DE LÍNEAS
    filtro2 = data_frame_limpio.query("estaactivo == 1")
    agrupacion2 = filtro2.groupby("ocupacion")["idusuario"].count().reset_index(name="conteo")

    # Transformacion 3 (rol vs estado activo para mapa de calor) → MAPA DE CALOR
    filtro3 = data_frame_limpio.query("idusuario > 0")
    agrupacion3 = filtro3.groupby(["rol", "estaactivo"])["idusuario"].count().reset_index(name="conteo")

    # Transformacion 4 (usuarios creados después de 2025-06-01) → GRÁFICA DE BARRAS
    filtro4 = data_frame_limpio.query("fechacreacion >= '2025-06-01'")
    agrupacion4 = filtro4.groupby("ocupacion")["idusuario"].count().reset_index(name="conteo")

    # Transformacion 5 (usuarios Admin y Master activos por ocupacion) → GRÁFICA DE BARRAS
    filtro5 = data_frame_limpio.query("(rol == 'Admin' or rol == 'Master') and estaactivo == 1")
    agrupacion5 = filtro5.groupby(["rol", "ocupacion"])["idusuario"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3,
        "agrupacion4": agrupacion4,
        "agrupacion5": agrupacion5
    }

    return agrupacion_resumen