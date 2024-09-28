from backend import db, bcrypt, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model,UserMixin):

    __tablename__ = 'users'

    user_id = db.Column(db.Integer(),unique=True,primary_key= True)
    username = db.Column(db.String(100),nullable=False,unique=True)
    password_hash = db.Column(db.String(100),nullable=False)
    type = db.Column(db.String(18),nullable=False)

    
    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, unhashed_password):
        self.password_hash = bcrypt.generate_password_hash(unhashed_password).decode('utf-8')

    def password_authentication(self,attempted_password):
        return bcrypt.check_password_hash(self.password_hash, attempted_password)
    
    def get_id(self):
        return str(self.user_id)