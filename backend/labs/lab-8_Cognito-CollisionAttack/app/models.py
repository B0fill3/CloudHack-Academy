from app import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    admin = db.Column(db.Boolean, default=False)


class CognitoUser(UserMixin):
    def __init__(self, email, id_token):
        self.id = email
        self.id_token = id_token

class Sneaker(db.Model):
    __tablename__ = 'sneakers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(1000), nullable=True)


class Cart(db.Model):
    __tablename__ = 'cart'

    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)  # ← sustituye ForeignKey
    sneaker_id = db.Column(db.Integer, db.ForeignKey('sneakers.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    sneaker = db.relationship('Sneaker', backref='cart_items', lazy=True)

    # No hay relación con User porque usamos Cognito → accedes con current_user.id


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), nullable=False)  # ← también aquí
    total = db.Column(db.Float, nullable=False)
    sneakers = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    sneaker_id = db.Column(db.Integer, db.ForeignKey("sneakers.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    sneaker = db.relationship("Sneaker")
    order = db.relationship("Order", back_populates="sneakers")



