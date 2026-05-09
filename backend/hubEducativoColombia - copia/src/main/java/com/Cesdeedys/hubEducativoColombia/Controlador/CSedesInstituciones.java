package com.Cesdeedys.hubEducativoColombia.Controlador;

import com.Cesdeedys.hubEducativoColombia.Modelo.MSedesIntituciones;
import com.Cesdeedys.hubEducativoColombia.Servicio.SSedesInstituciones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sedes")
@CrossOrigin(origins = "*")
public class CSedesInstituciones {

    @Autowired
    SSedesInstituciones sSedes;

    // Buscar por nombre sede
    @GetMapping("/nombre")
    public ResponseEntity<?> buscarpornombre(@RequestParam String nombre) {
        try {
            return ResponseEntity.ok(sSedes.consultarpornombreinstitucion(nombre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Buscar por ciudad
    @GetMapping("/ciudad")
    public ResponseEntity<?> buscarporciudad(@RequestParam String ciudad) {
        try {
            return ResponseEntity.ok(sSedes.consultarporciudad(ciudad));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MSedesIntituciones sedeinstituciones) {
        try {
            return ResponseEntity.ok(sSedes.adicionarsedesinstituciones(sedeinstituciones));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody MSedesIntituciones sedeinstituciones) {
        try {
            return ResponseEntity.ok(sSedes.actualizarsedesinstituciones(id, sedeinstituciones));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sSedes.eliminarsedesinstituciones(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}