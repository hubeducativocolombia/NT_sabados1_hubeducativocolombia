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
    public ResponseEntity<?> buscarporprograma(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sDetalles.consultarporprograma(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/detalles/{id}")
    public ResponseEntity<?> consultapordetalles(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sDetalles.consultapordetalle(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MDetallesOperacion detallesOperacion) {
        try {
            return ResponseEntity.ok(sDetalles.adicionardetallesoperacion(detallesOperacion));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody MDetallesOperacion detallesOperacion) {
        try {
            return ResponseEntity.ok(sDetalles.actualizardetallesoperacion(id, detallesOperacion));
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