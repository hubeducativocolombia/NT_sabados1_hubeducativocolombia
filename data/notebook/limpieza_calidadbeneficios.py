import pandas as pd


def limpiar_calidadbeneficios(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de datos numéricos
    # 1. Verificar que idbeneficio e idprograma sean numéricos
    data_frame_limpio["idbeneficio"] = pd.to_numeric(data_frame_limpio["idbeneficio"], errors="coerce")
    data_frame_limpio["idprograma"] = pd.to_numeric(data_frame_limpio["idprograma"], errors="coerce")

    # 2. Verificar que sean positivos
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idbeneficio"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idprograma"] > 0]

    # Limpieza de booleanos
    # 1. Convertir todos los campos booleanos a True/False real
    mapa_booleano = {True: True, False: False, "si": True, "no": False, 1: True, 0: False}
    data_frame_limpio["acreditacionaltacalidad"] = data_frame_limpio["acreditacionaltacalidad"].map(mapa_booleano)
    data_frame_limpio["dobletitulacion"] = data_frame_limpio["dobletitulacion"].map(mapa_booleano)
    data_frame_limpio["ofrecebecas"] = data_frame_limpio["ofrecebecas"].map(mapa_booleano)
    data_frame_limpio["requieresegundoidioma"] = data_frame_limpio["requieresegundoidioma"].map(mapa_booleano)

    # Novedades: eliminar filas con columnas obligatorias vacías
    columnas_obligatorias = ["idbeneficio", "acreditacionaltacalidad", "dobletitulacion", "ofrecebecas", "requieresegundoidioma", "idprograma"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio