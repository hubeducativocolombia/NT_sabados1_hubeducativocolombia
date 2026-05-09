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
            return ResponseEntity.ok(sProgramas.consultageneral());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarporid(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sProgramas.consultaporid(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nombre")
    public ResponseEntity<?> buscarpornombre(@RequestParam String nombre) {
        try {
            return ResponseEntity.ok(sProgramas.buscarpornombreprogramaacademico(nombre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nivel")
    public ResponseEntity<?> buscarpornivel(@RequestParam String nivel) {
        try {
            return ResponseEntity.ok(sProgramas.buscarpornivel(nivel));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/institucion")
    public ResponseEntity<?> buscarporinstitucion(@RequestParam Integer idinstitucion) {
        try {
            return ResponseEntity.ok(sProgramas.buscarporinstitucion(idinstitucion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/activos")
    public ResponseEntity<?> buscaractivos() {
        try {
            return ResponseEntity.ok(sProgramas.buscaractivos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearprogramasacademicos(@RequestBody MProgramasAcademicos programasAcademicos) {
        try {
            return ResponseEntity.ok(sProgramas.adicionarprogramasacademicos(programasAcademicos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarprogramasacademicos(@PathVariable Integer id, @RequestBody MProgramasAcademicos programasAcademicos) {
        try {
            return ResponseEntity.ok(sProgramas.actualizarprogramasacademicos(id, programasAcademicos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarprogramasacademicos(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sProgramas.eliminarprogramasacademicos(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}