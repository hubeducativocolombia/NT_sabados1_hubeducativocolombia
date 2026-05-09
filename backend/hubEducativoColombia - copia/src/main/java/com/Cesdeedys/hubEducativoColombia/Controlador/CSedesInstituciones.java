package net.cesde.hubeducativocolombia.controller;

import net.cesde.hubeducativocolombia.model.MSedesIntituciones;
import net.cesde.hubeducativocolombia.service.SSedesInstituciones;
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
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            return ResponseEntity.ok(sSedes.consultarPorNombreInstitucion(nombre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Buscar por ciudad
    @GetMapping("/ciudad")
    public ResponseEntity<?> buscarPorCiudad(@RequestParam String ciudad) {
        try {
            return ResponseEntity.ok(sSedes.consultarPorCiudad(ciudad));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MSedesIntituciones sedeinstituciones) {
        try {
            return ResponseEntity.ok(sSedes.adicionarSedeInstitucion(sedeinstituciones));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody MSedesIntituciones sedeinstituciones) {
        try {
            return ResponseEntity.ok(sSedes.actualizarSedesInstitucion(id, sedeinstituciones));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sSedes.eliminarsedeinstituciones(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}