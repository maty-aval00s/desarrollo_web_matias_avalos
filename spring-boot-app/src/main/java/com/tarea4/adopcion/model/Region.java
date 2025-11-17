package com.tarea4.adopcion.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "region")
public class Region {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 200)
    private String nombre;
    
    @OneToMany(mappedBy = "region")
    private List<Comuna> comunas;
    
    // Constructores
    public Region() {}
    
    public Region(String nombre) {
        this.nombre = nombre;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public List<Comuna> getComunas() {
        return comunas;
    }
    
    public void setComunas(List<Comuna> comunas) {
        this.comunas = comunas;
    }
}
