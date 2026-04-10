from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

app = Flask(__name__)

#1. Configuración Básica
app.config['SECRET_KEY'] = 'una-clave-secreta-larga-para-sesiones'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sneaker_shop.db'
db = SQLAlchemy(app)


# 2. Lee el nombre del bucket de un archivo, si existe
bucket_name_file = "bucket_name.txt"
bucket_name = None
if os.path.isfile(bucket_name_file):
    with open(bucket_name_file, "r") as f:
        bucket_name = f.read().strip()  # Elimina espacios y saltos de línea

# 3. Guarda en la config de Flask
app.config['S3_BUCKET_NAME'] = bucket_name

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Nombre de la vista (endpoint) a la que se redirige si no estás logueado

# Importa tu User model una vez db esté creado
from app.models import User

@login_manager.user_loader
def load_user(user_id):
    """Función que Flask-Login usa para obtener el usuario de la DB."""
    return User.query.get(int(user_id))

# Resto de imports al final para evitar ciclos
from app import routes
