from ast import Or
from crypt import methods
from email import message
from backend import app,bcrypt,db
from backend.models import OrderHistoric, OrderMessage, Product, User, Customer, Order, OrderItem
from flask import render_template, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
#sub
from email_validator import validate_email



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

#Create order endpoint                                               #Technical debt here - new customer with existing email: No error handling is being done here.
                                                                                        #When searching for a product, unexistant products can be inputed.
@app.route('/createorder', methods=['POST'])
@login_required
def createOrder():
    data = request.get_json()
    if not all([data.get('form1Data'), data.get('form2Data'), data.get('currentOrderItems')]):
        return jsonify({'message' : 'Missing required fields'}), 400
    
    def validateCellphone(number):  #in ui is missing user error for more than 10 characters
        return len(number) == 10

    def validateAllArticles(array):
        return len(array) >= 1

    if validateCellphone(data['form1Data']['customerPhone']) and validate_email(data['form1Data']['customerEmail']) and validateAllArticles([i for i in data['currentOrderItems']]):
        customer = Customer.query.filter_by(customer_name = data['form1Data']['customerName']).first()
        if not customer:
            newCustomer = Customer(customer_name = data['form1Data']['customerName'], company_name = data['form1Data']['companyName'],
                                   email = data['form1Data']['customerEmail'], phone = data['form1Data']['customerPhone'],
                                   shipping_address = data['form1Data']['shippingAddress'])
            db.session.add(newCustomer)
            db.session.commit()
    else:
        return jsonify({'message' : ''}), 412
    urgent = False
    if data['urgent'] == True:
        urgent = True

    customer =  Customer.query.filter_by(customer_name = data['form1Data']['customerName']).first()                               
    newOrder = Order(customer_id = customer.customer_id, creator_id = current_user.user_id, payment_method = data['form2Data']['paymentMethod'],
                     payment_terms = data['form2Data']['paymentTerms'], shipping_address = data['form1Data']['shippingAddress'], 
                     delivery_method = data['form2Data']['deliveryMethod'], total_amount = sum([i['price'] for i in data['currentOrderItems']]), urgent = urgent)
    db.session.add(newOrder)
    db.session.commit()
    for item in [i for i in data['currentOrderItems']]:
        newOrderItem = OrderItem(order_id = newOrder.order_id, product_id = Product.query.filter_by(product_ref = item['productRef']).first().product_id,
                                 quantity = item['quantity'], unit_price = item['productPrice'], total_price = item['price'])
        db.session.add(newOrderItem)
    db.session.commit()
    newHistoricEvent = OrderHistoric(order_id = newOrder.order_id, event = f"Order created by {current_user.username}.")
    db.session.add(newHistoricEvent)
    db.session.commit()
    message = "Order created sucessfully!"
    return jsonify(message),200


#Get pending orders endpoint
@app.route('/getpendingorders',methods=['GET'])
@login_required
def getPendingOrders():
    pendingOrders = Order.query.filter_by(status='Pending').all()
    return jsonify({"orders" : f"{[i.toPending() for i in pendingOrders]}"}), 200


#Get searched order
@app.route('/getorder<int:ordernumber>', methods=['GET'])
@login_required
def getSearchedOrder(ordernumber):
    try:
        order = Order.query.filter_by(order_id = ordernumber).first()
        if order is None:
            return jsonify({"message":"Order does not exist or not found"}), 404
        print(order)
        return jsonify({"order": order.toPending()}), 200
    except Exception as e:
        return jsonify({"message":"An internal error occurred"}), 500

#Get all data from order
@app.route('/getorder<int:orderid>data',methods=['GET'])
@login_required
def getAllOrderData(orderid):
    try:
        order = Order.query.filter_by(order_id = orderid).first()
        orderItems = OrderItem.query.filter_by(order_id = orderid).all()
        products = [i.toItemObject() for i in orderItems]
        if order is None:
            return jsonify({"message":"Order does not exist or not found"}), 500
        return jsonify({"order": order.toAllData(), "products" : products}), 200
    except Exception as e:
        return jsonify({"message": "An internal error occurred"}),500


