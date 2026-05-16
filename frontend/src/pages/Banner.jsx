import { useEffect, useState } from 'react'
import banner1 from '../img/BANNER-1.jpeg'
import banner2 from '../img/BANNER-2.jpeg'
import banner3 from '../img/BANNER-3.jpeg'

const obtenerTonoPorHorario = () => {
  const horaActual = new Date().getHours()
  if (horaActual >= 5 && horaActual < 12) {
    return 'institucional'
  }

  if (horaActual >= 12 && horaActual < 19) {
    return 'institucional'
  }

  return 'institucional'
}

const copysCarrusel = {
  emocional: [
    {
      imagen: banner1,
      titulo: 'Tu futuro comienza con una buena decision',
      descripcion: 'Toma perspectiva, compara opciones universitarias y elige el camino que encaja contigo.'
    },
    {
      imagen: banner2,
      titulo: 'Avanza paso a paso hacia tu meta',
      descripcion: 'Navega entre carreras, sedes y modalidades para construir un plan academico realista.'
    },
    {
      imagen: banner3,
      titulo: 'Enfoca tu talento donde puede crecer',
      descripcion: 'Descubre oportunidades, becas y programas que potencian tus fortalezas personales.'
    }
  ],
  institucional: [
    {
      imagen: banner1,
      titulo: 'Informacion confiable para decisiones academicas',
      descripcion: 'Consulta instituciones verificadas y revisa su oferta para planear tu ingreso con claridad.'
    },
    {
      imagen: banner2,
      titulo: 'Comparacion integral de programas y sedes',
      descripcion: 'Analiza modalidad, ubicacion y enfoque formativo para seleccionar la opcion mas conveniente.'
    },
    {
      imagen: banner3,
      titulo: 'Orientacion para proyectar tu perfil profesional',
      descripcion: 'Identifica oportunidades de becas y trayectorias de aprendizaje alineadas con tu objetivo laboral.'
    }
  ],
  motivacional: [
    {
      imagen: banner1,
      titulo: 'Manana puede empezar hoy',
      descripcion: 'Dedica unos minutos a explorar universidades y da un paso concreto hacia tu meta.'
    },
    {
      imagen: banner2,
      titulo: 'Cada avance suma en tu camino',
      descripcion: 'Compara opciones con calma y transforma la duda en un plan academico posible.'
    },
    {
      imagen: banner3,
      titulo: 'Tu esfuerzo de hoy construye tu futuro',
      descripcion: 'Elige una ruta de estudio que potencie tu talento y abre nuevas oportunidades.'
    }
  ]
}

const diapositivas = copysCarrusel[obtenerTonoPorHorario()] || copysCarrusel.emocional

export default function Banner() {
  const [indiceActivo, setIndiceActivo] = useState(0)

  useEffect(() => {
    const temporizador = window.setInterval(() => {
      setIndiceActivo((actual) => (actual + 1) % diapositivas.length)
    }, 5000)

    return () => window.clearInterval(temporizador)
  }, [])

  const irASlide = (indice) => {
    setIndiceActivo(indice)
  }

  const irAnterior = () => {
    setIndiceActivo((actual) => (actual - 1 + diapositivas.length) % diapositivas.length)
  }

  const irSiguiente = () => {
    setIndiceActivo((actual) => (actual + 1) % diapositivas.length)
  }

  return (
    <section className="bannerCarrusel" aria-label="Carrusel de fotografias destacadas">
      <div className="bannerCarruselImagenes">
        {diapositivas.map((slide, indice) => (
          <article
            key={slide.titulo}
            className={`bannerSlide ${indice === indiceActivo ? 'activo' : ''}`}
            aria-hidden={indice !== indiceActivo}
          >
            <img src={slide.imagen} alt={slide.titulo} loading="lazy" />
            <div className="bannerOverlay" />
            <div className="bannerContenido">
              <h5>{slide.titulo}</h5>
              <p>{slide.descripcion}</p>
            </div>
          </article>
        ))}
      </div>

      <button className="bannerControl previo" onClick={irAnterior} type="button" aria-label="Imagen anterior">
        ‹
      </button>
      <button className="bannerControl siguiente" onClick={irSiguiente} type="button" aria-label="Imagen siguiente">
        ›
      </button>

      <div className="bannerIndicadores" role="tablist" aria-label="Seleccion de diapositivas">
        {diapositivas.map((slide, indice) => (
          <button
            key={`${slide.titulo}-indicador`}
            type="button"
            className={indice === indiceActivo ? 'activo' : ''}
            onClick={() => irASlide(indice)}
            aria-label={`Ir a diapositiva ${indice + 1}`}
            aria-selected={indice === indiceActivo}
          />
        ))}
      </div>
    </section>
  )
}