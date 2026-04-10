from app import db
from flask_login import UserMixin

class Sneaker(db.Model):
    __tablename__ = 'sneakers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(1000), nullable=True)


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    admin = db.Column(db.Boolean, default=False)



class Cart(db.Model):
    __tablename__ = 'cart'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sneaker_id = db.Column(db.Integer, db.ForeignKey('sneakers.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Relaciones bidireccionales con backref para cada modelo
    user = db.relationship('User', backref='cart_items', lazy=True)
    sneaker = db.relationship('Sneaker', backref='cart_items', lazy=True)



