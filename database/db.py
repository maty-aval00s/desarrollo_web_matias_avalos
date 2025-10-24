from sqlalchemy import (
    create_engine, Column, Integer, String, ForeignKey, DateTime, Text, Enum
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime, timezone

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Models ---

class Region(Base):
    __tablename__ = "region"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    comunas = relationship("Comuna", back_populates="region")

class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)
    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AvisoAdopcion", back_populates="comuna")

class AvisoAdopcion(Base):
    __tablename__ = "aviso_adopcion"
    id = Column(Integer, primary_key=True)
    fecha_ingreso = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    sector = Column(String(100))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))
    tipo = Column(Enum("gato", "perro"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)
    unidad_medida = Column(Enum("a", "m"), nullable=False)
    fecha_entrega = Column(DateTime, nullable=False)
    descripcion = Column(Text)
    comuna = relationship("Comuna", back_populates="avisos")
    fotos = relationship("Foto", back_populates="aviso")
    contactos = relationship("ContactarPor", back_populates="aviso")

class Foto(Base):
    __tablename__ = "foto"
    id = Column(Integer, primary_key=True)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"))
    ruta_archivo = Column(String(255), nullable=False)
    nombre_archivo = Column(String(255), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = "contactar_por"
    id = Column(Integer, primary_key=True)
    nombre = Column(Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra'), nullable=False)
    identificador = Column(String(150), nullable=False)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"), nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="contactos")

class Comentario(Base):
    __tablename__ = "comentario"
    id = Column(Integer, primary_key=True)
    aviso_id = Column(Integer, ForeignKey("aviso_adopcion.id"))
    nombre = Column(String(80), nullable=False)
    texto = Column(Text, nullable=False)
    fecha = Column(DateTime, nullable=False)
    aviso = relationship("AvisoAdopcion", back_populates="comentarios")

AvisoAdopcion.comentarios = relationship("Comentario", back_populates="aviso")

# --- Database Functions ---

def get_ultimos_avisos(session, cantidad=5):
    return session.query(AvisoAdopcion).order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(cantidad).all()

def crear_aviso(session, aviso_data):
    nuevo_aviso = AvisoAdopcion(**aviso_data)
    session.add(nuevo_aviso)
    session.commit()
    session.refresh(nuevo_aviso)
    return nuevo_aviso



