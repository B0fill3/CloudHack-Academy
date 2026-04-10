# app.py
from flask import Flask
from labs.routes import labs_bp 
from aws.routes import aws_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # Añadir CORS con configuración por defecto (permite acceso desde cualquier origen)
    CORS(app)
    # Registrar el Blueprint con un prefijo de URL, por ejemplo "/labs"
    app.register_blueprint(labs_bp, url_prefix="/labs")
    app.register_blueprint(aws_bp, url_prefix="/aws")

    return app

if __name__ == "__main__":
    app = create_app()
    # Ejecuta la app
    app.run(host="0.0.0.0", port=5005, debug=True)
