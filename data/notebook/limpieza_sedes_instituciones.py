import pandas as pd

def limpiar_sedes(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de textos
    data_frame_limpio["nombre_sede"] = data_frame_limpio["nombre_sede"].astype("string").str.strip()
    data_frame_limpio["ciudad"] = data_frame_limpio["ciudad"].astype("string").str.strip().str.capitalize()
    data_frame_limpio["direccion_fisica"] = data_frame_limpio["direccion_fisica"].astype("string").str.strip()

    # Valores esperados
    valores_esperados_sede = ["Sede Norte", "Sede Sur", "Sede Centro", "Sede Oriente", "Sede Occidente"]
    data_frame_limpio["nombre_sede"] = data_frame_limpio["nombre_sede"].where(
        data_frame_limpio["nombre_sede"].isin(valores_esperados_sede),
        pd.NA
    )

    valores_esperados_ciudad = ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena"]
    data_frame_limpio["ciudad"] = data_frame_limpio["ciudad"].where(
        data_frame_limpio["ciudad"].isin(valores_esperados_ciudad),
        pd.NA
    )

    # Limpieza numerica
    data_frame_limpio["id_sede"] = pd.to_numeric(data_frame_limpio["id_sede"], errors="coerce")
    data_frame_limpio["id_institucion"] = pd.to_numeric(data_frame_limpio["id_institucion"], errors="coerce")
    data_frame_limpio = data_frame_limpio[data_frame_limpio["id_sede"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["id_institucion"] > 0]

    # Limpieza es_sede_principal
    data_frame_limpio["es_sede_principal"] = pd.to_numeric(data_frame_limpio["es_sede_principal"], errors="coerce")
    data_frame_limpio = data_frame_limpio[data_frame_limpio["es_sede_principal"].isin([0, 1])]

    # Eliminar filas con datos obligatorios vacios
    columnas_obligatorias = ["id_sede", "id_institucion", "nombre_sede", "ciudad"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio