package net.cesde.hubeducativocolombia.controller;

import net.cesde.hubeducativocolombia.model.MInstituciones;
import net.cesde.hubeducativocolombia.service.SInstituciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/instituciones")
@CrossOrigin(origins = "*")
public class CInstituciones {

    @Autowired
    SInstituciones sInstituciones;

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            return ResponseEntity.ok(sInstituciones.consultaGeneral());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sInstituciones.consultaPorId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MInstituciones institucion) {
        try {
            return ResponseEntity.ok(sInstituciones.adicionarInstitucion(institucion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar (@PathVariable Integer id, @RequestBody MInstituciones instituciones) {
        try {
            return ResponseEntity.ok(sInstituciones.actualizarinsitucion(id, instituciones));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarinstitucion(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sInstituciones.eliminarinstitucion(id));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}