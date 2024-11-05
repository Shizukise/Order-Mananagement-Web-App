import pytest
from backend.models import User

def test_user_password_not_string():
    user = User()
    with pytest.raises(TypeError):
        passwords_not_str = [["a","b"],1,(2,"a"),{"a":0}]
        for password in passwords_not_str:
            user.password = password
    
def test_correct_hash_lenght():
    user = User()
    user.password = "sample_password"
    hashed_password = user.password_hash
    assert len(hashed_password) == 60

def test_password_auth():
    user = User()
    user.password = "sample_password"
    assert user.password_authentication("sample_password")

def test_get_user_id():
    user = User(username="testuser", password="password123")
    assert user.get_id() == str(user.user_id)
