package com.tarea4.adopcion.dto;

public class NotaRequest {
    private Integer avisoId;
    private Integer nota;
    
    // Constructores
    public NotaRequest() {}
    
    public NotaRequest(Integer avisoId, Integer nota) {
        this.avisoId = avisoId;
        this.nota = nota;
    }
    
    // Getters y Setters
    public Integer getAvisoId() {
        return avisoId;
    }
    
    public void setAvisoId(Integer avisoId) {
        this.avisoId = avisoId;
    }
    
    public Integer getNota() {
        return nota;
    }
    
    public void setNota(Integer nota) {
        this.nota = nota;
    }
}
