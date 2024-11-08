import React, { useState, useEffect, useRef } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import { useAuth } from "../../../contexts/AuthContext";
import "./CreateOrder.css";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentOrderItems, setCurrentOrderItems] = useState([]);
    const quantity = useRef();
    const selected = useRef();
    const selectedCustomer = useRef();
    const [summaryBill, setSummaryBill] = useState([]);
    const [errorModal, setErrorModal] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null)
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
    const [urgent, setUrgent] = useState(false);
    const [customers, setCustomers] = useState(null);
    const [presetCustomer, setPresetCustomer] = useState(false);

    const navigate = useNavigate()

    // Validation error states
    const [errors, setErrors] = useState({
        creatorEmail: "", // Error for creator email
        customerName: "", // Error for customer name
        customerEmail: "", // Error for customer email
        customerPhone: "", // Error for customer phone
        shippingAddress: "", // Error for shipping address
    });

    const ErrorModal = ({ title, message }) => {
        return (
            <>
                <div
                    className="modal fade show"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {title}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">{message}</div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => setErrorModal(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const ConfirmationModal = ({ title, message, onConfirm }) => {
        const handleClose = () => {
            setErrorModal(null);
            setConfirmationModal(null);
        }
        return (
            <>
                <div
                    className="modal fade show"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                    style={{ display: "block" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    {title}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">{message}</div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    style={{ marginRight: "10px" }}
                                    onClick={onConfirm}>
                                    Confirm order
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => handleClose()}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const [form1Data, setForm1Data] = useState({
        creatorEmail: user[2],
        customerName: "",
        companyName: "",
        customerEmail: "",
        customerPhone: "",
        shippingAddress: "",
        billingAddress: "",
    });

    const resetForm1Data = () => {
        setForm1Data({
            customerName: "",
            companyName: "",
            customerEmail: "",
            customerPhone: "",
        })
    };

    const [form2Data, setForm2Data] = useState({
        paymentMethod: "Credit Card",
        paymentTerms: "",
        orderNotes: "",
        deliveryMethod: "Standard Shipping", //here we have space for urgent delivery also
    });
    const [form3Data, setForm3Data] = useState({
        productSelect: "",
        productRef: "",
        productPrice: "",
        quantity: 1,
        price: 0,
    });

    // Validation function for quantity

    const ValidateQuantity = (quantity) => {
        let number = parseInt(quantity, 10)
        console.log(typeof (number))
        if (isNaN(number)) {
            return false
        }
        return true
    }

    // Validation function for email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validation function for phone number
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    // handle registered customer select
    const handleRegisteredCustomer = (e) => {
        const { value } = e.target;
        setForm1Data((prevData) => ({
            ...prevData,
            customerName: selectedCustomer.current.value,
        }));
        console.log(form1Data.customerName)
        if (selectedCustomer.current.value === "Register new customer") {
            console.log("here1")
            resetForm1Data()
            setPresetCustomer(false)
            console.log("here")
        } else {
            async function fetchCustomer() {
                try {
                    const response = await fetch(`/getcustomerdata/${value}`)
                    const result = await response.json()
                    if (response.ok) {
                        setForm1Data((prevData) => ({
                            ...prevData,
                            customerName: result.customer_name,
                            companyName: result.company_name,
                            customerEmail: result.email,
                            customerPhone: result.phone_number
                        }));
                        setPresetCustomer(true)
                    };
                } catch (error) {
                    console.log("Error : ", error)
                };
            };
            fetchCustomer()
        };
    };



    // Handle form1 changes with validation
    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setForm1Data((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validate email and phone number in real-time
        if (name === "customerEmail" || name === "creatorEmail") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validateEmail(value) ? "" : "Invalid email format",
            }));
        }
        if (name === "customerPhone") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validatePhoneNumber(value) ? "" : "Invalid phone number",
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
        let currentPrice;
        let currentRef;
        if (name !== "quantity") {
            for (const product of products) {
                if (product[0] === value) {
                    currentPrice = product[2];
                    currentRef = product[1];
                    break;
                }
            }
            const totalPrice = currentPrice * form3Data.quantity;
            setForm3Data((prevData) => ({
                ...prevData,
                [name]: value,
                productPrice: currentPrice,
                price: totalPrice,
                productRef: currentRef,
            }));
            if (name === "productSelect") {
                setSelectedProductError("");
            }
        } else if (name === "quantity") {
            let currentUnitPrice;
            let currentProductRef;
            for (const product of products) {
                if (product[0] === form3Data.productSelect) {
                    currentUnitPrice = product[2];
                    currentProductRef = product[1];
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
            }));
            if (name === "quantity") {
                setQuantityError("")
            }
        }
    };

    const [selectedProductError, setSelectedProductError] = useState("");
    const [selectedQuantityError, setQuantityError] = useState("");

    const handleAddBtn = () => {
        if (selectedProductError === "" && form3Data.productSelect !== "" && selectedQuantityError === "" && ValidateQuantity(form3Data.quantity)) {
            setCurrentOrderItems([...currentOrderItems, form3Data]);
            setForm3Data({
                productSelect: "",
                productRef: "",
                productPrice: "",
                quantity: 1,
                price: 0,
            });
            quantity.current.value = 1;
            selected.current.value = "Type to search..."
        } else if (form3Data.productSelect === "") {
            setSelectedProductError((prevDATA) => ({
                ...prevDATA,
                error: "Please select a product",
            }));
        } else {
            setQuantityError((prevData) => ({
                ...prevData,
                error: "Please insert only numbers"
            }));
        }
    };

    const handleGenerate = () => {
        setSummaryBill(currentOrderItems);
    };
    const BillData = () => {
        return summaryBill.map((product, index) => (
            <div className="order-summary" key={index}>
                <p className="order-summary-item">
                    Reference: {product["productRef"]} -- {product["productSelect"]}{" "}
                </p>
                <p className="order-summary-item">
                    Unit Price: {product["productPrice"]}.00€
                </p>
                <p className="order-summary-item">Quantity: {product["quantity"]}</p>
                <h5 className="order-summary-total">Total: {product["price"]}.00€</h5>
            </div>
        ));
    };

    useEffect(() => {
        handleGenerate();
    }, [currentOrderItems]);

    // Products and customers fetch

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
        async function fetchCustomers() {
            try {
                const response = await fetch('/getallcustomers');
                const result = await response.json();
                setCustomers(result)
            } catch (error) {
                console.log("Error fetching data: ", error)
            }
        }
        fetchProducts();
        fetchCustomers();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (!products) {
        setProducts(["error Loading products."])
    }

    if (!customers) {
        setCustomers(['error loading customers.'])
    }


    function AllCustomers() {
        return customers.map((customer) => (
            <option key={customer} value={customer}>
                {customer}
            </option>
        ))
    }

    function AllProducts() {
        return products.map((product) => (
            <option key={product[0]} value={product[0]}>
                {product[0]}
            </option>
        ));
    }

    function AllProductsOrdered() {
        const deleteItem = (indexToDelete) => {
            const updatedOrder = currentOrderItems.filter(
                (_, index) => index !== indexToDelete
            );
            setCurrentOrderItems(updatedOrder);
        };

        return currentOrderItems.map((each, index) => (
            <tr key={index}>
                <td>{each.productRef}</td>
                <td>{each.productSelect}</td>
                <td>{each.quantity}</td>
                <td>{each.productPrice}.00€</td>
                <td>{each.price}.00€</td>
                <td>
                    <button
                        className="DeleteArticleBtn"
                        onClick={() => deleteItem(index)}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </td>
            </tr>
        ));
    }

    const handleSubmit = () => {
        const errors = {};

        if (!form1Data.creatorEmail || !validateEmail(form1Data.creatorEmail)) {
            errors.creatorEmail = "Invalid or missing creator email";
        }
        if (!form1Data.customerName) {
            errors.customerName = "Customer name is required";
        }
        if (!form1Data.customerEmail || !validateEmail(form1Data.customerEmail)) {
            errors.customerEmail = "Invalid or missing customer email";
        }
        if (
            !form1Data.customerPhone ||
            !validatePhoneNumber(form1Data.customerPhone)
        ) {
            errors.customerPhone = "Invalid or missing customer phone";
        }
        if (!form1Data.shippingAddress) {
            errors.shippingAddress = "Shipping address is required";
        }
        if (currentOrderItems.length === 0) {
            errors.productSelect = "At least one product must be added to the order";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setErrorModal({
                title: "Error Submitting Order",
                message: "Please fill all the required fields correctly.",
            });

            return;
        }

        //Send order to backend here

        async function handleSubmitOrder() {
            setConfirmationModal(null)
            try {
                const response = await fetch('/createorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ form1Data, form2Data, currentOrderItems, urgent, presetCustomer }), // this is all the data for this page form
                    credentials: 'include'
                });
                const result = await response.json()
                if (response.ok) {
                    navigate('/dashboard');
                    setErrorModal({
                        title: "Success!",
                        message: `${result}`,
                    });
                } else if (response.status === 400) {
                    setErrorModal({
                        title: "Oops",
                        message: result.message
                    });
                } else if (response.status === 412) {
                    setErrorModal({
                        title: "Oops",
                        message: result.message
                    });
                } else if (response.status === 401) {
                    setErrorModal({
                        title: "Oops",
                        message: result.message
                    });
                } else if (response.status === 500) {
                    setErrorModal({
                        title: "Oops",
                        message: result.message
                    });
                } else if (response.status === 409) {
                    setErrorModal({
                        title: "Oops",
                        message: result.message
                    });
                } else {
                    setErrorModal({
                        title: "Error",
                        message: `Oops something went wrong`,
                    });
                }
            } catch (error) {
                console.error("Network error: ", error);
            }
        };

        setConfirmationModal({
            title: "Confirm",
            message: "Are you sure you want to create this order?",
            onConfirm: handleSubmitOrder
        })

    };

    return (
        <>
            <ManagementNav />
            <BodyContent>
                <div className="order-page-container">
                    {/* Creator and Customer Details Section */}
                    <div className="order-section creator-customer-container">
                        {/* Creator Details */}
                        <div className="creator-customer-details">
                            <div className="section-title">Creator Details</div>
                            <div className="form-group mb-3">
                                <label htmlFor="creatorName" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="creatorName"
                                    value={user[0]}
                                    readOnly
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="department" className="form-label">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="department"
                                    value={user[1] || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="creatorEmail" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="creatorEmail"
                                    value={user[2] || ''}
                                    onChange={handleChange1}
                                    name="creatorEmail"
                                    readOnly
                                />
                                {errors.creatorEmail && (
                                    <small className="text-danger">{errors.creatorEmail}</small>
                                )}
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="creator-customer-details">
                            <div className="section-title">Customer Details</div>
                            <div className="form-group mb-3">
                                <label htmlFor="CustomerSelect" className="form-label">
                                    Registered Customers
                                </label>
                                <select
                                    className="form-control"
                                    id="CustomerSelect"
                                    name="CustomerSelect"
                                    ref={selectedCustomer}
                                    onChange={(e) => {handleRegisteredCustomer(e)}}
                                    value={form1Data.customerName}
                                >
                                    <option>Register new customer</option>
                                    <AllCustomers />
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="customerName" className="form-label">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="customerName"
                                    placeholder="Enter customer name"
                                    value={form1Data.customerName}
                                    onChange={handleChange1}
                                    name="customerName"
                                    readOnly = {presetCustomer}
                                />
                                {errors.customerName && (
                                    <small className="text-danger">{errors.customerName}</small>
                                )}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="companyName" className="form-label">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="companyName"
                                    placeholder="Enter company name"
                                    value={form1Data.companyName}
                                    onChange={handleChange1}
                                    name="companyName"
                                    readOnly = {presetCustomer}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="customerEmail" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="customerEmail"
                                    placeholder="Enter customer email"
                                    value={form1Data.customerEmail}
                                    onChange={handleChange1}
                                    name="customerEmail"
                                    readOnly = {presetCustomer}
                                />
                                {errors.customerEmail && (
                                    <small className="text-danger">{errors.customerEmail}</small>
                                )}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="customerPhone" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="customerPhone"
                                    placeholder="Enter phone number"
                                    value={form1Data.customerPhone}
                                    onChange={handleChange1}
                                    name="customerPhone"
                                    readOnly = {presetCustomer}
                                />
                                {errors.customerPhone && (
                                    <small className="text-danger">{errors.customerPhone}</small>
                                )}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="shippingAddress" className="form-label">
                                    Shipping Address
                                </label>
                                <textarea
                                    className="form-control"
                                    id="shippingAddress"
                                    rows="2"
                                    placeholder="Enter shipping address"
                                    value={form1Data.shippingAddress}
                                    onChange={handleChange1}
                                    name="shippingAddress"
                                ></textarea>
                                {errors.shippingAddress && (
                                    <small className="text-danger">{errors.shippingAddress}</small>
                                )}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="billingAddress" className="form-label">
                                    Billing Address
                                </label>
                                <textarea
                                    className="form-control"
                                    id="billingAddress"
                                    rows="2"
                                    placeholder="Enter billing address"
                                    value={
                                        billingSameAsShipping
                                            ? form1Data.shippingAddress
                                            : form1Data.billingAddress
                                    }
                                    onChange={handleChange1}
                                    name="billingAddress"
                                    readOnly={billingSameAsShipping ? true : false}
                                ></textarea>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="flexCheckDefault"
                                        onChange={() =>
                                            setBillingSameAsShipping(!billingSameAsShipping)
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Same as shipping address
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info and Additional Info Section */}
                    <div className="order-section payment-additional-info">
                        {/* Payment Info */}
                        <div className="payment-info">
                            <div className="section-title">Payment Info</div>
                            <div className="form-group mb-3">
                                <label htmlFor="paymentMethod" className="form-label">
                                    Payment Method
                                </label>
                                <select
                                    className="form-control deliveryMethodSelect"
                                    id="paymentMethod"
                                    onChange={handleChange2}
                                    name="paymentMethod"
                                >
                                    <option>Credit Card</option>
                                    <option>PayPal</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="paymentTerms" className="form-label">
                                    Payment Terms
                                </label>
                                <input
                                    type="text"
                                    className="form-control "
                                    id="paymentTerms"
                                    placeholder="e.g., Net 30 days"
                                    value={form2Data.paymentTerms}
                                    onChange={handleChange2}
                                    name="paymentTerms"
                                    required
                                />
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="additional-info">
                            <div className="section-title">Additional Info</div>
                            <div className="form-group mb-3">
                                <label htmlFor="orderNotes" className="form-label">
                                    Order Notes
                                </label>
                                <textarea
                                    className="form-control"
                                    id="orderNotes"
                                    rows="3"
                                    placeholder="Add any notes for this order"
                                    name="orderNotes"
                                    value={form2Data.orderNotes}
                                    onChange={handleChange2}
                                ></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="deliveryMethod" className="form-label">
                                    Delivery Method
                                </label>
                                <select
                                    className="form-control deliveryMethodSelect"
                                    id="deliveryMethod"
                                    name="deliveryMethod"
                                    onChange={handleChange2}
                                >
                                    <option>Standard Shipping</option>
                                    <option>Express Shipping</option>
                                    <option>Pickup</option>
                                </select>
                                <div className="form-check Urgent">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="flexCheckDefaultUrgent"
                                        onChange={() =>
                                            setUrgent(!urgent)
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefaultUrgent">
                                        Urgent
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="card mb-4 product-details">
                        <div className="card-header bg-primary text-white">
                            Product Details
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <select
                                        className="form-control"
                                        id="productSelect"
                                        name="productSelect"
                                        onChange={handleChange3}
                                        value={form3Data.productSelect}
                                        ref={selected}
                                    >
                                        <option value="" disabled>Select a product</option>
                                        <AllProducts />
                                    </select>
                                    {selectedProductError.error && (
                                        <small className="text-danger">
                                            {selectedProductError.error}
                                        </small>
                                    )}
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label htmlFor="quantity" className="form-label">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        defaultValue="1"
                                        name="quantity"
                                        onChange={handleChange3}
                                        ref={quantity}
                                    />
                                    {selectedQuantityError.error && (
                                        <small className="text-danger">
                                            {selectedQuantityError.error}
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label htmlFor="unitPrice" className="form-label">
                                        Total price
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="unitPrice"
                                        value={form3Data.price + ".00€"}
                                        name="price"
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() => handleAddBtn()}
                                    >
                                        Add
                                    </button>
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
                                        <th scope="col"></th>
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
                            {errors.productSelect && (
                                <small className="text-danger">{errors.productSelect}</small>
                            )}
                        </div>
                    </div>

                    {errorModal && (
                        <ErrorModal title={errorModal.title} message={errorModal.message} />
                    )}
                    {confirmationModal && (
                        <ConfirmationModal
                            title={confirmationModal.title}
                            message={confirmationModal.message}
                            onConfirm={confirmationModal.onConfirm} // Pass the function here
                        />
                    )}
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end order-actions mb-4">
                        <button className="btn btn-secondary mx-2 save-draft-btn">
                            Save Draft
                        </button>
                        <button
                            className="btn btn-primary mx-2 submit-order-btn"
                            onClick={() => handleSubmit()}
                        >
                            Submit Order
                        </button>
                        <button className="btn btn-danger mx-2 cancel-btn">Cancel</button>
                    </div>
                </div>
            </BodyContent>
        </>
    );
};

export default CreateOrder;
