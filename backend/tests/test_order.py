from sqlite3 import Timestamp
from backend.models import Order, Customer, User, Product, OrderItem, OrderHistoric, OrderMessage
from datetime import datetime


""" Order """
def test_toPending():
    order = Order()
    user = User(username = "testcreator")
    customer = Customer(customer_name = "testcustomer")
    order.order_date = datetime.now()
    order.customer = customer
    order.creator = user
    assert isinstance(order.toPending(),dict) and len(order.toPending()) == 6

def test_toAllData():
    order = Order()
    user = User(username = "testcreator")
    customer = Customer(customer_name = "testcustomer")
    order.order_date = datetime.now()
    order.customer = customer
    order.creator = user
    assert isinstance(order.toAllData(),dict) and len(order.toAllData()) == 14

def test_toDeliveryByAddress():
    order = Order()
    user = User(username = "testcreator")
    customer = Customer(customer_name = "testcustomer")
    order.order_date = datetime.now()
    order.customer = customer
    order.creator = user
    assert isinstance(order.toDeliverByAddress(),dict) and len(order.toDeliverByAddress()) == 5

# Order Item, still from database models, and with relationship with Order table itself.
""" Order Item """
def test_toItemObject():
    product = Product(product_name = "tesproduct", product_ref = "123")
    orderItem = OrderItem(product = product)
    assert isinstance(orderItem.toItemObject(),dict) and len(orderItem.toItemObject()) == 5 


# Order Message, also with relationship to Order table.
""" Order Message """
def test_toChat():
    message = OrderMessage(timestamp = datetime.now())
    assert isinstance(message.toChat(),dict) and len(message.toChat()) == 2

# Order Historic, with relationship to Order table.
""" Order Historic """
def test_toEvent():
    event = OrderHistoric(timestamp = datetime.now())
    assert isinstance(event.toEvent(),dict) and len(event.toEvent()) == 2