import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Páginas
import Inicio from './pages/Inicio'
import Instituciones from './pages/Instituciones'
import Sedes from './pages/Sedes'
import Programas from './pages/Programas'
import Usuarios from './pages/Usuarios'
import Buscar from './pages/Buscar'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuAbierto(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Router>
      <div className="app">
        <header className="encabezadoPrincipal">
          <div className="contenedorEncabezado">
            <h1 className="logoTitulo">
              <span className="logoIcono">&#127891;</span>
              Hub Educativo Colombia
            </h1>
            <button 
              className="botonMenu" 
              id="botonMenu"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Abrir menú de navegación"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav 
              className={`navegacionPrincipal ${menuAbierto ? 'abierto' : ''}`}
              id="navegacionPrincipal"
            >
              <Link 
                to="/" 
                className="enlaceNav" 
                onClick={() => setMenuAbierto(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/instituciones" 
                className="enlaceNav"
                onClick={() => setMenuAbierto(false)}
              >
                Instituciones
              </Link>
              <Link 
                to="/programas" 
                className="enlaceNav"
                onClick={() => setMenuAbierto(false)}
              >
                Programas
              </Link>
              <Link
                to="/sedes"
                className="enlaceNav"
                onClick={() => setMenuAbierto(false)}
              >
                Sedes
              </Link>
              <Link 
                to="/usuarios" 
                className="enlaceNav"
                onClick={() => setMenuAbierto(false)}
              >
                Usuarios
              </Link>
              <Link 
                to="/buscar" 
                className="enlaceNav"
                onClick={() => setMenuAbierto(false)}
              >
                Buscar
              </Link>
            </nav>
          </div>
        </header>

        <main className="contenidoPrincipal">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/instituciones" element={<Instituciones />} />
            <Route path="/sedes" element={<Sedes />} />
            <Route path="/programas" element={<Programas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/buscar" element={<Buscar />} />
          </Routes>
        </main>

        <footer className="piePagina">
          <p>&copy; 2026 Hub Educativo Colombia. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
