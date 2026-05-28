import matplotlib.pyplot as plt
import seaborn as sns
import os

# Ruta típica de la carpeta assets en un proyecto React con Vite
RUTA_ASSETS = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "assets", "graficos")


def crear_ruta_si_no_existe(ruta_destino):
    # Se crea la carpeta destino en caso de que aún no exista
    os.makedirs(ruta_destino, exist_ok=True)


# =============================================================================
# INSTITUCIONES - Gráfico de barras
# Comparar cantidad de instituciones por naturaleza (oficial vs privada)
# =============================================================================
def graficar_instituciones_por_naturaleza(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(
        agrupacion1["naturaleza"],
        agrupacion1["conteo"],
        color="#4CAF50",
        edgecolor="black"
    )
    area_dibujo.set_title("Instituciones por Naturaleza", fontsize=14)
    area_dibujo.set_xlabel("Naturaleza", fontsize=12)
    area_dibujo.set_ylabel("Conteo", fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, "instituciones_por_naturaleza.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de barras guardado en: {ruta_completa}")


# =============================================================================
# SEDES INSTITUCIONES - Gráfico de barras
# Comparar cantidad de sedes por ciudad
# =============================================================================
def graficar_sedes_por_ciudad(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(
        agrupacion1["ciudad"],
        agrupacion1["conteo"],
        color="#2196F3",
        edgecolor="black"
    )
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
# PROGRAMAS ACADEMICOS - Gráfico de torta
# Proporción de programas por nivel de formación
# =============================================================================
def graficar_programas_por_nivel(agrupacion1, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    lista_colores = ["#FF9800", "#2196F3", "#4CAF50", "#E91E63", "#9C27B0", "#FF5722", "#00BCD4"]

    figura, area_dibujo = plt.subplots(figsize=(8, 8))
    cantidad_categorias = len(agrupacion1)
    area_dibujo.pie(
        agrupacion1["conteo"],
        labels=agrupacion1["nivelformacion"],
        autopct="%1.1f%%",
        colors=lista_colores[:cantidad_categorias],
        startangle=90,
        wedgeprops={"edgecolor": "black", "linewidth": 0.5}
    )
    area_dibujo.set_title("Programas por Nivel de Formación", fontsize=14)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, "programas_por_nivel.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de torta guardado en: {ruta_completa}")


# =============================================================================
# DETALLES OPERACION - Gráfico de líneas
# Tendencia de costo promedio por jornada
# =============================================================================
def graficar_costo_por_jornada(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.plot(
        agrupacion2["jornada"],
        agrupacion2["promedio_costo"],
        marker="o",
        color="#FF5722",
        linewidth=2
    )
    area_dibujo.set_title("Costo Promedio por Jornada", fontsize=14)
    area_dibujo.set_xlabel("Jornada", fontsize=12)
    area_dibujo.set_ylabel("Costo Promedio", fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)
    plt.xticks(rotation=45)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, "costo_por_jornada.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Gráfico de líneas guardado en: {ruta_completa}")


# =============================================================================
# CALIDAD BENEFICIOS - Mapa de calor
# Combinación de beneficios por programa
# =============================================================================
def graficar_mapa_calor_beneficios(agrupacion3, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    tabla_pivote = agrupacion3.pivot_table(
        index="acreditacionaltacalidad",
        columns="ofrecebecas",
        values="conteo",
        aggfunc="sum",
        fill_value=0
    )

    figura, area_dibujo = plt.subplots(figsize=(10, 6))
    sns.heatmap(
        tabla_pivote,
        annot=True,
        fmt=".0f",
        cmap="YlOrRd",
        ax=area_dibujo,
        linewidths=0.5,
        linecolor="gray"
    )
    area_dibujo.set_title("Mapa de Calor: Acreditación vs Becas", fontsize=14)
    plt.xticks(rotation=45)
    plt.tight_layout()

    ruta_completa = os.path.join(ruta_destino, "mapa_calor_beneficios.png")
    figura.savefig(ruta_completa)
    plt.close(figura)
    print(f"Mapa de calor guardado en: {ruta_completa}")


# =============================================================================
# USUARIOS - Gráfico de líneas
# Usuarios activos por ocupación
# =============================================================================
def graficar_usuarios_por_ocupacion(agrupacion2, ruta_destino=RUTA_ASSETS):
    crear_ruta_si_no_existe(ruta_destino)

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.plot(
        agrupacion2["ocupacion"],
        agrupacion2["conteo"],
        marker="o",
        color="#9C27B0",
        linewidth=2
    )
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