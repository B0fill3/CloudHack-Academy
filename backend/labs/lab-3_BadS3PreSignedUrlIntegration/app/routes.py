from flask import render_template, redirect, url_for, request, flash, abort, session
from app import app, db
from app.models import Sneaker, User, Cart
from flask_login import login_user, logout_user, login_required, current_user
from app.models import Sneaker, Cart, Order, OrderItem, Cart
from .s3_services import generate_presigned_url_s3
import requests
import os





@app.route('/')
def index():
    sneakers = Sneaker.query.all()
      # Generar presigned URL para cada sneaker
    for sneaker in sneakers:
        # Suponiendo que guardas en 'image' algo como "zapatilla1.jpg"
        s3_key = f"images/{sneaker.image}"
        sneaker.image_url = generate_presigned_url_s3(s3_key)

    return render_template('index.html', sneakers=sneakers)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username_or_email = request.form['username']
        password = request.form['password']

        # Buscar al usuario (puedes buscar por username o email)
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if user:
            # Verificar la contraseña
            if user.password == password:  
                # Inicia la sesión
                login_user(user)
                flash('Has iniciado sesión correctamente!', 'success')
                return redirect(url_for('index'))
            else:
                flash('Contraseña incorrecta.', 'danger')
        else:
            flash('Usuario no encontrado.', 'warning')

    return render_template('login.html')

@app.route('/sneaker/<int:sneaker_id>')
def sneaker(sneaker_id):
    sneaker = Sneaker.query.get(sneaker_id)

    # Generar presigned URL para la imagen
    s3_key = f"images/{sneaker.image}"
    sneaker.image_url = generate_presigned_url_s3(s3_key)

    return render_template('product_detail.html', sneaker=sneaker)

@app.route('/add_to_cart/<int:sneaker_id>', methods=['POST'])


@app.route('/add_to_cart/<int:sneaker_id>', methods=['POST'])
@login_required
def add_to_cart(sneaker_id):
    # 1. Buscar la zapatilla en la BD
    sneaker = Sneaker.query.get(sneaker_id)
    if not sneaker:
        abort(404, description="Sneaker not found")

    # 2. Comprobar si ya existe en el carrito del usuario
    cart_item = Cart.query.filter_by(user_id=current_user.id, sneaker_id=sneaker.id).first()

    # 3. Si existe, incrementa la cantidad. Si no, crea un nuevo registro.
    if cart_item:
        cart_item.quantity += 1
    else:
        cart_item = Cart(user_id=current_user.id, sneaker_id=sneaker.id, quantity=1)
        db.session.add(cart_item)

    # 4. Guardar cambios en la BD
    db.session.commit()
    
    # 5. (Opcional) Mensaje de confirmación o redirección
    flash("Sneaker added to your cart!", "success")
    return redirect(url_for('cart'))

@app.route('/remove_one/<int:sneaker_id>', methods=['POST'])
@login_required
def remove_one(sneaker_id):
    """
    Elimina UNA unidad de un producto en el carrito.
    Si la cantidad llega a 0, elimina por completo el registro del carrito.
    """
    sneaker = Sneaker.query.get(sneaker_id)
    if not sneaker:
        abort(404, description="Sneaker not found")

    cart_item = Cart.query.filter_by(user_id=current_user.id, sneaker_id=sneaker.id).first()
    if not cart_item:
        # No hay nada que eliminar
        flash("Item is not in your cart.", "warning")
        return redirect(url_for('cart'))

    # Decrementar en 1
    cart_item.quantity -= 1

    # Si la cantidad llega a 0, se borra el registro
    if cart_item.quantity <= 0:
        db.session.delete(cart_item)

    db.session.commit()
    flash("One unit removed from your cart.", "success")
    return redirect(url_for('cart'))


@app.route('/remove_all/<int:sneaker_id>', methods=['POST'])
@login_required
def remove_all(sneaker_id):
    """
    Elimina TODAS las unidades de un producto del carrito.
    """
    sneaker = Sneaker.query.get(sneaker_id)
    if not sneaker:
        abort(404, description="Sneaker not found")

    cart_item = Cart.query.filter_by(user_id=current_user.id, sneaker_id=sneaker.id).first()
    if not cart_item:
        flash("Item is not in your cart.", "warning")
        return redirect(url_for('cart'))

    # Eliminar el registro completo
    db.session.delete(cart_item)
    db.session.commit()
    flash("All units of this product have been removed from your cart.", "success")
    return redirect(url_for('cart'))


@app.route('/account')
@login_required
def account():
    userdata = current_user
    #userdata.image = generate_presigned_url_s3(userdata.image)
    return render_template('account.html', user=userdata)

