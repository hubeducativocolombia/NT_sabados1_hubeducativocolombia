import pandas as pd


def transformar_calidadbeneficios(data_frame_limpio):
    # Transformacion 1: programas con acreditacion alta calidad
    filtro1 = data_frame_limpio.query("acreditacionaltacalidad == True")
    agrupacion1 = filtro1.groupby("acreditacionaltacalidad")["idbeneficio"].count().reset_index(name="conteo")

    # Transformacion 2: programas que ofrecen becas y doble titulacion
    filtro2 = data_frame_limpio.query("ofrecebecas == True and dobletitulacion == True")
    agrupacion2 = filtro2.groupby(["ofrecebecas", "dobletitulacion"])["idbeneficio"].count().reset_index(name="conteo")

    # Transformacion 3: programas por combinacion de beneficios
    filtro3 = data_frame_limpio.query("idbeneficio > 0")
    agrupacion3 = filtro3.groupby(["acreditacionaltacalidad", "ofrecebecas", "requieresegundoidioma"])["idbeneficio"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3
    }

    return agrupacion_resumen
