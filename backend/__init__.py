from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from config import db_api_uri, secret_key
from datetime import timedelta



app = Flask(__name__, static_folder='../frontend/build', template_folder='../frontend/build')
app.config['SQLALCHEMY_DATABASE_URI'] = db_api_uri
app.config['SECRET_KEY'] = secret_key
app.config['SESSION_COOKIE_NAME'] = 'FLASKESSIONID'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # 1 day

login_manager = LoginManager(app)

db = SQLAlchemy(app)
migrate = Migrate(app,db)


bcrypt = Bcrypt(app)

CORS(app, supports_credentials=True,  resources={r"/*": {"origins": "http://localhost:3000"}})

from backend import routes