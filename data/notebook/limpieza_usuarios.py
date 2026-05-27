# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : limpieza_usuarios.py
# PROPÓSITO  : Limpiar y validar los datos simulados (sucios) generados por
#              simulacion_usuarios.py para la tabla 'usuarios' de MySQL.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : pandas
#
# NOTAS PEDAGÓGICAS:
#   - Cada bloque de limpieza corrige un tipo de error generado en simulacion_usuarios.py.
#   - Se usa .copy() para no mutar el DataFrame original (buena práctica).
#   - Las columnas obligatorias se validan al final con dropna().
#   - Los correos duplicados se eliminan conservando la primera aparición.
#   - Se respetan las restricciones CHECK e integridad del esquema SQL.
# =============================================================================

import pandas as pd


def limpiar_usuarios(data_frame_sucio: pd.DataFrame) -> pd.DataFrame:
    """
    Limpia y valida un DataFrame con datos de la tabla 'usuarios' generados
    por simulacion_usuarios.py. Corrige los cinco tipos de errores controlados.

    Errores corregidos (referencia simulacion_usuarios.py):
        - Error tipo 1: correo sin '@' + idusuario nulo
        - Error tipo 2: rol fuera del CHECK constraint + fechacreacion nula
        - Error tipo 3: espacios en nombre + hashcontrasena vacío + estaactivo=-1
        - Error tipo 4: correo duplicado (violación UNIQUE) + estaactivo=0
        - Error tipo 5: nombrecompleto vacío + idusuario nulo o negativo

    Parámetros:
        data_frame_sucio (pd.DataFrame): DataFrame con los registros sin limpiar.

    Retorna:
        pd.DataFrame: DataFrame limpio, listo para inserción en MySQL.
    """

    data_frame_limpio = data_frame_sucio.copy()

    # -------------------------------------------------------------------------
    # LIMPIEZA DE TEXTOS
    # -------------------------------------------------------------------------

    # 1. Normalizar 'nombrecompleto'
    data_frame_limpio["nombrecompleto"] = (
        data_frame_limpio["nombrecompleto"]
        .astype("string")
        .str.strip()
        .str.title()
    )
    data_frame_limpio["nombrecompleto"] = data_frame_limpio["nombrecompleto"].replace("", pd.NA)

    # 2. Normalizar 'correoelectronico'
    data_frame_limpio["correoelectronico"] = (
        data_frame_limpio["correoelectronico"]
        .astype("string")
        .str.strip()
        .str.lower()
    )

    # 3. Validar formato mínimo del correo
    mascara_correo_invalido = ~(
        data_frame_limpio["correoelectronico"].str.contains("@", na=False) &
        data_frame_limpio["correoelectronico"].str.contains(r"\.", na=False)
    )
    data_frame_limpio.loc[mascara_correo_invalido, "correoelectronico"] = pd.NA

    # 4. Normalizar 'rol'
    data_frame_limpio["rol"] = (
        data_frame_limpio["rol"]
        .astype("string")
        .str.strip()
        .str.upper()
    )
    roles_validos = ["ADMIN", "UNIVERSIDAD", "ASPIRANTE"]
    data_frame_limpio["rol"] = data_frame_limpio["rol"].where(
        data_frame_limpio["rol"].isin(roles_validos),
        pd.NA
    )

    # 5. Normalizar 'hashcontrasena'
    data_frame_limpio["hashcontrasena"] = (
        data_frame_limpio["hashcontrasena"]
        .astype("string")
        .str.strip()
        .replace("", pd.NA)
    )

    # 6. Normalizar 'ocupacion'
    data_frame_limpio["ocupacion"] = (
        data_frame_limpio["ocupacion"]
        .astype("string")
        .str.strip()
        .str.lower()
    )
    ocupaciones_validas = ["estudiante", "docente", "administrativo", "investigador", "egresado"]
    data_frame_limpio["ocupacion"] = data_frame_limpio["ocupacion"].where(
        data_frame_limpio["ocupacion"].isin(ocupaciones_validas),
        pd.NA
    )

    # -------------------------------------------------------------------------
    # LIMPIEZA DE DATOS NUMÉRICOS
    # -------------------------------------------------------------------------

    # 1. Verificar que 'idusuario' sea numérico
    data_frame_limpio["idusuario"] = pd.to_numeric(
        data_frame_limpio["idusuario"], errors="coerce"
    )

    # 2. Validar que 'idusuario' sea estrictamente positivo
    data_frame_limpio = data_frame_limpio[
        data_frame_limpio["idusuario"].isna() | (data_frame_limpio["idusuario"] > 0)
    ]

    # 3. Verificar que 'estaactivo' esté dentro del rango TINYINT(1): {0, 1}
    data_frame_limpio["estaactivo"] = pd.to_numeric(
        data_frame_limpio["estaactivo"], errors="coerce"
    )
    data_frame_limpio["estaactivo"] = data_frame_limpio["estaactivo"].where(
        data_frame_limpio["estaactivo"].isin([0, 1]),
        pd.NA
    )

    # -------------------------------------------------------------------------
    # LIMPIEZA DE FECHAS
    # -------------------------------------------------------------------------

    # 1. Verificar que 'fechacreacion' sea una fecha válida
    data_frame_limpio["fechacreacion"] = pd.to_datetime(
        data_frame_limpio["fechacreacion"], errors="coerce"
    )

    # 2. Reemplazar fechas nulas por fecha por defecto
    fecha_default = pd.to_datetime("2025-01-01")
    data_frame_limpio["fechacreacion"] = data_frame_limpio["fechacreacion"].fillna(fecha_default)

    # 3. Verificar que 'fechamodificacion' sea una fecha válida
    data_frame_limpio["fechamodificacion"] = pd.to_datetime(
        data_frame_limpio["fechamodificacion"], errors="coerce"
    )

    # 4. Reemplazar fechas nulas por fecha por defecto
    data_frame_limpio["fechamodificacion"] = data_frame_limpio["fechamodificacion"].fillna(fecha_default)

    # -------------------------------------------------------------------------
    # ELIMINACIÓN DE DUPLICADOS
    # -------------------------------------------------------------------------

    data_frame_limpio = data_frame_limpio.drop_duplicates(
        subset=["correoelectronico"], keep="first"
    )

    # -------------------------------------------------------------------------
    # NOVEDADES: ELIMINAR FILAS CON CAMPOS OBLIGATORIOS VACÍOS
    # -------------------------------------------------------------------------

    columnas_obligatorias = [
        "idusuario",
        "nombrecompleto",
        "correoelectronico",
        "hashcontrasena",
        "rol",
        "estaactivo",
    ]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    # -------------------------------------------------------------------------
    # REINDEXAR
    # -------------------------------------------------------------------------
    data_frame_limpio = data_frame_limpio.reset_index(drop=True)

    return data_frame_limpio


# =============================================================================
# BLOQUE PRINCIPAL
# =============================================================================

if __name__ == "__main__":

    from simulacion_usuarios import generar_usuarios

    NUMERO_REGISTROS = 50

    datos_sucios = generar_usuarios(NUMERO_REGISTROS)
    df_sucio = pd.DataFrame(datos_sucios)

    print("=" * 60)
    print(f"Registros ANTES de limpiar : {len(df_sucio)}")
    print("=" * 60)
    print(df_sucio.to_string(index=False))

    df_limpio = limpiar_usuarios(df_sucio)

    print("\n" + "=" * 60)
    print(f"Registros DESPUÉS de limpiar: {len(df_limpio)}")
    print("=" * 60)
    print(df_limpio.to_string(index=False))

    registros_eliminados = len(df_sucio) - len(df_limpio)
    print("\n" + "=" * 60)
    print("RESUMEN DE LIMPIEZA")
    print("=" * 60)
    print(f"  Registros originales : {len(df_sucio)}")
    print(f"  Registros limpios    : {len(df_limpio)}")
    print(f"  Registros eliminados : {registros_eliminados}")
    print(f"  Tasa de limpieza     : {registros_eliminados / len(df_sucio) * 100:.1f}%")