import pandas as pd

def limpiar_simulacion(data_frame_sucio):
    data_frame_limpio=data_frame_sucio.copy()

    #1. Limpiar las columnas del DF que son palabras (Strings)
    columnas_texto=["id_programa","costo"]
    for columna in columnas_texto:
        data_frame_limpio[columna]=data_frame_limpio[columna].astype("string").str.strip()

    #2. Definir valores esperados
    servicios_validos=["Ingenieria de Sistemas","Contador","Diseñador","Economista","Administracion de Empresas"]
    data_frame_limpio["id_programa"]=data_frame_limpio["id_programa"].where(data_frame_limpio["id_programa"].isin(servicios_validos),pd.NA
    )

    #3. Evaluar columnas numericas
    data_frame_limpio["id_programa"]=pd.to_numeric(data_frame_limpio["id_programa"])
    data_frame_limpio["costo"]=pd.to_numeric(data_frame_limpio["costo"])

    #4. Evaluar columnas de fechas
    data_frame_limpio["fecha"]=pd.to_datetime(data_frame_limpio["fecha"])

    #5. Reemplazar fechas nulas con la fehca por default
    fecha_default=pd.to_datetime("2026-01-01")
    data_frame_limpio["fecha"]=data_frame_limpio["fecha"].fillna(fecha_default)

    #6. Eliminar registros nulos de campos obligatorios
    columnas_obligatorias=["id_programas","costo"]
    data_frame_limpio=data_frame_limpio.dropna(subset=columnas_obligatorias)

    #7. Eliminar valores invalidos a nivel numerico
    data_frame_limpio=data_frame_limpio[data_frame_limpio["id_programa"]>0]
    data_frame_limpio=data_frame_limpio[data_frame_limpio["costo"]>100000]

    #8. Eliminar valores duplicados
    data_frame_limpio=data_frame_limpio.drop_duplicates()

    return data_frame_limpio