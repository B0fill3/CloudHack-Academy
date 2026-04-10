# app/db_init.py

from app import app, db
from app.models import Sneaker, User, Cart

def initialize_db():
    with app.app_context():
        # Reseteamos
        db.drop_all()

        # Creamos las tablas
        db.create_all()

        if not Sneaker.query.first():
            sample_sneakers = [
                Sneaker(name='Nike Air Max', price=120.0, image='nikeairmax.webp', description='Ligeras y cómodas'),
                Sneaker(name='Adidas Ultraboost', price=140.0, image='adidasultraboost.jpg', description='Para correr largas distancias'),
                Sneaker(name='Puma RS-X', price=110.0, image='pumarsx.webp', description='Estilo retro y moderno'),
                Sneaker(name='Reebok Classic', price=90.0, image='reebokclassic.jpg', description='Clásicas y elegantes'),
                Sneaker(name='New Balance 574', price=100.0, image='newbalance574.jpg', description='Comodidad y durabilidad'),
                Sneaker(name='Converse Chuck Taylor', price=60.0, image='conversechucktaylor.jpg', description='Icónicas y versátiles'),
                Sneaker(name='Vans Old Skool', price=70.0, image='vansoldskool.jpg', description='Estilo skater clásico'),
                Sneaker(name='Asics Gel-Kayano', price=150.0, image='asicsgelkayano.jpg', description='Soporte y amortiguación'),
                Sneaker(name='Jordan 1 Retro', price=160.0, image='jordan1retro.jpg', description='Diseño legendario'),
                Sneaker(name='Under Armour HOVR', price=130.0, image='underarmourhovr.jpg', description='Tecnología de amortiguación avanzada'),
            ]
            db.session.bulk_save_objects(sample_sneakers)
            db.session.commit()

        if not User.query.first():
            admin_user = User(username='admin', password='iyh?p0iojfuhk$9i81', email='admin@shoplab.com', admin=True)
            db.session.add(admin_user)
            user1 = User(username='david', password='pwdavid', email='davidj@notshoplab.com', admin=False)
            db.session.add(user1)
            user2 = User(username='steve', password='Jo7gtnh7iW_sOan', email='steve@notshoplab.com', admin=False)
            db.session.add(user2)
            db.session.commit()

if __name__ == '__main__':
    initialize_db()
    print('Database initialized')