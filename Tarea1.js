
// --- BLOQUE AGREGAR AVISO ---
const regionSelect = document.getElementById("region");
if (regionSelect) {
  const comunasPorRegion = {
    "15": ["Arica", "Camarones", "Putre", "General Lagos"],
    "1": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"],
    "2": ["Antofagasta", "Mejillones", "Calama", "Tocopilla"],
    "3": ["Copiapó", "Caldera", "Vallenar", "Chañaral"],
    "4": ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
    "5": ["Valparaíso", "Viña del Mar", "Quilpué", "Los Andes", "San Antonio"],
    "13": ["Santiago", "Puente Alto", "Maipú", "La Florida", "Ñuñoa", "Providencia"],
    "6": ["Rancagua", "San Fernando", "Santa Cruz"],
    "7": ["Talca", "Curicó", "Linares", "Cauquenes"],
    "16": ["Chillán", "San Carlos", "Bulnes"],
    "8": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"],
    "9": ["Temuco", "Villarrica", "Pucón", "Angol"],
    "14": ["Valdivia", "La Unión", "Río Bueno"],
    "10": ["Puerto Montt", "Osorno", "Castro", "Ancud"],
    "11": ["Coyhaique", "Puerto Aysén", "Chile Chico"],
    "12": ["Punta Arenas", "Puerto Natales", "Porvenir"]
  };

  const comunaSelect = document.getElementById("comuna");
  const formulario = document.getElementById("entrega-form");
  const boton = document.getElementById("boton");
  const emailInput = document.getElementById("email");
  const telefonoInput = document.getElementById("telefono");
  const nombreInput = document.getElementById("nombre-persona")
  const sectorInput = document.getElementById("sector")
  const redSelect = document.getElementById("redsocial")
  const redInput = document.getElementById("inputRed")
  const usuarioInput = document.getElementById("usuariored")
  const mascotaSelect = document.getElementById("tipoMascota")
  const cantidadMascotasInput = document.getElementById("cantidad")
  const edadInput = document.getElementById("edad")
  const unidadSelect = document.getElementById("unidadMedida")
  const fechaEntregaInput = document.getElementById("fechaEntrega")
  const conjuntoFotosInput = document.getElementById("conjuntoFotos")
  const botonAgregarFoto = document.getElementById("agregarFoto")

  const ahora = new Date();
  const fechaMinima = new Date(ahora.getTime() + 3 * 60 * 60 * 1000);

  function formatearDatetimeLocal(fecha) {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, "0"); 
    const dd = String(fecha.getDate()).padStart(2, "0");
    const hh = String(fecha.getHours()).padStart(2, "0");
    const min = String(fecha.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  fechaEntregaInput.value = formatearDatetimeLocal(fechaMinima);
  fechaEntregaInput.min = formatearDatetimeLocal(fechaMinima);

  regionSelect.addEventListener("change", function() {
    const region = this.value;
    comunaSelect.innerHTML = "";

    if (region && comunasPorRegion[region]) {
      comunaSelect.disabled = false;
      comunasPorRegion[region].forEach(comuna => {
        const option = document.createElement("option");
        option.value = comuna;
        option.text = comuna;
        comunaSelect.add(option);
      });
    } else {
      comunaSelect.disabled = true;
    }
  });

  boton.addEventListener("click", function(event) {
    event.preventDefault();
    let todoValido = true;
    let mensajesError = [];

    if (!regionSelect.value) {
      mensajesError.push("Debes seleccionar una región");
      todoValido = false;
    }
    if (!comunaSelect.value) {
      mensajesError.push("Debes seleccionar una comuna");
      todoValido = false
    }

    const sector= sectorInput.value.trim()
    if (!sector){
      mensajesError.push("Debes colocar el sector");
      todoValido = false;
    }

    const nombre = nombreInput.value.trim()
    if (!nombre){
      mensajesError.push("Debes colocar un nombre");
      todoValido=false;
    }
    const email = emailInput.value.trim();
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      mensajesError.push("El correo es obligatorio");
      todoValido = false;
    } else if (email.length > 100) {
      mensajesError.push("El correo no puede tener más de 100 caracteres");
      todoValido = false;
    } else if (!patronEmail.test(email)) {
      mensajesError.push("Formato de correo inválido");
      todoValido = false
    }

    const telefono = telefonoInput.value.trim();
    const patronTelefono = /^\+569\d{8}$/;
    if (!telefono) {
      mensajesError.push("El teléfono es obligatorio");
      todoValido = false;
    } else if (!patronTelefono.test(telefono)) {
      mensajesError.push("Formato incorrecto de teléfono: debe ser +569XXXXXXXX");
      todoValido = false;
    }

    const red = redSelect.value
    if (!red) {
      mensajesError.push("Selecciona una red social");
      todoValido=false
    }

    const mascota=mascotaSelect.value
    if (!mascota){
      mensajesError.push("Selecciona un tipo de mascota");
      todoValido=false
    }

    const cantidad = Number(cantidadMascotasInput.value.trim())
    if (!cantidad) {
      mensajesError.push("Ingresa la cantidad de mascotas")
      todoValido=false
    } else if (cantidad < 1) {
      mensajesError.push("Ingresa una cantidad de mascotas mayor o igual a 1")
      todoValido= false
    } else if (!Number.isInteger(cantidad)) {
      mensajesError.push("Ingresa una cantidad entera de mascotas")
      todoValido = false
    }

    const edad =Number(edadInput.value.trim()) 
    if (!edad) {
      mensajesError.push("Ingresa la edad de la mascota")
      todoValido=false
    } else if (edad < 1) {
      mensajesError.push("Ingresa una edad mayor o igual a 1")
      todoValido= false
    } else if (!Number.isInteger(edad)) {
      mensajesError.push("Ingresa una edad entera")
      todoValido = false
    }

    const unidad = unidadSelect.value
    if (!unidad) {
      mensajesError.push("Selecciona una unidad de medida de edad")
      todoValido=false
    }

    const fechaSeleccionada = new Date(fechaEntregaInput.value) 
    if (fechaSeleccionada<fechaMinima) {
      mensajesError.push("La fecha debe ser mayor o igual a la prellenada(inicio + 3 horas)")
      todoValido = false
    }

    const fotosActuales = conjuntoFotosInput.querySelectorAll('input[type="file"]').length
    if (fotosActuales === 0){
      mensajesError.push("Coloca al menos una foto")
      todoValido=false
    }

    if (!todoValido) {
      alert("⚠️ Corrige lo siguiente:\n\n" + mensajesError.join("\n"));
    } else {
      const confirmar = confirm("¿Está seguro que desea agregar este aviso de adopción?")
      if (confirmar) {
        const mensajeFinal = document.createElement("div");
        mensajeFinal.innerHTML =` <p>Hemos recibido la información de adopción, muchas gracias y suerte!</p>
        <button id="volverPortada">Volver a la portada</button>` ;
        document.body.appendChild(mensajeFinal);
        document.getElementById("volverPortada").addEventListener("click", () => {
          window.location.href = "Portada.html"
        } )
      }
    }
  })

  redSelect.addEventListener("change", ()=>{
    if (redSelect.value !== "") {
      redInput.style.display = "block"
    } else {
      redInput.style.display ="none";
      usuarioInput.value=""
    }
  })

  botonAgregarFoto.addEventListener("click", () => {
    const fotosActuales = conjuntoFotosInput.querySelectorAll('input[type="file"]').length;

    if (fotosActuales >= 5) {
      alert("No puedes agregar más de 5 fotos");
      return;
    }

    const nuevoInput = document.createElement("input");
    nuevoInput.type = "file";
    nuevoInput.name = "fotos[]";
    nuevoInput.accept = "image/*";

    conjuntoFotosInput.appendChild(nuevoInput);
  })
}

