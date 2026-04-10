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



# Modelo de Pedido
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID del pedido
    total = db.Column(db.Float, nullable=False)   # Precio total
    sneakers = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    address = db.Column(db.String(200), nullable=False)  # Dirección de envío

# Relación entre Pedido y Zapatillas
class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    sneaker_id = db.Column(db.Integer, db.ForeignKey("sneakers.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    sneaker = db.relationship("Sneaker")
    order = db.relationship("Order", back_populates="sneakers")



