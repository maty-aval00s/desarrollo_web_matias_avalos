package com.tarea4.adopcion.controller;

import com.tarea4.adopcion.dto.NotaRequest;
import com.tarea4.adopcion.dto.NotaResponse;
import com.tarea4.adopcion.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notas")
public class NotaRestController {
    
    @Autowired
    private NotaService notaService;
    
    @PostMapping("/agregar")
    public ResponseEntity<NotaResponse> agregarNota(@RequestBody NotaRequest request) {
        try {
            if (request.getAvisoId() == null || request.getNota() == null) {
                return ResponseEntity
                    .badRequest()
                    .body(new NotaResponse(false, "Debe proporcionar avisoId y nota", null));
            }
            
            Double nuevoPromedio = notaService.agregarNota(request.getAvisoId(), request.getNota());
            
            return ResponseEntity
                .ok()
                .body(new NotaResponse(true, "Nota agregada correctamente", nuevoPromedio));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .badRequest()
                .body(new NotaResponse(false, e.getMessage(), null));
            
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new NotaResponse(false, "Error al agregar la nota: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/promedio/{avisoId}")
    public ResponseEntity<Double> obtenerPromedio(@PathVariable Integer avisoId) {
        try {
            Double promedio = notaService.calcularPromedio(avisoId);
            return ResponseEntity.ok(promedio);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0.0);
        }
    }
}
