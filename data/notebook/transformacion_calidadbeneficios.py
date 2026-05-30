import pandas as pd


def transformar_calidadbeneficios(data_frame_limpio):

    # Transformacion 1 (programas con acreditacion alta calidad) → GRÁFICA DE TORTA
    filtro1 = data_frame_limpio.query("acreditacionaltacalidad == True")
    agrupacion1 = filtro1.groupby("acreditacionaltacalidad")["idbeneficio"].count().reset_index(name="conteo")

    # Transformacion 2 (programas que ofrecen becas y doble titulacion) → GRÁFICA DE BARRAS
    filtro2 = data_frame_limpio.query("ofrecebecas == True and dobletitulacion == True")
    agrupacion2 = filtro2.groupby(["ofrecebecas", "dobletitulacion"])["idbeneficio"].count().reset_index(name="conteo")

    # Transformacion 3 (acreditacion vs becas para mapa de calor) → MAPA DE CALOR
    filtro3 = data_frame_limpio.query("idbeneficio > 0")
    agrupacion3 = filtro3.groupby(["acreditacionaltacalidad", "ofrecebecas"])["idbeneficio"].count().reset_index(name="conteo")

    # Transformacion 4 (programas que requieren segundo idioma y tienen becas) → GRÁFICA DE BARRAS
    filtro4 = data_frame_limpio.query("requieresegundoidioma == True and ofrecebecas == True")
    agrupacion4 = filtro4.groupby(["requieresegundoidioma", "ofrecebecas"])["idbeneficio"].count().reset_index(name="conteo")

    # Transformacion 5 (combinacion completa de beneficios) → GRÁFICA DE LÍNEAS
    filtro5 = data_frame_limpio.query("acreditacionaltacalidad == True and dobletitulacion == True")
    agrupacion5 = filtro5.groupby(["acreditacionaltacalidad", "dobletitulacion", "ofrecebecas"])["idbeneficio"].count().reset_index(name="conteo")

    agrupacion_resumen = {
        "agrupacion1": agrupacion1,
        "agrupacion2": agrupacion2,
        "agrupacion3": agrupacion3,
        "agrupacion4": agrupacion4,
        "agrupacion5": agrupacion5
    }

    return agrupacion_resumen