package net.cesde.hubeducativocolombia.controller;

import net.cesde.hubeducativocolombia.service.SCalidadBeneficios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/calidad")
@CrossOrigin(origins = "*")
public class CCalidadBeneficios {

    @Autowired
    SCalidadBeneficios sCalidad;

    @GetMapping("/programa/{id}")
    public ResponseEntity<?> buscarPorPrograma(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sCalidad.consultarPorPrograma(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/becas")
    public ResponseEntity<?> buscarConBecas() {
        try {
            return ResponseEntity.ok(sCalidad.buscarConBecas());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/acreditados")
    public ResponseEntity<?> buscarAcreditados() {
        try {
            return ResponseEntity.ok(sCalidad.buscarAcreditados());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}