#Send message endpoint (order chat page)
@app.route('/sendmessage/<int:orderid>', methods=['POST'])
@login_required
def SendMessage(orderid):
    data = request.get_json()
    try :
        newMessage = OrderMessage(order_id=orderid,content = data)
        db.session.add(newMessage)
        db.session.commit()
        return jsonify({"message":"Message sent"}),200
    except Exception as e:
        return jsonify({"message": "An internal error occurred"}), 500

#Get order messages
@app.route('/getmessages/<int:orderid>',methods=['GET'])
@login_required
def GetMessages(orderid):
    try:
        orderMessages = OrderMessage.query.filter_by(order_id = orderid).all()
        orderMessagesStruct = [i.toChat() for i in orderMessages]
        return jsonify({"messages" : orderMessagesStruct}),200
    except Exception as e:
        return jsonify({"message" : "An internal error error occurred"}), 500

#Get order historic
@app.route('/getorderhistoric/<int:orderid>' , methods=['GET'])
def GetHistoric(orderid):
    try:
        orderHistoric = OrderHistoric.query.filter_by(order_id = orderid).all()
        orderHistoricStructured = [i.toEvent() for i in orderHistoric]
        return jsonify({"events":orderHistoricStructured}), 200
    except Exception as e:
        return jsonify({"message":"An internal error occurred"}),500


#Confirm order (FUll ORDER)
@app.route('/confirmorder/<int:orderid>',methods=['POST'])
@login_required
def ConfirmFullOrder(orderid):
    order = Order.query.filter_by(order_id = orderid).first()
    order.status = "Delivery"
    historyLog = OrderHistoric(order_id = orderid, event = f"Order confirmed and sent to delivery by {current_user.username}.")
    db.session.add(historyLog)
    db.session.commit()
    return jsonify({"message":"Order confirmed successfully"}),200


#Get orders by address
@app.route('/getaddresses', methods=['GET'])
@login_required
def GetOrdersByAddress():
    addresses = [i.shipping_address for i in Order.query.all()]
    orders = {}
    for address in addresses:
        current_orders = Order.query.filter_by(shipping_address = address).all()
        orders[address] = len([i for i in current_orders if i.status == 'Delivery'])
    return jsonify({"orders":[i for i in orders.items()]}),200







#for developing made by chatgpt , only creates 20 mock rows
@app.route('/create20rows', methods=['POST'])
def create20():
    # Assuming you have a way to get a sample customer and creator for orders
    customer = Customer.query.first()  # Replace this with actual logic to get customers
    creator = User.query.first()  # Replace this with actual logic to get the current user

    if not customer or not creator:
        return jsonify({"error": "Customer or creator not found."}), 404

    for i in range(20):
        # Create the order
        newOrder = Order(
            customer_id=customer.customer_id,
            creator_id=creator.user_id,
            payment_method="Credit Card",  # Example payment method
            payment_terms="Net 30",  # Example payment terms
            shipping_address="123 Fake St, Springfield",  # Example shipping address
            delivery_method="Standard",  # Example delivery method
            total_amount=0  # Initialize total_amount
        )

        # Simulate items for the order
        currentOrderItems = [
            {
                'productRef': f'PROD{i}',  # Simulated product reference
                'quantity': 2,  # Simulated quantity
                'productPrice': 19.99,  # Simulated product price
                'price': 39.98  # Simulated total price (quantity * productPrice)
            }
            for i in range(1, 4)  # Simulating 3 items per order
        ]

        # Calculate the total amount for this order based on items
        total_amount = sum([item['price'] for item in currentOrderItems])
        newOrder.total_amount = total_amount

        # Add the new order to the session
        db.session.add(newOrder)
        db.session.commit()

        # Create order items
        for item in currentOrderItems:
            product = Product.query.filter_by(product_ref=item['productRef']).first()
            if product:  # Ensure the product exists
                newOrderItem = OrderItem(
                    order_id=newOrder.order_id,
                    product_id=product.product_id,
                    quantity=item['quantity'],
                    unit_price=item['productPrice'],
                    total_price=item['price']
                )
                db.session.add(newOrderItem)

        # Commit the order items
        db.session.commit()

    message = "20 orders created successfully!"
    return jsonify(message), 200
