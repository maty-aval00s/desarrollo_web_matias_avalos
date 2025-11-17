package com.tarea4.adopcion.controller;

import com.tarea4.adopcion.dto.AvisoDTO;
import com.tarea4.adopcion.service.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AvisoController {
    
    @Autowired
    private AvisoService avisoService;
    
    /**
     * Muestra la página principal con el listado de avisos
     */
    @GetMapping("/")
    public String index() {
        return "redirect:/evaluaciones";
    }
    
    /**
     * Muestra la página de evaluaciones con el listado de todos los avisos
     */
    @GetMapping("/evaluaciones")
    public String mostrarEvaluaciones(Model model) {
        List<AvisoDTO> avisos = avisoService.obtenerTodosLosAvisos();
        model.addAttribute("avisos", avisos);
        return "evaluaciones";
    }
}
