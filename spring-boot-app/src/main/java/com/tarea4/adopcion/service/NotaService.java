package com.tarea4.adopcion.service;

import com.tarea4.adopcion.model.AvisoAdopcion;
import com.tarea4.adopcion.model.Nota;
import com.tarea4.adopcion.repository.AvisoAdopcionRepository;
import com.tarea4.adopcion.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotaService {
    
    @Autowired
    private NotaRepository notaRepository;
    
    @Autowired
    private AvisoAdopcionRepository avisoRepository;
    
    @Transactional
    public Double agregarNota(Integer avisoId, Integer valorNota) {
        if (valorNota == null || valorNota < 1 || valorNota > 7) {
            throw new IllegalArgumentException("La nota debe ser un número entero entre 1 y 7");
        }
        
        AvisoAdopcion aviso = avisoRepository.findById(avisoId)
            .orElseThrow(() -> new IllegalArgumentException("El aviso con ID " + avisoId + " no existe"));
        
        Nota nuevaNota = new Nota(aviso, valorNota);
        notaRepository.save(nuevaNota);
        
        return notaRepository.calcularPromedioByAvisoId(avisoId);
    }
    
    public Double calcularPromedio(Integer avisoId) {
        return notaRepository.calcularPromedioByAvisoId(avisoId);
    }
}
