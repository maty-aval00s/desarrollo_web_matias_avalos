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

  // -------------------------
  // Aquí guardaremos los avisos
  // -------------------------
  class AvisoAdopcion {
    constructor(nombre, sector, comuna, cantidad, tipoMascota, edad, unidad, fechaEntrega, descripcion, fotos) {
      this.nombre = nombre;
      this.sector = sector;
      this.comuna = comuna;
      this.cantidad = cantidad;
      this.tipoMascota = tipoMascota;
      this.edad = edad;
      this.unidad = unidad;
      this.fechaEntrega = fechaEntrega;
      this.descripcion = descripcion;
      this.fotos = fotos;
      this.fechaPublicacion = new Date().toLocaleString();
    }
  }

  let avisos = [];

  function mostrarUltimosAvisos() {
    const contenedor = document.getElementById("ultimosAvisos");
    if (!contenedor) return;

    contenedor.innerHTML = "";
    avisos.slice(0, 5).forEach(aviso => {
      const avisoDiv = document.createElement("div");
      avisoDiv.classList.add("aviso-item");
      avisoDiv.innerHTML = `
        <h4>${aviso.cantidad} ${aviso.tipoMascota}, ${aviso.edad} ${aviso.unidad}</h4>
        <p><strong>Sector:</strong> ${aviso.sector}, ${aviso.comuna}</p>
        <p><strong>Contacto:</strong> ${aviso.nombre}</p>
        <p>${aviso.descripcion}</p>
        ${aviso.fotos.length > 0 ? `<img src="${aviso.fotos[0]}" width="150">` : ""}
        <small>Publicado: ${aviso.fechaPublicacion}</small>
      `;
      contenedor.appendChild(avisoDiv);
    });
  }

  boton.addEventListener("click", function(event) {
    event.preventDefault();
    let todoValido = true;
    let mensajesError = [];

    // ... (todas tus validaciones se mantienen tal cual) ...

    const fotosActuales = conjuntoFotosInput.querySelectorAll('input[type="file"]');
    if (fotosActuales.length === 0){
      mensajesError.push("Coloca al menos una foto")
      todoValido=false
    }

    if (!todoValido) {
      alert("⚠️ Corrige lo siguiente:\n\n" + mensajesError.join("\n"));
    } else {
      const confirmar = confirm("¿Está seguro que desea agregar este aviso de adopción?")
      if (confirmar) {
        // Tomar los datos y crear aviso
        const nombre = nombreInput.value.trim();
        const sector = sectorInput.value.trim();
        const comuna = comunaSelect.value;
        const cantidad = cantidadMascotasInput.value.trim();
        const tipoMascota = mascotaSelect.value;
        const edad = edadInput.value.trim();
        const unidad = unidadSelect.value;
        const fechaEntrega = fechaEntregaInput.value;
        const descripcion = document.getElementById("descripcion").value.trim();

        // Obtener fotos
        const fotos = [];
        fotosActuales.forEach(input => {
          if (input.files.length > 0) {
            const url = URL.createObjectURL(input.files[0]);
            fotos.push(url);
          }
        });

        const aviso = new AvisoAdopcion(nombre, sector, comuna, cantidad, tipoMascota, edad, unidad, fechaEntrega, descripcion, fotos);
        avisos.unshift(aviso);

        mostrarUltimosAvisos();

        alert("✅ Hemos recibido la información de adopción, muchas gracias y suerte!");
        window.location.href = "Portada.html";
      }
    }
  });

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

  // Inicializar con datos de ejemplo
  avisos = [
    new AvisoAdopcion("Alexis Contreras","Plaza Ñuñoa","Ñuñoa",1,"gato",2,"años","2025-07-05","Gato cariñoso",["https://placekitten.com/200/200"]),
    new AvisoAdopcion("Homero Simpson","Comunidad ecológica","Peñalolén",1,"perro",1,"año","2025-02-28","Perro juguetón",["https://place-puppy.com/200x200"]),
  ];
  mostrarUltimosAvisos();
}
