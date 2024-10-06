from datetime import datetime
from sqlalchemy import ForeignKey
from backend import db, bcrypt, login_manager
from flask_login import UserMixin
from sqlalchemy.sql import func


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer(), unique=True, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(18), nullable=False) 

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, unhashed_password):
        self.password_hash = bcrypt.generate_password_hash(unhashed_password).decode('utf-8')

    def password_authentication(self, attempted_password):
        return bcrypt.check_password_hash(self.password_hash, attempted_password)
    
    def get_id(self):
        return str(self.user_id)


class Product(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer(), unique=True, primary_key=True)
    product_ref = db.Column(db.String(15), nullable=False, unique=True)
    product_name = db.Column(db.String(30), nullable=False, unique=True)
    product_price = db.Column(db.Integer(), nullable=False)

# Customer Model
class Customer(db.Model):
    __tablename__ = 'customers'
    customer_id = db.Column(db.Integer(), unique=True, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    company_name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    shipping_address = db.Column(db.String(200), nullable=False)
    billing_address = db.Column(db.String(200), nullable=True)  # Billing could be optional if same as shipping

# Order Model
class Order(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer(), unique=True, primary_key=True)
    order_date = db.Column(db.DateTime(), default=func.now(), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Pending")  # Status: Pending, Completed, Shipped, etc.
    
    # Foreign Keys
    customer_id = db.Column(db.Integer(), ForeignKey('customers.customer_id'), nullable=False)  # Customer placing the order
    creator_id = db.Column(db.Integer(), ForeignKey('users.user_id'), nullable=False)  # Creator of the order (logged-in user)
    
    # Relationships
    customer = db.relationship('Customer', backref='orders')
    creator = db.relationship('User', backref='orders')

    payment_method = db.Column(db.String(50), nullable=False)  # e.g., Credit Card, PayPal, etc.
    payment_terms = db.Column(db.String(100), nullable=True)  # Optional field for specific terms

    shipping_address = db.Column(db.String(200), nullable=False)
    delivery_method = db.Column(db.String(50), nullable=False, default="Standard Shipping")  # e.g., Standard, Urgent

    # Order Total
    total_amount = db.Column(db.Integer(), nullable=False, default=0)

    def toPending(self):
        return {
            'order_id' : self.order_id,
            'order_date' : self.order_date.strftime("%m/%d %H:%M"),
            'customer' : self.customer.customer_name,
            'creator' : self.creator.username,
            'shipping_address' : self.shipping_address
        }

# OrderItem Model (Many-to-Many Relationship between Order and Product)
class OrderItem(db.Model):
    __tablename__ = 'order_items'
    order_item_id = db.Column(db.Integer(), unique=True, primary_key=True)
    order_id = db.Column(db.Integer(), ForeignKey('orders.order_id'), nullable=False)
    product_id = db.Column(db.Integer(), ForeignKey('products.product_id'), nullable=False)
    
    quantity = db.Column(db.Integer(), nullable=False)
    unit_price = db.Column(db.Integer(), nullable=False)  # Price at the time of order (could differ from current product price)
    total_price = db.Column(db.Integer(), nullable=False)

    # Relationships
    order = db.relationship('Order', backref='order_items')
    product = db.relationship('Product', backref='order_items')

