package com.tarea4.adopcion.dto;

import java.time.LocalDateTime;

public class AvisoDTO {
    private Integer id;
    private LocalDateTime fechaIngreso;
    private String sector;
    private Integer cantidad;
    private String tipo;
    private Integer edad;
    private String unidadMedida;
    private String comunaNombre;
    private Double promedioNota;
    
    // Constructores
    public AvisoDTO() {}
    
    public AvisoDTO(Integer id, LocalDateTime fechaIngreso, String sector, 
                    Integer cantidad, String tipo, Integer edad, String unidadMedida,
                    String comunaNombre, Double promedioNota) {
        this.id = id;
        this.fechaIngreso = fechaIngreso;
        this.sector = sector;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.edad = edad;
        this.unidadMedida = unidadMedida;
        this.comunaNombre = comunaNombre;
        this.promedioNota = promedioNota;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }
    
    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
    
    public String getSector() {
        return sector;
    }
    
    public void setSector(String sector) {
        this.sector = sector;
    }
    
    public Integer getCantidad() {
        return cantidad;
    }
    
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Integer getEdad() {
        return edad;
    }
    
    public void setEdad(Integer edad) {
        this.edad = edad;
    }
    
    public String getUnidadMedida() {
        return unidadMedida;
    }
    
    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }
    
    public String getComunaNombre() {
        return comunaNombre;
    }
    
    public void setComunaNombre(String comunaNombre) {
        this.comunaNombre = comunaNombre;
    }
    
    public Double getPromedioNota() {
        return promedioNota;
    }
    
    public void setPromedioNota(Double promedioNota) {
        this.promedioNota = promedioNota;
    }
    
    // Método auxiliar para mostrar la edad formateada
    public String getEdadFormateada() {
        if (edad == null) return "";
        String unidad = "a".equals(unidadMedida) ? "años" : "meses";
        return edad + " " + unidad;
    }
    
    // Método auxiliar para mostrar la nota formateada
    public String getNotaFormateada() {
        if (promedioNota == null || promedioNota == 0.0) {
            return "-";
        }
        return String.format("%.1f", promedioNota);
    }
}
