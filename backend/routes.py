from backend import app,bcrypt,db
from backend.models import Product, User, Customer, Order, OrderItem
from flask import render_template, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')              #so that it handles any url path
def serveReact(path):
    return render_template('index.html')



#Login endpoint
@app.route('/loginuser',methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Find the user by username
    user = User.query.filter_by(username=username).first()
    
    # Check if user exists and verify the password( only hashed version of password is checked )
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        session.permanent = True
        return jsonify({"message": "Login successful", "user" : f"{user.username}", "department" : f"{user.type}"}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

#Logout endpoint
@app.route('/logoutuser',methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message":"Logout successful"}), 200

#Get all products endpoint
@app.route('/getallproducts',methods=['GET'])
@login_required
def getAllProducts():
    allProducts = Product.query.all()
    structured = [[i.product_name,i.product_ref, i.product_price] for i in allProducts]
    return jsonify(structured),200

#Create order endpoint
@app.route('/createorder', methods=['POST'])
def createOrder():
    data = request.get_json()            #customer name might be the same, but not the email and phone, need to find a way for that
    customer = Customer.query.filter_by(customer_name = data['form1Data']['customerName']).first()
    if not customer:
        newCustomer = Customer(customer_name = data['form1Data']['customerName'], company_name = data['form1Data']['companyName'],
                               email = data['form1Data']['customerEmail'], phone = data['form1Data']['customerPhone'],
                               shipping_address = data['form1Data']['shippingAddress'])
        db.session.add(newCustomer)
        db.session.commit()                                         #current_user.user_id
    newOrder = Order(customer_id = customer.customer_id, creator_id = 1, payment_method = data['form2Data']['paymentMethod'],
                     payment_terms = data['form2Data']['paymentTerms'], shipping_address = data['form1Data']['shippingAddress'], 
                     delivery_method = data['form2Data']['deliveryMethod'], total_amount = sum([i['price'] for i in data['currentOrderItems']]))
    db.session.add(newOrder)
    db.session.commit()
    for item in [i for i in data['currentOrderItems']]:
        newOrderItem = OrderItem(order_id = newOrder.order_id, product_id = Product.query.filter_by(product_ref = item['productRef']).first().product_id,
                                 quantity = item['quantity'], unit_price = item['productPrice'], total_price = item['price'])
        db.session.add(newOrderItem)
        print(newOrderItem)
    db.session.commit()
    message = "Order created sucessfully!"
    return jsonify(message),200