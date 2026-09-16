package com.c5d017.lab5.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c5d017.lab5.business.EnvioService;
import com.c5d017.lab5.domain.Envio;
import com.c5d017.lab5.dto.EnvioDTO;

@RestController
@RequestMapping("/api/envios")
@CrossOrigin(origins = "*")
public class EnvioController {

    private final EnvioService envioService;

    public EnvioController(EnvioService envioService) {
        this.envioService = envioService;
    }

    @GetMapping("/optimizados")
    public ResponseEntity<List<Envio>> obtenerOptimizados() {
        List<Envio> envios = envioService.obtenerTodosConDetalles();
        return ResponseEntity.ok(envios);
    }

    @PostMapping
    public ResponseEntity<?> crearEnvio(@RequestBody EnvioDTO dto) {
        try {
            Envio nuevoEnvio = envioService.crearEnvio(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEnvio);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la solicitud: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estadoEnvio");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest().body("El campo 'estadoEnvio' es requerido.");
        }

        try {
            Envio actualizado = envioService.actualizarEstado(id, nuevoEstado);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el estado: " + e.getMessage());
        }
    }
}