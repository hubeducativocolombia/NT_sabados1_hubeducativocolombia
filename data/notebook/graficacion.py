import matplotlib.pyplot as plt
import seaborn as sns
import os

RUTA_ASSETS = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "assets", "graficos")


def crear_ruta_si_no_existe(ruta_destino):
    os.makedirs(ruta_destino, exist_ok=True)


# =============================================================================
# INSTITUCIONES - Gráfico de torta
# Distribución de instituciones por naturaleza
# =============================================================================
def graficar_instituciones_por_naturaleza(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#4CAF50", "#ffd700", "#003893"]

    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion1)
    area_dibujo.pie(
        agrupacion1["conteo"],
        labels=agrupacion1["naturaleza"],
        autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias],
        startangle=90,
        wedgeprops={"edgecolor": "black", "linewidth": 0.5}
    )
    area_dibujo.set_title("Instituciones por Naturaleza", fontsize=14)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "instituciones_por_naturaleza.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# INSTITUCIONES - Gráfico de líneas
# Instituciones registradas después del 2010 por naturaleza
# =============================================================================
def graficar_instituciones_post_2010(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.plot(agrupacion2["naturaleza"], agrupacion2["conteo"], marker="o", color="#003893", linewidth=2)
    area_dibujo.set_title("Instituciones Registradas después de 2010 por Naturaleza", fontsize=14)
    area_dibujo.set_xlabel("Naturaleza", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "instituciones_post_2010.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de líneas guardado en: {ruta_completa}")


# =============================================================================
# INSTITUCIONES - Mapa de calor
# Naturaleza vs nombre oficial
# =============================================================================
# =============================================================================
# INSTITUCIONES - Gráfico de barras apiladas
# Top 15 instituciones por naturaleza
# =============================================================================
def graficar_top15_instituciones_por_naturaleza(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    if agrupacion3.empty:
        print("⚠️  Top 15 instituciones omitido: no hay datos suficientes.")
        return

    # Top 15 instituciones más frecuentes
    top15 = agrupacion3.groupby("nombreoficial")["conteo"].sum().nlargest(15).index
    df_top = agrupacion3[agrupacion3["nombreoficial"].isin(top15)]

    tabla_pivote = df_top.pivot_table(
        index="nombreoficial", columns="naturaleza", values="conteo", aggfunc="sum", fill_value=0
    )

    lista_colores = {"publica": "#003893", "privada": "#ffd700", "mixta": "#4CAF50"}
    colores = [lista_colores.get(col, "#9C27B0") for col in tabla_pivote.columns]

    figura, area_dibujo = plt.subplots(figsize=(14, 7))
    tabla_pivote.plot(kind="bar", stacked=True, ax=area_dibujo, color=colores, edgecolor="black")
    area_dibujo.set_title("Top 15 Instituciones por Naturaleza", fontsize=14)
    area_dibujo.set_xlabel("Nombre Oficial", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.legend(title="Naturaleza")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, "top15_instituciones_por_naturaleza.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras apiladas guardado en: {ruta_completa}")


# =============================================================================
# INSTITUCIONES - Gráfico de barras
# Instituciones públicas por nombre oficial
# =============================================================================
def graficar_instituciones_publicas_por_nombre(agrupacion4, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(12, 6))
    area_dibujo.bar(agrupacion4["nombreoficial"], agrupacion4["conteo"], color="#ffd700", edgecolor="black")
    area_dibujo.set_title("Instituciones Públicas por Nombre Oficial", fontsize=14)
    area_dibujo.set_xlabel("Nombre Oficial", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "instituciones_publicas_por_nombre.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# SEDES - Gráfico de barras
# Cantidad de sedes por ciudad principal
# =============================================================================
def graficar_sedes_por_ciudad(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(agrupacion1["ciudad"], agrupacion1["conteo"], color="#2196F3", edgecolor="black")
    area_dibujo.set_title("Sedes por Ciudad", fontsize=14)
    area_dibujo.set_xlabel("Ciudad", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "sedes_por_ciudad.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# SEDES - Gráfico de líneas
# Sedes principales por ciudad
# =============================================================================
def graficar_sedes_principales_por_ciudad(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.plot(agrupacion2["ciudad"], agrupacion2["conteo"], marker="o", color="#003893", linewidth=2)
    area_dibujo.set_title("Sedes Principales por Ciudad", fontsize=14)
    area_dibujo.set_xlabel("Ciudad", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "sedes_principales_por_ciudad.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de líneas guardado en: {ruta_completa}")


# =============================================================================
# SEDES - Mapa de calor
# Ciudad vs tipo de sede
# =============================================================================
def graficar_mapa_calor_sedes(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    if agrupacion3.empty:
        print("⚠️  Mapa de calor sedes omitido: no hay datos suficientes.")
        return

    tabla_pivote = agrupacion3.pivot_table(index="ciudad", columns="essedeprincipal", values="conteo", aggfunc="sum", fill_value=0)
    figura, area_dibujo = plt.subplots(figsize=(10, 6))
    sns.heatmap(tabla_pivote, annot=True, fmt=".0f", cmap="Blues", ax=area_dibujo, linewidths=0.5, linecolor="gray")
    area_dibujo.set_title("Mapa de Calor: Ciudad vs Tipo de Sede", fontsize=14)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "mapa_calor_sedes.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Mapa de calor guardado en: {ruta_completa}")


# =============================================================================
# SEDES - Gráfico de torta
# Distribución de nombres de sedes principales
# =============================================================================
def graficar_nombres_sedes_principales(agrupacion5, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#003893", "#ffd700", "#4CAF50", "#E91E63", "#9C27B0", "#FF5722", "#00BCD4", "#FF9800"]
    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion5)
    area_dibujo.pie(agrupacion5["conteo"], labels=agrupacion5["nombresede"], autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias], startangle=90, wedgeprops={"edgecolor": "black", "linewidth": 0.5})
    area_dibujo.set_title("Distribución de Nombres de Sedes Principales", fontsize=14)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "nombres_sedes_principales.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# PROGRAMAS - Gráfico de torta
# Proporción de programas activos por nivel de formación
# =============================================================================
def graficar_programas_por_nivel(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#FF9800", "#2196F3", "#4CAF50", "#E91E63", "#9C27B0", "#FF5722", "#00BCD4"]
    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion1)
    area_dibujo.pie(agrupacion1["conteo"], labels=agrupacion1["nivelformacion"], autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias], startangle=90, wedgeprops={"edgecolor": "black", "linewidth": 0.5})
    area_dibujo.set_title("Programas Activos por Nivel de Formación", fontsize=14)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "programas_por_nivel.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# PROGRAMAS - Gráfico de líneas
# Conteo de programas por nivel de formación
# =============================================================================
def graficar_promedio_semestres_por_nivel(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.plot(agrupacion2["nivelformacion"], agrupacion2["conteo"], marker="o", color="#9C27B0", linewidth=2)
    area_dibujo.set_title("Programas por Nivel de Formación", fontsize=14)
    area_dibujo.set_xlabel("Nivel de Formación", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "promedio_semestres_por_nivel.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de líneas guardado en: {ruta_completa}")


# =============================================================================
# PROGRAMAS - Gráfico de barras horizontales
# Top 10 programas más ofrecidos
# =============================================================================
def graficar_top10_programas_mas_ofrecidos(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    if agrupacion3.empty:
        print("⚠️  Top 10 programas omitido: no hay datos suficientes.")
        return

    # Agrupar por nombre de programa y tomar el top 10
    top10 = agrupacion3.groupby("nombreprograma")["conteo"].sum().reset_index(name="conteo")
    top10 = top10.sort_values("conteo", ascending=True).tail(10)

    figura, area_dibujo = plt.subplots(figsize=(12, 6))
    area_dibujo.barh(top10["nombreprograma"], top10["conteo"], color="#9C27B0", edgecolor="black")
    area_dibujo.set_title("Top 10 Programas más Ofrecidos", fontsize=14)
    area_dibujo.set_xlabel("Conteo", fontsize=12)
    area_dibujo.set_ylabel("Programa", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.4, axis="x")
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "mapa_calor_programas.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico Top 10 programas guardado en: {ruta_completa}")


# =============================================================================
# PROGRAMAS - Gráfico de barras
# Programas con más de 8 semestres por nivel de formación
# =============================================================================
def graficar_programas_largos_por_nivel(agrupacion4, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(agrupacion4["nivelformacion"], agrupacion4["conteo"], color="#003893", edgecolor="black")
    area_dibujo.set_title("Programas con más de 8 Semestres por Nivel de Formación", fontsize=14)
    area_dibujo.set_xlabel("Nivel de Formación", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "programas_largos_por_nivel.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# DETALLES OPERACION - Gráfico de torta
# Proporción de programas por modalidad
# =============================================================================
def graficar_detalles_por_modalidad(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#003893", "#ffd700", "#4CAF50", "#E91E63"]
    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion1)
    area_dibujo.pie(agrupacion1["conteo"], labels=agrupacion1["modalidad"], autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias], startangle=90, wedgeprops={"edgecolor": "black", "linewidth": 0.5})
    area_dibujo.set_title("Programas por Modalidad", fontsize=14)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "detalles_por_modalidad.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# DETALLES OPERACION - Gráfico de barras
# Conteo de programas por jornada
# =============================================================================
def graficar_costo_por_jornada(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(agrupacion2["jornada"], agrupacion2["conteo"],
        color="#FF5722", edgecolor="black")
    area_dibujo.set_title("Programas por Jornada", fontsize=14)
    area_dibujo.set_xlabel("Jornada", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.4, axis="y")
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "costo_por_jornada.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# DETALLES OPERACION - Mapa de calor
# Total estudiantes activos por modalidad y jornada
# =============================================================================
def graficar_mapa_calor_detalles(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    if agrupacion3.empty:
        print("⚠️  Mapa de calor detalles omitido: no hay datos suficientes.")
        return

    tabla_pivote = agrupacion3.pivot_table(index="modalidad", columns="jornada", values="total_estudiantes", aggfunc="sum", fill_value=0)
    figura, area_dibujo = plt.subplots(figsize=(10, 6))
    sns.heatmap(tabla_pivote, annot=True, fmt=".0f", cmap="YlOrRd", ax=area_dibujo, linewidths=0.5, linecolor="gray")
    area_dibujo.set_title("Mapa de Calor: Modalidad vs Jornada (Estudiantes Activos)", fontsize=14)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "mapa_calor_detalles.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Mapa de calor guardado en: {ruta_completa}")


# =============================================================================
# DETALLES OPERACION - Gráfico de barras
# Jornadas con más de 200 estudiantes activos
# =============================================================================
def graficar_jornadas_estudiantes_activos(agrupacion4, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(agrupacion4["jornada"], agrupacion4["conteo"], color="#2196F3", edgecolor="black")
    area_dibujo.set_title("Jornadas con más de 200 Estudiantes Activos", fontsize=14)
    area_dibujo.set_xlabel("Jornada", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "jornadas_estudiantes_activos.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# CALIDAD BENEFICIOS - Gráfico de torta
# Proporción de programas con acreditación de alta calidad
# =============================================================================
def graficar_acreditacion_alta_calidad(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#003893", "#ffd700"]
    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion1)
    area_dibujo.pie(agrupacion1["conteo"], labels=agrupacion1["acreditacionaltacalidad"].astype(str),
        autopct="%1.1f%%", colors=lista_colores[:cantidad_categorias], startangle=90,
        wedgeprops={"edgecolor": "black", "linewidth": 0.5})
    area_dibujo.set_title("Programas con Acreditación de Alta Calidad", fontsize=14)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "acreditacion_alta_calidad.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# CALIDAD BENEFICIOS - Mapa de calor
# Acreditación vs Becas
# =============================================================================
def graficar_mapa_calor_beneficios(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    if agrupacion3.empty:
        print("⚠️  Mapa de calor beneficios omitido: no hay datos suficientes.")
        return

    tabla_pivote = agrupacion3.pivot_table(index="acreditacionaltacalidad", columns="ofrecebecas", values="conteo", aggfunc="sum", fill_value=0)
    figura, area_dibujo = plt.subplots(figsize=(10, 6))
    sns.heatmap(tabla_pivote, annot=True, fmt=".0f", cmap="YlOrRd", ax=area_dibujo, linewidths=0.5, linecolor="gray")
    area_dibujo.set_title("Mapa de Calor: Acreditación vs Becas", fontsize=14)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "mapa_calor_beneficios.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Mapa de calor guardado en: {ruta_completa}")


# =============================================================================
# CALIDAD BENEFICIOS - Gráfico de barras
# Programas con becas y doble titulación
# =============================================================================
def graficar_becas_y_doble_titulacion(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(8, 5))
    etiquetas = agrupacion2.apply(lambda r: f"Becas: {r['ofrecebecas']} / Doble: {r['dobletitulacion']}", axis=1)
    area_dibujo.bar(etiquetas, agrupacion2["conteo"], color="#4CAF50", edgecolor="black")
    area_dibujo.set_title("Programas con Becas y Doble Titulación", fontsize=14)
    area_dibujo.set_xlabel("Combinación de Beneficios", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "becas_y_doble_titulacion.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# CALIDAD BENEFICIOS - Gráfico de barras
# Programas con segundo idioma y becas
# =============================================================================
def graficar_idioma_y_becas(agrupacion4, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(8, 5))
    etiquetas = agrupacion4.apply(lambda r: f"Idioma: {r['requieresegundoidioma']} / Becas: {r['ofrecebecas']}", axis=1)
    area_dibujo.bar(etiquetas, agrupacion4["conteo"], color="#E91E63", edgecolor="black")
    area_dibujo.set_title("Programas con Segundo Idioma y Becas", fontsize=14)
    area_dibujo.set_xlabel("Combinación", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "idioma_y_becas.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# USUARIOS - Gráfico de torta
# Distribución de usuarios por rol
# =============================================================================
def graficar_usuarios_por_rol(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#003893", "#ffd700", "#4CAF50"]
    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion1)
    area_dibujo.pie(agrupacion1["conteo"], labels=agrupacion1["rol"], autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias], startangle=90, wedgeprops={"edgecolor": "black", "linewidth": 0.5})
    area_dibujo.set_title("Distribución de Usuarios por Rol", fontsize=14)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "usuarios_por_rol.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# USUARIOS - Gráfico de líneas
# Usuarios activos por ocupación
# =============================================================================
def graficar_usuarios_por_ocupacion(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.plot(agrupacion2["ocupacion"], agrupacion2["conteo"], marker="o", color="#9C27B0", linewidth=2)
    area_dibujo.set_title("Usuarios Activos por Ocupación", fontsize=14)
    area_dibujo.set_xlabel("Ocupación", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "usuarios_por_ocupacion.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de líneas guardado en: {ruta_completa}")


# =============================================================================
# USUARIOS - Mapa de calor
# Rol vs estado activo
# =============================================================================
def graficar_mapa_calor_usuarios(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    if agrupacion3.empty:
        print("⚠️  Mapa de calor usuarios omitido: no hay datos suficientes.")
        return

    tabla_pivote = agrupacion3.pivot_table(index="rol", columns="estaactivo", values="conteo", aggfunc="sum", fill_value=0)

    if tabla_pivote.empty:
        print("⚠️  Mapa de calor usuarios omitido: tabla pivote vacía.")
        return

    figura, area_dibujo = plt.subplots(figsize=(10, 6))
    sns.heatmap(tabla_pivote, annot=True, fmt=".0f", cmap="Blues", ax=area_dibujo, linewidths=0.5, linecolor="gray")
    area_dibujo.set_title("Mapa de Calor: Rol vs Estado Activo", fontsize=14)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "mapa_calor_usuarios.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Mapa de calor guardado en: {ruta_completa}")


# =============================================================================
# USUARIOS - Gráfico de barras
# Usuarios creados después de junio 2025 por ocupación
# =============================================================================
def graficar_usuarios_recientes_por_ocupacion(agrupacion4, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(agrupacion4["ocupacion"], agrupacion4["conteo"], color="#FF9800", edgecolor="black")
    area_dibujo.set_title("Usuarios Recientes por Ocupación (desde jun 2025)", fontsize=14)
    area_dibujo.set_xlabel("Ocupación", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "usuarios_recientes_por_ocupacion.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# USUARIOS - Gráfico de barras agrupadas
# Admin y Master activos por ocupación
# =============================================================================
def graficar_admin_master_por_ocupacion(agrupacion5, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    roles = agrupacion5["rol"].unique()
    ocupaciones = agrupacion5["ocupacion"].unique()
    x = range(len(ocupaciones))
    ancho = 0.35
    lista_colores = ["#003893", "#ffd700"]

    figura, area_dibujo = plt.subplots(figsize=(12, 6))
    for i, rol in enumerate(roles):
        datos_rol = agrupacion5[agrupacion5["rol"] == rol]
        conteos = [
            datos_rol[datos_rol["ocupacion"] == oc]["conteo"].values[0]
            if oc in datos_rol["ocupacion"].values else 0
            for oc in ocupaciones
        ]
        area_dibujo.bar([xi + i * ancho for xi in x], conteos, width=ancho, label=rol,
            color=lista_colores[i % len(lista_colores)], edgecolor="black")

    area_dibujo.set_title("Admin y Master Activos por Ocupación", fontsize=14)
    area_dibujo.set_xlabel("Ocupación", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    area_dibujo.set_xticks([xi + ancho / 2 for xi in x])
    area_dibujo.set_xticklabels(ocupaciones, rotation=45)
    area_dibujo.legend()
    plt.tight_layout()
    ruta_completa = os.path.join(ruta_destino, "admin_master_por_ocupacion.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras agrupadas guardado en: {ruta_completa}")
