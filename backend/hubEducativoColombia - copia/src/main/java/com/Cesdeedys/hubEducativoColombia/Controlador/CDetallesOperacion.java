package com.Cesdeedys.hubEducativoColombia.Controlador;

import com.Cesdeedys.hubEducativoColombia.Modelo.MDetallesOperacion;
import com.Cesdeedys.hubEducativoColombia.Servicio.SDetallesOperacion;
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

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MDetallesOperacion detallesOperacion) {
        try {
            return ResponseEntity.ok(sDetalles.adicionarDetallesOperacion(detallesOperacion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody MDetallesOperacion detallesOperacion) {
        try {
            return ResponseEntity.ok(sDetalles.actualizarDetallesOperacion(id, detallesOperacion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sDetalles.eliminardetalleoperacion(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}