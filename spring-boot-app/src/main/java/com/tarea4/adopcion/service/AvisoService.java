package com.tarea4.adopcion.service;

import com.tarea4.adopcion.dto.AvisoDTO;
import com.tarea4.adopcion.model.AvisoAdopcion;
import com.tarea4.adopcion.repository.AvisoAdopcionRepository;
import com.tarea4.adopcion.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvisoService {
    
    @Autowired
    private AvisoAdopcionRepository avisoRepository;
    
    @Autowired
    private NotaRepository notaRepository;
    
    /**
     * Obtiene todos los avisos de adopción con sus promedios de notas
     */
    public List<AvisoDTO> obtenerTodosLosAvisos() {
        List<AvisoAdopcion> avisos = avisoRepository.findAllByOrderByFechaIngresoDesc();
        
        return avisos.stream().map(aviso -> {
            Double promedio = notaRepository.calcularPromedioByAvisoId(aviso.getId());
            
            return new AvisoDTO(
                aviso.getId(),
                aviso.getFechaIngreso(),
                aviso.getSector(),
                aviso.getCantidad(),
                aviso.getTipo(),
                aviso.getEdad(),
                aviso.getUnidadMedida(),
                aviso.getComuna().getNombre(),
                promedio
            );
        }).collect(Collectors.toList());
    }
    
    /**
     * Obtiene el promedio de notas de un aviso específico
     */
    public Double obtenerPromedioNota(Integer avisoId) {
        return notaRepository.calcularPromedioByAvisoId(avisoId);
    }
    
    /**
     * Verifica si existe un aviso con el ID dado
     */
    public boolean existeAviso(Integer avisoId) {
        return avisoRepository.existsById(avisoId);
    }
}
