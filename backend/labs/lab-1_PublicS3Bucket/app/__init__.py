from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'una-clave-secreta-larga-para-sesiones'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sneaker_shop.db'
db = SQLAlchemy(app)

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
