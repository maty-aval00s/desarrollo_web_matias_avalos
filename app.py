from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import func
from werkzeug.utils import secure_filename
import os
from datetime import datetime, timezone
from sqlalchemy.orm import joinedload

from database.db import SessionLocal, AvisoAdopcion, Comuna, Foto, ContactarPor, Region, crear_aviso, Comentario


app = Flask(__name__)
app.secret_key = "supersecretkey"   
UPLOAD_FOLDER = os.path.join(app.root_path, "static", "fotos")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def portada():
    session = SessionLocal()
    ultimos_avisos = session.query(AvisoAdopcion)\
                             .options(joinedload(AvisoAdopcion.comuna),
                                      joinedload(AvisoAdopcion.fotos))\
                             .order_by(AvisoAdopcion.fecha_ingreso.desc())\
                             .limit(5).all()
    session.close()
    return render_template("Portada.html", avisos=ultimos_avisos)

@app.route("/listado")
def listado():
    page = request.args.get("page", 1, type=int)
    session = SessionLocal()
    avisos = session.query(AvisoAdopcion)\
                    .options(joinedload(AvisoAdopcion.comuna),
                             joinedload(AvisoAdopcion.fotos))\
                    .order_by(AvisoAdopcion.fecha_ingreso.desc())\
                    .offset((page-1)*5)\
                    .limit(5).all()
    total = session.query(AvisoAdopcion).count()
    session.close()
    return render_template("Listado.html", avisos=avisos, page=page, total=total)

@app.route("/aviso/<int:aviso_id>")
def detalle_aviso(aviso_id):
    session = SessionLocal()
    aviso = session.query(AvisoAdopcion)\
                   .options(joinedload(AvisoAdopcion.comuna),
                            joinedload(AvisoAdopcion.fotos),
                            joinedload(AvisoAdopcion.contactos))\
                   .get(aviso_id)
    session.close()
    return render_template("DetalleAviso.html", aviso=aviso, fotos=aviso.fotos)

@app.route("/comunas/<int:region_id>")
def obtener_comunas(region_id):
    session = SessionLocal()
    comunas = session.query(Comuna).filter_by(region_id=region_id).all()
    session.close()
    return jsonify([{"id": c.id, "nombre": c.nombre} for c in comunas])


@app.route("/agregar", methods=["GET", "POST"])
def agregar_aviso():
    session = SessionLocal()
    regiones = session.query(Region).order_by(Region.nombre).all()
    session.close()
    if request.method == "POST":
        nombre = request.form.get("nombre_persona")
        email = request.form.get("email")
        telefono = request.form.get("telefono")
        tipo = request.form.get("tipo")
        cantidad = request.form.get("cantidad")
        edad = request.form.get("edad")
        unidad_medida = request.form.get("unidad_medida")
        fecha_entrega = request.form.get("fechaEntrega")
        descripcion = request.form.get("descripcion")
        
        sector = request.form.get("sector")
        comuna_id = request.form.get("comuna")
        errores = []

        # --- Validaciones ---
        if not nombre or len(nombre) < 3:
            errores.append("El nombre es obligatorio y debe tener al menos 3 caracteres.")
        if not email or "@" not in email:
            errores.append("Email inválido.")
        if tipo not in ["gato", "perro"]:
            errores.append("Tipo debe ser 'gato' o 'perro'.")
        if not cantidad or not cantidad.isdigit() or int(cantidad) <= 0:
            errores.append("Cantidad debe ser un número positivo.")
        if not edad or not edad.isdigit() or int(edad) < 0:
            errores.append("Edad debe ser un número no negativo.")
        if unidad_medida not in ["a", "m"]:
            errores.append("Unidad de medida inválida.")
        
        fecha_entrega = request.form.get("fecha_entrega")
        if not fecha_entrega:
            errores.append("Debes ingresar una fecha de entrega.")
        else:
            try:
                
                fecha_entrega_dt = datetime.strptime(fecha_entrega, "%Y-%m-%dT%H:%M")
                if fecha_entrega_dt < datetime.now():
                    errores.append("Fecha de entrega no puede ser en el pasado.")
            except ValueError:
                errores.append("Formato de fecha inválido.")
                
        if not comuna_id or not comuna_id.isdigit():
            errores.append("Comuna inválida.")
        else:
            session = SessionLocal()
            comuna = session.query(Comuna).get(int(comuna_id))
            session.close()
            if not comuna:
                errores.append("Comuna no existe.")
        

        if errores:
            return render_template("Avisos.html", errores=errores, datos=request.form)

        # --- Crear aviso ---
        session = SessionLocal()
        aviso_data = {
            "nombre": nombre,
            "email": email,
            "celular": telefono,
            "tipo": tipo,
            "cantidad": int(cantidad),
            "edad": int(edad),
            "unidad_medida": unidad_medida,
            "fecha_entrega": fecha_entrega_dt,
            "descripcion": descripcion,
            "sector": sector,
            "comuna_id": int(comuna_id),
            "fecha_ingreso": datetime.now(timezone.utc),
        }
        aviso = crear_aviso(session, aviso_data)

        # --- Contactos ---
        contactos = request.form.getlist("contactos[]")
        for contacto in contactos:
            nombre_contacto, identificador = contacto.split("|")
            nuevo_contacto = ContactarPor(nombre=nombre_contacto, identificador=identificador, aviso_id=aviso.id)
            session.add(nuevo_contacto)

        # --- Fotos ---
        fotos = request.files.getlist("fotos")
        for foto in fotos:
            if foto and foto.filename:
                filename = secure_filename(foto.filename)
                ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                foto.save(ruta)
                nueva_foto = Foto(
                    aviso_id=aviso.id,
                    ruta_archivo=f"fotos/{filename}",
                    nombre_archivo=filename)

                session.add(nueva_foto)

        session.commit()
        session.close()
        flash("Aviso agregado correctamente.")
        return redirect(url_for("portada"))

    return render_template("Avisos.html", regiones=regiones)

