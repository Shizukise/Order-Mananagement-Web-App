import React, { useState, useEffect, useRef } from 'react';
import ManagementNav from '../ManagementNav/Managementnav';
import { useAuth } from '../../../contexts/AuthContext';
import './CreateOrder.css'; 

const CreateOrder = () => {
    const { user } = useAuth()
    const [products, setProducts] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentOrderItems, setCurrentOrderItems] = useState([])
    const quantity = useRef()
    const selected = useRef()
    const [summaryBill, setSummaryBill] = useState([])

    const [form1Data, setForm1Data] = useState({
        creatorEmail: '',
        customerName: '',
        companyName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        billingAddress: ''
    });
    const [form2Data, setForm2Data] = useState({
        paymentMethod: 'Credit Card',
        paymentTerms: '',
        orderNotes: '',
        deliveryMethod: 'Standard Shipping'    //here we have space for urgent delivery also
    })
    const [form3Data, setForm3Data] = useState({
        productSelect: '',
        productRef: '',
        productPrice: '',
        quantity: 1,
        price: 0
    })

    // Validation error states
    const [errors, setErrors] = useState({
        customerEmail: '',
        customerPhone: '',
        creatorEmail: '',
    });

    // Validation function for email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validation function for phone number
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10,15}$/; // Allow only digits, 10-15 characters
        return phoneRegex.test(phone);
    };

    // Handle form1 changes with validation
    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setForm1Data((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validate email and phone number in real-time
        if (name === 'customerEmail' || name === 'creatorEmail') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validateEmail(value) ? '' : 'Invalid email format',
            }));
        }
        if (name === 'customerPhone') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validatePhoneNumber(value) ? '' : 'Invalid phone number',
            }));
        }
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setForm2Data((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleChange3 = (e) => {
        const { name, value } = e.target;
        let currentPrice
        let currentRef
        if (name !== "quantity") {
            for (const product of products) {
                if (product[0] === value) {
                    currentPrice = product[2];
                    currentRef = product[1]
                    break;
                }
            };
            const totalPrice = currentPrice * form3Data.quantity
            setForm3Data((prevData) => ({
                ...prevData,
                [name]: value,
                productPrice: currentPrice,
                price: totalPrice,
                productRef: currentRef
            }));
            if (name === "productSelect") {
                setSelectedProductError('')
            }
        } else if (name === "quantity") {
            let currentUnitPrice
            let currentProductRef
            for (const product of products) {
                if (product[0] === form3Data.productSelect) {
                    currentUnitPrice = product[2]
                    currentProductRef = product[1]
                    break;
                }
            }
            setForm3Data((prevData) => ({
                ...prevData,
                productSelect: selected.current.value,
                productPrice: currentUnitPrice,
                productRef: currentProductRef,
                [name]: value,
                price: currentUnitPrice * value,
            }))
        };
    }


    const [selectedProductError,setSelectedProductError] = useState('')

    const handleAddBtn = () => {
        if (selectedProductError === '' && form3Data.productSelect !== '') {
            setCurrentOrderItems([...currentOrderItems, form3Data])
            setForm3Data({
                productSelect: '',
                productRef: '',
                productPrice: '',
                quantity: 1,
                price: 0                     
            });
            quantity.current.value = 0
        } else {
            setSelectedProductError((prevDATA) => ({
                ...prevDATA,
                error : 'Please select a product'
            }))
        };

    };


    const handleGenerate = () => {
        setSummaryBill(currentOrderItems)
    }
    const BillData = () => {
        return summaryBill.map((product) => (
            <div className='order-summary' key={product['productRef']}>
                <p className="order-summary-item">Reference: {product['productRef']} -- {product['productSelect']} </p>
                <p className="order-summary-item">Unit Price: {product['productPrice']}.00€</p>
                <p className="order-summary-item">Quantity: {product['quantity']}</p>
                <h5 className="order-summary-total">Total: {product['price']}.00€</h5>
            </div>
        ))
    }

    useEffect(() => {
        handleGenerate()
    }, [currentOrderItems])

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`/getallproducts`);
                const result = await response.json();
                setProducts(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        }
        fetchProducts()
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (!products) {
        return <p>error loading item</p>
    }



    function AllProducts() {
        return products.map(product => (
            <option key={product[0]}>
                {product[0]}
            </option>
        ));
    };

    function AllProductsOrdered() {

        const deleteItem = (indexToDelete) => {
            const updatedOrder = currentOrderItems.filter((_, index) => index !== indexToDelete);
            setCurrentOrderItems(updatedOrder);
        };

        return currentOrderItems.map((each, index) => (
            <tr key={each.productRef || index}>
                <td>{each.productRef}</td>
                <td>{each.productSelect}</td>
                <td>{each.quantity}</td>
                <td>{each.productPrice}.00€</td>
                <td>{each.price}.00€</td>
                <td><button className="DeleteArticleBtn" onClick={() => deleteItem(index)}><i className="bi bi-x-lg"></i></button></td>
            </tr>
        ));
    }



    return (
        <>
            <ManagementNav />
            <div className="order-page-container">

                {/* Creator and Customer Details Section */}
                <div className="order-section creator-customer-container">

                    {/* Creator Details */}
                    <div className="creator-customer-details">
                        <div className="section-title">Creator Details</div>
                        <div className="form-group mb-3">
                            <label htmlFor="creatorName" className="form-label">Name</label>
                            <input type="text" className="form-control" id="creatorName" value={user} readOnly />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="department" className="form-label">Department</label>
                            <input type="text" className="form-control" id="department" value={user/* ?.department || '' */} readOnly />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="creatorEmail" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="creatorEmail"
                                placeholder='name@example.com'
                                value={form1Data.creatorEmail}
                                onChange={handleChange1}
                                name="creatorEmail"
                            />
                            {errors.creatorEmail && <small className="text-danger">{errors.creatorEmail}</small>}
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="creator-customer-details">
                        <div className="section-title">Customer Details</div>
                        <div className="form-group mb-3">
                            <label htmlFor="customerName" className="form-label">Customer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="customerName"
                                placeholder="Enter customer name"
                                value={form1Data.customerName}
                                onChange={handleChange1}
                                name="customerName"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="companyName" className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="companyName"
                                placeholder="Enter company name"
                                value={form1Data.companyName}
                                onChange={handleChange1}
                                name="companyName"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="customerEmail" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="customerEmail"
                                placeholder="Enter customer email"
                                value={form1Data.customerEmail}
                                onChange={handleChange1}
                                name="customerEmail"
                            />
                            {errors.customerEmail && <small className="text-danger">{errors.customerEmail}</small>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="customerPhone" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="customerPhone"
                                placeholder="Enter phone number"
                                value={form1Data.customerPhone}
                                onChange={handleChange1}
                                name="customerPhone"
                            />
                            {errors.customerPhone && <small className="text-danger">{errors.customerPhone}</small>}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="shippingAddress" className="form-label">Shipping Address</label>
                            <textarea
                                className="form-control"
                                id="shippingAddress"
                                rows="2"
                                placeholder="Enter shipping address"
                                value={form1Data.shippingAddress}
                                onChange={handleChange1}
                                name="shippingAddress"
                            ></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="billingAddress" className="form-label">Billing Address</label>
                            <textarea
                                className="form-control"
                                id="billingAddress"
                                rows="2"
                                placeholder="Enter billing address"
                                value={form1Data.billingAddress}
                                onChange={handleChange1}
                                name="billingAddress"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Payment Info and Additional Info Section */}
                <div className="order-section payment-additional-info">
                    {/* Payment Info */}
                    <div className="payment-info">
                        <div className="section-title">Payment Info</div>
                        <div className="form-group mb-3">
                            <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                            <select className="form-control" id="paymentMethod" onChange={handleChange2} name='paymentMethod'>
                                <option>Credit Card</option>
                                <option>PayPal</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="paymentTerms" className="form-label">Payment Terms</label>
                            <input type="text" className="form-control" id="paymentTerms" placeholder="e.g., Net 30 days" value={form2Data.paymentTerms}
                                onChange={handleChange2} name='paymentTerms' required />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="additional-info">
                        <div className="section-title">Additional Info</div>
                        <div className="form-group mb-3">
                            <label htmlFor="orderNotes" className="form-label">Order Notes</label>
                            <textarea className="form-control" id="orderNotes" rows="3" placeholder="Add any notes for this order" name='orderNotes'
                                value={form2Data.orderNotes} onChange={handleChange2}></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="deliveryMethod" className="form-label">Delivery Method</label>
                            <select className="form-control" id="deliveryMethod" name='deliveryMethod' onChange={handleChange2}>
                                <option>Standard Shipping</option>
                                <option>Express Shipping</option>
                                <option>Pickup</option>
                            </select>
                        </div>
                    </div>
                </div>



                {/* Product Details Section */}
                <div className="card mb-4 product-details">
                    <div className="card-header bg-primary text-white">Product Details</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <select className='form-control' id='productSelect' name='productSelect' onChange={handleChange3} value={form3Data.productSelect} ref={selected}>
                                    <AllProducts />
                                </select>
                                {selectedProductError.error && <small className="text-danger">{selectedProductError.error}</small>}
                            </div>
                            <div className="col-md-2 mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" className="form-control" id="quantity" defaultValue="1" name='quantity' onChange={handleChange3} ref={quantity} />
                            </div>
                            <div className="col-md-2 mb-3">
                                <label htmlFor="unitPrice" className="form-label">Total price</label>
                                <input type="text" className="form-control" id="unitPrice" value={form3Data.price + ".00€"} name='price' readOnly />
                            </div>
                            <div className="col-md-2 mb-3 d-flex align-items-end">
                                <button className="btn btn-success w-100" onClick={() => handleAddBtn()}>Add</button>
                            </div>
                        </div>

                        {/* Product List */}
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Product ID</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Unit Price</th>
                                    <th scope="col">Total</th>
                                    <th scope='col'></th>
                                </tr>
                            </thead>
                            <tbody>
                                <AllProductsOrdered />
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Order Summary Section */}
                <div className="card mb-4 order-summary-card">
                    <div className="card-header bg-primary text-white">Order Summary</div>
                    <div className="card-body">
                        {summaryBill && <BillData data={summaryBill} />}
                    </div>
                </div>


                {/* Action Buttons */}
                <div className="d-flex justify-content-end order-actions mb-4">
                    <button className="btn btn-secondary mx-2 save-draft-btn">Save Draft</button>
                    <button className="btn btn-primary mx-2 submit-order-btn">Submit Order</button>
                    <button className="btn btn-danger mx-2 cancel-btn">Cancel</button>
                </div>

            </div>
        </>
    );
};

export default CreateOrder;