@app.route('/change-profile-image', methods=['POST'])
@login_required
def change_profile_image():
    
    if 'image' not in request.files:
        flash("No image uploaded.", "error")
        return redirect(url_for('account'))

    file = request.files['image']
    if file.filename == '':
        flash("No selected file.", "error")
        return redirect(url_for('account'))

    filename = file.filename
    # Guarda la imagen en S3
    s3_key = f"profile_images/{filename}"
    print(f"Subiendo imagen a S3: {s3_key}")
    
    # Normalizar la clave (ruta) del objeto
    s3_key = os.path.normpath(s3_key)

    # Actualiza el campo image en la base de datos
    current_user.image = f"profile_images/{filename}"
    db.session.commit()

    # Genera una URL prefirmada para subir la imagen
    presigned_url = generate_presigned_url_s3(s3_key, method='put_object')
    if not presigned_url:
        flash("Error al generar la URL prefirmada.", "error")
        return redirect(url_for('account'))
    
    # Sube la imagen a S3
    with requests.put(presigned_url, data=file.stream, headers={'Content-Type': 'image/jpeg'}) as response:
        if response.status_code != 200:
            flash("Error al subir la imagen a S3.", "error")
            return redirect(url_for('account'))

   

    flash("Profile image updated successfully!", "success")
    return redirect(url_for('account'))

#Obtener la key de la imagen y generar la URL prefirmada
@app.route('/get-image', methods=['GET'])
def get_image():
    # Obtener la key de la imagen
    key = request.args.get('key')
    if not key:
        return "No key provided", 400
    
    # Generar la URL prefirmada
    presigned_url = generate_presigned_url_s3(key)
    if not presigned_url:
        return "Error generating presigned URL", 500
    
    # Redirigir a la URL prefirmada
    return redirect(presigned_url)

    

@app.route('/cart')
@login_required
def cart():
    # Obtener todos los ítems de carrito del usuario actual
    cart_items = (db.session.query(Cart)
                  .join(Sneaker, Cart.sneaker_id == Sneaker.id)
                  .filter(Cart.user_id == current_user.id)
                  .all())
    
    # Cálculo ejemplo en Python (podrías hacerlo en la plantilla también)
    sub_total = 0
    for item in cart_items:
        sub_total += item.sneaker.price * item.quantity
        
    total = sub_total 

    return render_template('cart.html',
                           cart_items=cart_items,
                           total=total)




@app.route("/add_order", methods=["POST"])
@login_required
def add_order():
    """ Crea un nuevo pedido a partir del carrito del usuario y lo guarda en la base de datos """
    
    # 1️⃣ Obtener el carrito del usuario
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()

    if not cart_items:
        flash("Your cart is empty. Add items before placing an order.", "warning")
        return redirect(url_for("cart"))  # Redirige al carrito si está vacío

    # 2️⃣ Calcular el total del pedido
    total_price = sum(item.sneaker.price * item.quantity for item in cart_items)

    # 3️⃣ Crear un nuevo pedido
    new_order = Order(total=total_price)
    db.session.add(new_order)
    db.session.commit()  # Se guarda el pedido para obtener su ID

    # 4️⃣ Añadir los productos del carrito al pedido
    for item in cart_items:
        order_item = OrderItem(order_id=new_order.id, sneaker_id=item.sneaker.id, quantity=item.quantity)
        db.session.add(order_item)

    # 5️⃣ Vaciar el carrito después de generar el pedido
    Cart.query.filter_by(user_id=current_user.id).delete()

    # 6️⃣ Guardar cambios en la base de datos
    db.session.commit()

    # 7️⃣ Redirigir a la página de confirmación del pedido
    flash("Order placed successfully!", "success")
    return redirect(url_for("order_confirmation", order_id=new_order.id))


@app.route("/order_confirmation/<int:order_id>")
@login_required
def order_confirmation(order_id):
    order = Order.query.get(order_id)
    
    if not order:
        abort(404, description="Order not found")

    return render_template("order-confirmation.html", order=order)



@app.route('/logout')
def logout():
    # Lógica de logout
    logout_user()
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def admin_panel():
    if not current_user.admin:
        abort(403)  # Acceso prohibido para usuarios no admin
    users = User.query.filter_by(admin=False).all()
    return render_template('admin_panel.html', users=users)

@app.route('/delete_user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):
    if not current_user.admin:
        abort(403)
    user_to_delete = User.query.get_or_404(user_id)
    
    # Evita que el admin se borre a sí mismo
    if user_to_delete.id == current_user.id:
        flash("You cannot delete yourself!", "danger")
        return redirect(url_for('admin_panel'))

    if user_to_delete.username == "steve":
        session['lab_solved'] = True

    db.session.delete(user_to_delete)
    db.session.commit()
    flash("User deleted successfully.", "success")
    return redirect(url_for('admin_panel'))


@app.route('/clear_lab_solved', methods=['POST'])
def clear_lab_solved():
    session.pop('lab_solved', None)
    return '', 204



