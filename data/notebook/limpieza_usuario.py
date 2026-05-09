# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : limpieza_usuario.py
# PROPÓSITO  : Limpiar y validar los datos simulados (sucios) generados por
#              simulacion_usuario.py para la tabla 'usuarios' de MySQL.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : pandas
#
# NOTAS PEDAGÓGICAS:
#   - Cada bloque de limpieza corrige un tipo de error generado en simulacion_usuario.py.
#   - Se usa .copy() para no mutar el DataFrame original (buena práctica).
#   - Las columnas obligatorias se validan al final con dropna().
#   - Los correos duplicados se eliminan conservando la primera aparición.
#   - Se respetan las restricciones CHECK e integridad del esquema SQL.
# =============================================================================

import pandas as pd


def limpiar_usuarios(data_frame_sucio: pd.DataFrame) -> pd.DataFrame:
    """
    Limpia y valida un DataFrame con datos de la tabla 'usuarios' generados
    por simulacion_usuario.py. Corrige los cinco tipos de errores controlados.

    Errores corregidos (referencia simulacion_usuario.py):
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

    # 1. Normalizar 'nombrecompleto': eliminar espacios extra y estandarizar casing
    #    Corrige Error tipo 3 (espacios al inicio/fin) y Error tipo 5 (cadena vacía → NA)
    data_frame_limpio["nombrecompleto"] = (
        data_frame_limpio["nombrecompleto"]
        .astype("string")
        .str.strip()              # Elimina espacios al inicio y al final
        .str.title()              # Capitaliza correctamente cada palabra del nombre
    )
    # Convertir cadenas vacías en NA para poder descartarlas luego con dropna()
    data_frame_limpio["nombrecompleto"] = data_frame_limpio["nombrecompleto"].replace("", pd.NA)

    # 2. Normalizar 'correoelectronico': eliminar espacios y convertir a minúsculas
    data_frame_limpio["correoelectronico"] = (
        data_frame_limpio["correoelectronico"]
        .astype("string")
        .str.strip()
        .str.lower()
    )

    # 3. Validar formato mínimo del correo: debe contener '@' y al menos un '.'
    #    Corrige Error tipo 1 (correo sin '@')
    mascara_correo_invalido = ~(
        data_frame_limpio["correoelectronico"].str.contains("@", na=False) &
        data_frame_limpio["correoelectronico"].str.contains(r"\.", na=False)
    )
    data_frame_limpio.loc[mascara_correo_invalido, "correoelectronico"] = pd.NA

    # 4. Normalizar 'rol': eliminar espacios y convertir a mayúsculas
    #    Luego invalidar roles fuera del CHECK constraint
    #    Corrige Error tipo 2 (SUPERADMIN, GUEST, invitado, cadena vacía)
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

    # 5. Normalizar 'hashcontrasena': marcar hashes vacíos como NA
    #    Corrige Error tipo 3 (hash vacío)
    data_frame_limpio["hashcontrasena"] = (
        data_frame_limpio["hashcontrasena"]
        .astype("string")
        .str.strip()
        .replace("", pd.NA)
    )

    # -------------------------------------------------------------------------
    # LIMPIEZA DE DATOS NUMÉRICOS
    # -------------------------------------------------------------------------

    # 1. Verificar que 'idusuario' sea numérico
    data_frame_limpio["idusuario"] = pd.to_numeric(
        data_frame_limpio["idusuario"], errors="coerce"
    )

    # 2. Validar que 'idusuario' sea estrictamente positivo (PRIMARY KEY válida)
    #    Corrige Error tipo 1 y tipo 5 (None, -1, 0)
    data_frame_limpio = data_frame_limpio[
        data_frame_limpio["idusuario"].isna() | (data_frame_limpio["idusuario"] > 0)
    ]

    # 3. Verificar que 'estaactivo' sea numérico y esté dentro del rango TINYINT(1): {0, 1}
    #    Corrige Error tipo 3 (estaactivo = -1)
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
    #    Corrige Error tipo 2 (fechacreacion nula)
    data_frame_limpio["fechacreacion"] = pd.to_datetime(
        data_frame_limpio["fechacreacion"], errors="coerce"
    )

    # 2. Reemplazar fechas nulas por una fecha por defecto
    fecha_default = pd.to_datetime("2025-01-01")
    data_frame_limpio["fechacreacion"] = data_frame_limpio["fechacreacion"].fillna(fecha_default)

    # -------------------------------------------------------------------------
    # ELIMINACIÓN DE DUPLICADOS
    # -------------------------------------------------------------------------

    # Eliminar filas con correo duplicado, conservando la primera aparición
    #    Corrige Error tipo 4 (violación de restricción UNIQUE en correoelectronico)
    data_frame_limpio = data_frame_limpio.drop_duplicates(
        subset=["correoelectronico"], keep="first"
    )

    # -------------------------------------------------------------------------
    # NOVEDADES: ELIMINAR FILAS CON CAMPOS OBLIGATORIOS VACÍOS
    # -------------------------------------------------------------------------

    # Columnas NOT NULL según el esquema SQL de la tabla 'usuarios'
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
    # REINDEXAR para que el DataFrame resultante tenga índices continuos
    # -------------------------------------------------------------------------
    data_frame_limpio = data_frame_limpio.reset_index(drop=True)

    return data_frame_limpio


# =============================================================================
# BLOQUE PRINCIPAL — Ejemplo de uso integrado con simulacion_usuario.py
# =============================================================================

if __name__ == "__main__":

    from simulacion_usuario import generar_usuarios

    NUMERO_REGISTROS = 50

    # 1. Generar datos sucios
    datos_sucios = generar_usuarios(NUMERO_REGISTROS)
    df_sucio = pd.DataFrame(datos_sucios)

    print("=" * 60)
    print(f"Registros ANTES de limpiar : {len(df_sucio)}")
    print("=" * 60)
    print(df_sucio.to_string(index=False))

    # 2. Ejecutar limpieza
    df_limpio = limpiar_usuarios(df_sucio)

    print("\n" + "=" * 60)
    print(f"Registros DESPUÉS de limpiar: {len(df_limpio)}")
    print("=" * 60)
    print(df_limpio.to_string(index=False))

    # 3. Resumen estadístico
    registros_eliminados = len(df_sucio) - len(df_limpio)
    print("\n" + "=" * 60)
    print("RESUMEN DE LIMPIEZA")
    print("=" * 60)
    print(f"  Registros originales : {len(df_sucio)}")
    print(f"  Registros limpios    : {len(df_limpio)}")
    print(f"  Registros eliminados : {registros_eliminados}")
    print(f"  Tasa de limpieza     : {registros_eliminados / len(df_sucio) * 100:.1f}%")