@app.route("/estadisticas")
def estadisticas():
    return render_template("Estadisticas.html")

@app.route("/api/estadisticas/avisos_por_dia")
def avisos_por_dia():
    session = SessionLocal()
    resultados = session.query(
        func.date(AvisoAdopcion.fecha_ingreso),
        func.count(AvisoAdopcion.id)
    ).group_by(func.date(AvisoAdopcion.fecha_ingreso)).order_by(func.date(AvisoAdopcion.fecha_ingreso)).all()
    session.close()
    return jsonify([
        {"fecha": str(r[0]), "cantidad": r[1]} for r in resultados
    ])

@app.route("/api/estadisticas/avisos_por_tipo")
def avisos_por_tipo():
    session = SessionLocal()
    resultados = session.query(
        AvisoAdopcion.tipo,
        func.count(AvisoAdopcion.id)
    ).group_by(AvisoAdopcion.tipo).all()
    session.close()
    return jsonify([
        {"tipo": r[0], "cantidad": r[1]} for r in resultados
    ])

@app.route("/api/estadisticas/avisos_por_mes")
def avisos_por_mes():
    session = SessionLocal()
    resultados = session.query(
        func.extract('year', AvisoAdopcion.fecha_ingreso).label('anio'),
        func.extract('month', AvisoAdopcion.fecha_ingreso).label('mes'),
        AvisoAdopcion.tipo,
        func.count(AvisoAdopcion.id)
    ).group_by('anio', 'mes', AvisoAdopcion.tipo).order_by('anio', 'mes').all()
    session.close()
    datos = {}
    for r in resultados:
        key = f"{int(r[0])}-{int(r[1]):02d}"
        if key not in datos:
            datos[key] = {"gato": 0, "perro": 0}
        datos[key][r[2]] = r[3]
    return jsonify([
        {"mes": k, "gato": v["gato"], "perro": v["perro"]} for k, v in datos.items()
    ])

@app.route("/api/comentarios/<int:aviso_id>")
def comentarios_aviso(aviso_id):
    session = SessionLocal()
    comentarios = session.query(Comentario).filter_by(aviso_id=aviso_id).order_by(Comentario.fecha.desc()).all()
    session.close()
    return jsonify([
        {
            "id": c.id,
            "nombre": c.nombre,
            "texto": c.texto,
            "fecha": c.fecha.strftime("%Y-%m-%d %H:%M")
        } for c in comentarios
    ])

@app.route("/api/comentarios/agregar", methods=["POST"])
def agregar_comentario():
    data = request.json
    nombre = data.get("nombre", "").strip()
    texto = data.get("texto", "").strip()
    aviso_id = data.get("aviso_id")
    errores = []
    if not nombre or len(nombre) < 3 or len(nombre) > 80:
        errores.append("El nombre debe tener entre 3 y 80 caracteres.")
    if not texto or len(texto) < 5:
        errores.append("El comentario debe tener al menos 5 caracteres.")
    if not aviso_id or not str(aviso_id).isdigit():
        errores.append("Aviso inválido.")
    if errores:
        return jsonify({"ok": False, "errores": errores}), 400
    session = SessionLocal()
    comentario = Comentario(
        aviso_id=int(aviso_id),
        nombre=nombre,
        texto=texto,
        fecha=datetime.now()
    )
    session.add(comentario)
    session.commit()
    session.close()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(debug=True)