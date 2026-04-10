from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask import session


app = Flask(__name__)
app.config['SECRET_KEY'] = 'una-clave-secreta-larga-para-sesiones'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sneaker_shop.db'
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Nombre de la vista (endpoint) a la que se redirige si no estás logueado


@login_manager.user_loader
def load_user(user_id):
    from app.models import CognitoUser 

    email = session.get('user_email')
    role = session.get('user_role')
    id_token = session.get('id_token')

    if email and role:
        return CognitoUser(email=email, role=role, id_token=id_token)
    return None

# Resto de imports al final para evitar ciclos
from app import routes
