from backend import app,bcrypt,db
from backend.models import Product, User
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
    print(structured)
    return jsonify(structured),200

