from backend import app,bcrypt,db
from backend.models import User
from flask import render_template, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')              #so that it handles any url path
def serveReact(path):
    return render_template('index.html')

@app.route('/loginuser',methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Find the user by username
    user = User.query.filter_by(username=username).first()
    
    # Check if user exists and verify the password
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        print(user.username)
        return jsonify({"message": "Login successful", "user" : f"{user.username}"}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401



