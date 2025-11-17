package com.tarea4.adopcion.repository;

import com.tarea4.adopcion.model.AvisoAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Integer> {
    
    List<AvisoAdopcion> findAllByOrderByFechaIngresoDesc();
    
    @Query("SELECT COALESCE(AVG(n.nota), 0.0) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double getPromedioNotasByAvisoId(Integer avisoId);
}
