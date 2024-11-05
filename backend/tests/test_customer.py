from backend.models import Customer


def test_toRegistered_Customer():
    customer = Customer()
    assert isinstance(customer.toRegisteredCustomer(), dict)