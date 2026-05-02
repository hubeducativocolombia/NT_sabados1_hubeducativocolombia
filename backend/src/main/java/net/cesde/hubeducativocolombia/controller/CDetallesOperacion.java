package net.cesde.hubeducativocolombia.controller;

import net.cesde.hubeducativocolombia.service.SDetallesOperacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/detalles")
@CrossOrigin(origins = "*")
public class CDetallesOperacion {

    @Autowired
    SDetallesOperacion sDetalles;

    @GetMapping("/programa/{id}")
    public ResponseEntity<?> buscarPorPrograma(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sDetalles.consultarPorPrograma(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}