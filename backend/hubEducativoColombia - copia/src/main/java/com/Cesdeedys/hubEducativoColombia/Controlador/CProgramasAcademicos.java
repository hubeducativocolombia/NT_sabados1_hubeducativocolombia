package com.Cesdeedys.hubEducativoColombia.Controlador;

import com.Cesdeedys.hubEducativoColombia.Modelo.MProgramasAcademicos;
import com.Cesdeedys.hubEducativoColombia.Servicio.SProgramasAcademicos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/programas")
@CrossOrigin(origins = "*")
public class CProgramasAcademicos {

    @Autowired
    SProgramasAcademicos sProgramas;

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            return ResponseEntity.ok(sProgramas.consultaGeneral());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sProgramas.consultaPorId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nombre")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            return ResponseEntity.ok(sProgramas.buscarPorNombreProgramaAcademico(nombre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nivel")
    public ResponseEntity<?> buscarPorNivel(@RequestParam String nivel) {
        try {
            return ResponseEntity.ok(sProgramas.buscarPorNivel(nivel));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/institucion")
    public ResponseEntity<?> buscarPorInstitucion(@RequestParam Integer idinstitucion) {
        try {
            return ResponseEntity.ok(sProgramas.buscarPorInstitucion(idinstitucion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/activos")
    public ResponseEntity<?> buscarActivos() {
        try {
            return ResponseEntity.ok(sProgramas.buscarActivos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearProgramasAcademicos(@RequestBody MProgramasAcademicos programasAcademicos) {
        try {
            return ResponseEntity.ok(sProgramas.adicionar(programasAcademicos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProgramasAcademicos(@PathVariable Integer id, @RequestBody MProgramasAcademicos programasAcademicos) {
        try {
            return ResponseEntity.ok(sProgramas.actualizarProgramasAcademicos(id, programasAcademicos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProgramasAcademicos(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sProgramas.eliminarProgramaAcademico(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}