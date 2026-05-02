import panda as pd

def limpiar_simulacion(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    #1. Limpiar las columnas del DF que son palabras (Strings)
        #columnas_texto=["Aquí hay que meter los nombres de las columnas que son palabras separados por comas y en formato string con comillas dobles"]

    #for columna in columnas_texto:
        #data_frame_limpio[columna] = data_frame_limpio[columna].astype("string").str.strip()


    #2. Definir valores esperados
    nombres_programas_validos = ["Psicología",
        "Ingeniería de Sistemas",
        "Administración de Empresas",
        "Derecho",
        "Medicina"]
    niveles_formacion_validos = ["Pregrado",
        "Especialización", 
        "Maestría",
        "Doctorado"
        "Tecnología"]
    
    data_frame_limpio ["nombres_programas_validos"] = data_frame_limpio["nombres_programas_validos"].where(
        data_frame_limpio["nombres_programas_validos"].isin(nombres_programas_validos),
        pd.NA
    )
    data_frame_limpio ["niveles_formacion_validos"] = data_frame_limpio["niveles_formacion_validos"].where(
        data_frame_limpio["niveles_formacion_validos"].isin(niveles_formacion_validos),
        pd.NA
    )


    #3. Evaluar valores numéricos
    data_frame_limpio ["idprograma"] = pd.to_numeric(data_frame_limpio["idprograma"])
    data_frame_limpio ["idinstitucion"] = pd.to_numeric(data_frame_limpio["idinstitucion"])
    data_frame_limpio ["codigosnies"] = pd.to_numeric(data_frame_limpio["codigosnies"])
    data_frame_limpio ["totalsemestres"] = pd.to_numeric(data_frame_limpio["totalsemestres"])


    #4. Evaluar las columnas de fechas
        #data_frame_limpio ["fecha_inicio"] = pd.to_datetime(data_frame_limpio["fecha_inicio"])

    #5. reemplazar fechas nulas por fechas por default
        #fecha_default = pd.to_datetime("2000-01-01")
        #data_frame_limpio["fecha_inicio"] = data_frame_limpio["fecha_inicio"].fillna(fecha_default)

    #6. Eliminar registros nulos de campos obligatorios
    columnas_obligatorias = ["idprograma", "idinstitucion", "codigosnies", "nombreprograma", "nivelformacion", "totalsemestres"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    #7. Eliminar valores invalidos a nivel numérico
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idprograma"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idinstitucion"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["codigosnies"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["totalsemestres"] > 0]

    #8. Eliminar registros duplicados
    data_frame_limpio = data_frame_limpio.drop_duplicates()

    return data_frame_limpio