from flask import render_template, redirect, url_for, request, flash, abort, session
from app import app, db
from app.models import Sneaker, User, Cart
from flask_login import login_user, logout_user, login_required, current_user
from app.models import Sneaker, Cart, Order
import pdfkit
from flask import make_response, render_template_string
import requests

@app.route('/')
def index():
    sneakers = Sneaker.query.all()
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
    return render_template('account.html', user=current_user)

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


from flask import render_template, redirect, url_for, flash
from flask_login import login_required, current_user
from app import db
from app.models import Order, OrderItem, Cart

@app.route("/add_order", methods=["POST"])
@login_required
def add_order():
    """ Crea un nuevo pedido a partir del carrito del usuario y lo guarda en la base de datos """
    
    # 1️⃣ Obtener el carrito del usuario
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    # Obtener el address de la request
    address = request.form.get("address") 

    if not address:
        flash("Please provide a valid address.", "danger")
        return redirect(url_for("cart"))

    if not cart_items:
        flash("Your cart is empty. Add items before placing an order.", "warning")
        return redirect(url_for("cart"))  # Redirige al carrito si está vacío

    # 2️⃣ Calcular el total del pedido
    total_price = sum(item.sneaker.price * item.quantity for item in cart_items)

    # 3️⃣ Crear un nuevo pedido
    new_order = Order(total=total_price, address=address)
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



@app.route('/invoice/<int:order_id>', methods=['GET'])
def generate_invoice(order_id):
    """
    Generates the invoice in PDF using data stored in the Order model and its OrderItem.
    It renders any iframe provided via order.address (for cybersecurity lab purposes).
    """
    # Retrieve the order from the database
    order = Order.query.get(order_id)
    if not order:
        abort(404, description="Order not found")

    # HTML template for the invoice with basic styling and orange accents
    html_template = """
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f9f9f9; 
          }
          h1, h2 { 
            color: #ff8533; 
          }
          .pclass { 
            font-size: 14px; 
            margin-bottom: 10px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #ffecd8; 
          }
        </style>
      </head>
      <body>
        <h1>Invoice for Order #{{ order.id }}</h1>
        <div class="pclass">
          <strong>Shipping Address:</strong> {{ order.address|safe }}
        </div>
        <div class="pclass">
          <strong>Total:</strong> ${{ order.total }}
        </div>
        <h2>Product Details</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {% for item in order.sneakers %}
            <tr>
              <td>{{ item.sneaker.name }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
            {% endfor %}
          </tbody>
        </table>
      </body>
    </html>
    """

    # Render the template passing the "order" object to access its attributes and relationships
    html_content = render_template_string(html_template, order=order)

    # Options for wkhtmltopdf via pdfkit
    options = {
        'enable-javascript': '',
        'javascript-delay': '2000',  # 2 seconds delay to load dynamic content if necessary
    }

    pdf = pdfkit.from_string(html_content, False, options=options)
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'attachment; filename=invoice.pdf'
    return response

@app.route('/ssrf-test')
def ssrf_test():
    """ Ruta vulnerable a SSRF """
    target_url = request.args.get('url')  # ⚠️ Entrada no sanitizada
    if not target_url:
        return "Error: No URL provided", 400

    try:
        response = requests.get(target_url, timeout=2)  # ⚠️ Vulnerable si accede a 169.254.169.254
        return response.text
    except requests.exceptions.RequestException as e:
        return f"Request failed: {e}", 500