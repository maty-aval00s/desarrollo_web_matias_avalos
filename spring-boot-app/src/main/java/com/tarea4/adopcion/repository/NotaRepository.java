package com.tarea4.adopcion.repository;

import com.tarea4.adopcion.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    
    List<Nota> findByAvisoId(Integer avisoId);
    
    @Query("SELECT COALESCE(AVG(n.nota), 0.0) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double calcularPromedioByAvisoId(Integer avisoId);
    
    Long countByAvisoId(Integer avisoId);
}