// --- BLOQUE LISTADO DE AVISOS ---
const tabla = document.getElementById("tablaAvisos");
if (tabla) {
  const avisos = {
    1: {
      fechaPublicacion: "01-07-2025 12:00",
      fechaEntrega: "05-07-2025",
      comuna: "Ñuñoa",
      sector: "Plaza Ñuñoa",
      cantidadTipoEdad: "1 gato, 2 años",
      nombre: "Alexis Contreras",
      descripcion: "Gato cariñoso, necesita hogar responsable.",
      fotos: [
        "https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97"
      ]
    },
    2: {
      fechaPublicacion: "25-02-2025 18:00",
      fechaEntrega: "28-02-2025",
      comuna: "Peñalolén",
      sector: "Comunidad ecológica",
      cantidadTipoEdad: "1 perro, 1 año",
      nombre: "Homero Simpson",
      descripcion: "Perro juguetón, le gusta la compañía.",
      fotos: [
        "https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVycm98ZW58MHx8MHx8fDA%3D",
        "https://png.pngtree.com/png-vector/20250111/ourmid/pngtree-golden-retriever-dog-pictures-png-image_15147078.png"
      ]
    },
    3: {
      fechaPublicacion: "20-02-2025 11:00",
      fechaEntrega: "21-02-2025",
      comuna: "Peñalolén",
      sector: "Las Pircas",
      cantidadTipoEdad: "1 gato, 5 meses",
      nombre: "John Pork",
      descripcion: "Gatito juguetón y sociable, busca hogar.",
      fotos: ["https://media.istockphoto.com/id/857090044/es/foto/gatito-naranja-sobre-un-fondo-claro-enfoque-suave.jpg?s=612x612&w=0&k=20&c=o49xmWtg1rjsNjFOepZf4BZimSjvE-QjoWkQic2q9PI=",
      "https://images.unsplash.com/photo-1621780030440-71c9ace78fa3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJhYnklMjBjYXRzfGVufDB8fDB8fHww"]
    },
    4: {
      fechaPublicacion: "02-08-2025 19:30",
      fechaEntrega: "03-08-2025",
      comuna: "Maipú",
      sector: "Plaza Maipú",
      cantidadTipoEdad: "2 perros, 1 año y 1 año",
      nombre: "Cristiano Ronaldo",
      descripcion: "Perros activos y amigables, necesitan espacio para jugar.",
      fotos: ["https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVycm8lMjBiZWJlfGVufDB8fDB8fHww",
      "https://cdn.sanity.io/images/5vm5yn1d/pro/5cb1f9400891d9da5a4926d7814bd1b89127ecba-1300x867.jpg?fm=webp&q=80"]
    },
    5: {
      fechaPublicacion: "15-06-2025 20:00",
      fechaEntrega: "20-06-2025",
      comuna: "Santiago",
      sector: "Centro",
      cantidadTipoEdad: "2 gatos, 7 meses y 9 meses",
      nombre: "Playboi Carti",
      descripcion: "Gatitos juguetones, muy cariñosos, ideales para departamento.",
      fotos: ["https://www.anicura.es/cdn-cgi/image/f=auto,fit=cover,w=640,h=640,g=auto,sharpen=1/AdaptiveImages/powerinit/52437/_SNI2031.jpg?stamp=a2efc90c9d13cd9fdc0f5f7a2e3b2231238dc8cf",
      "https://media.es.wired.com/photos/657cb5b81e17b099f8f9e15c/16:9/w_3008,h_1692,c_limit/gatos%20172050389.jpg"]
    }
  };

  const detalle = document.getElementById("detalleAviso");
  const detalleFechaPub = document.getElementById("detalleFechaPub");
  const detalleFechaEnt = document.getElementById("detalleFechaEnt");
  const detalleComuna = document.getElementById("detalleComuna");
  const detalleSector = document.getElementById("detalleSector");
  const detalleCantidad = document.getElementById("detalleCantidad");
  const detalleNombre = document.getElementById("detalleNombre");
  const detalleDescripcion = document.getElementById("detalleDescripcion");
  const detalleFotos = document.getElementById("detalleFotos");
  const volverListadoBtn = document.getElementById("volverListado");

  function mostrarDetalle(id) {
    const aviso = avisos[id];
    detalleFechaPub.textContent = aviso.fechaPublicacion;
    detalleFechaEnt.textContent = aviso.fechaEntrega;
    detalleComuna.textContent = aviso.comuna;
    detalleSector.textContent = aviso.sector;
    detalleCantidad.textContent = aviso.cantidadTipoEdad;
    detalleNombre.textContent = aviso.nombre;
    detalleDescripcion.textContent = aviso.descripcion;

    detalleFotos.innerHTML = "";
    aviso.fotos.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.width = "320px";
      img.style.height = "240px";
      img.style.margin = "5px";
      img.style.cursor = "pointer";

      img.onclick = () => {
        img.style.width = "800px";
        img.style.height = "600px";
        const btnCerrar = document.createElement("button");
        btnCerrar.textContent = "Cerrar";
        btnCerrar.onclick = () => {
          img.style.width = "320px";
          img.style.height = "240px";
          btnCerrar.remove();
        };
        detalleFotos.appendChild(btnCerrar);
      };

      detalleFotos.appendChild(img);
    });

    tabla.style.display = "none";
    detalle.style.display = "block";
  }

  tabla.querySelectorAll("tbody tr").forEach(tr => {
    tr.onclick = () => mostrarDetalle(tr.dataset.id);
  });

  volverListadoBtn.onclick = () => {
    detalle.style.display = "none";
    tabla.style.display = "table";
  };
}