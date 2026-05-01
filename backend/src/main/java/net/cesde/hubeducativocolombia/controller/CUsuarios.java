package net.cesde.hubeducativocolombia.controller;


import net.cesde.hubeducativocolombia.model.MUsuarios;
import net.cesde.hubeducativocolombia.service.SUsuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class CUsuarios {

    @Autowired
    SUsuarios sUsuarios;

    // Crear usuario
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody MUsuarios usuario) {
        try {
            return ResponseEntity.ok(sUsuarios.adicionarRegistroUsuario(usuario));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            return ResponseEntity.ok(sUsuarios.consultaGeneralUsuarios());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sUsuarios.consultaIndividualPorID(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Buscar por nombre
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        try {
            return ResponseEntity.ok(sUsuarios.consultaIndividualPorNombre(nombre));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody MUsuarios usuario) {
        try {
            return ResponseEntity.ok(sUsuarios.modificarUsuario(id, usuario));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(sUsuarios.eliminarUsuario(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}