package net.cesde.hubeducativocolombia.controller;

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
}