import { useEffect, useState, useRef } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./OrderPage.css"; // Ensure your CSS is properly linked
import { useParams } from "react-router-dom";
import UrgentImg from "../../UrgentImg";
import { Link } from "react-router-dom";

const Order = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [isUrgent, setIsUrgent] = useState(false);
    const [stateColor, setStateColor] = useState("black");
    const [quantities, setQuantities] = useState(null)
    const inputRefs = useRef({})

    const OrderNav = () => {
        return (
            <div className="container-fluid">
                <nav className="nav orderNav">
                    <Link className="nav-link orderNavLink active" to={`/order/${orderId}`}>
                        Order
                    </Link>
                    <Link className="nav-link orderNavLink" to={`/orderchat/${orderId}`}>
                        Chat
                    </Link>
                    <Link className="nav-link orderNavLink" to="#">
                        Files
                    </Link>
                    <Link className="nav-link orderNavLink" to="#">
                        History
                    </Link>
                </nav>
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/getorder${orderId}data`);
                const data = await response.json();
                setOrderData(data);
                if (data.order.status === "Pending") {
                    setStateColor("#FFC107");
                    const quantities = {}
                    for (const product of data.products) {
                        quantities[product.product_name] = product.quantity
                    }
                    setQuantities(quantities)
                }
                if (data.order.urgent === "true") {
                    setIsUrgent(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [orderId]);

    const handleQuantityChange = (name,quantity) => {
        setQuantities((prevDATA) => ({
            ...prevDATA,
            [name]: quantity,
        }));
        if (inputRefs.current[name]) {
            setTimeout(() => {
                inputRefs.current[name].focus(); // Pass a function to setTimeout
            }, 1); // Focus the input element
        }
    }


    const AllItems = () => {
        if (orderData) {
            return orderData.products.map((product) => (
                <div className="row order-item-row" key={product.product_name}>
                    <div className="col-3">
                        <p>{product.product_name}</p>
                    </div>
                    <div className="col-2">
                        <p>{product.product_price}</p>
                    </div>
                    <div className="col-2">
                        <p>{product.quantity}</p>
                    </div>
                    <div className="col-2">
                        <p>{product.total_price}</p>
                    </div>
                    <div className="col-2">
                        <input
                            className="IndItemQtToDeliver"
                            type="number"
                            min={0}
                            max={product.quantity}
                            value={quantities ? quantities[product.product_name] : product.quantity}
                            onChange={(e) => handleQuantityChange(product.product_name,e.target.value,e)}
                            ref={(el) => (inputRefs.current[product.product_name] = el)}
                        />
                    </div>
                </div>
            ));
        } else {
            return <p>Error loading items</p>;
        }
    };

    return (
        <div className="order-page-container">
            <OrderNav />
            <div className="order-section creator-customer-container">
                {/* Creator Details */}
                <div className="creator-customer-details">
                    <div className="section-title">Order {orderId} Details</div>
                    <div className="form-group mb-3">
                        <label className="form-label">Order Creator</label>
                        <p className="form-control-plaintext">
                            {orderData ? orderData.order.creator : "loading..."}
                        </p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Creator Contact</label>
                        <p className="form-control-plaintext">
                            {orderData ? orderData.order.creator_contact : "loading..."}
                        </p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Creator Email</label>
                        <p className="form-control-plaintext">
                            {orderData ? orderData.order.creator_email : "loading..."}
                        </p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Remarks</label>
                        <p className="form-control-plaintext remarks">
                            {orderData ? orderData.order.remarks : "loading..."}
                        </p>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="creator-customer-details">
                    <div className="section-title">Customer & Delivery Details</div>
                    <div className="form-group mb-3">
                        <label className="form-label">Customer Contact</label>
                        <p className="form-control-plaintext">
                            {orderData ? orderData.order.customer_contact : "loading..."}
                        </p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Customer Email</label>
                        <p className="form-control-plaintext">
                            {orderData ? orderData.order.customer_email : "loading..."}
                        </p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Delivery Address</label>
                        <p className="form-control-plaintext">
                            {orderData ? orderData.order.shipping_address : "loading..."}
                        </p>
                    </div>
                    {isUrgent ? <UrgentImg /> : null}
                    <div className="form-group mb-3">
                        <label className="form-label">State</label>
                        <span className="StateStatus" style={{ backgroundColor: stateColor }}>
                            {orderData ? orderData.order.status : "loading..."}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Items Section */}
            <div className="order-section">
                <h3 className="section-title">Order Items</h3>
                <div className="OrderItemsSection">
                    <div className="row OrderItemsDivTitles">
                        <div className="col-3">
                            <h4>Item</h4>
                        </div>
                        <div className="col-2">
                            <h4>Unit Price</h4>
                        </div>
                        <div className="col-2">
                            <h4>Quantity</h4>
                        </div>
                        <div className="col-2">
                            <h4>Total Price</h4>
                        </div>
                        <div className="col-2">
                            <h4>Deliver</h4>
                        </div>
                    </div>
                    <div className="OrderItemsList">
                        <AllItems />
                    </div>
                    <div className="container-fluid TotalPrice">
                        <p>
                            Total Price: <span className="total-amount">{orderData ? orderData.order.total_amount : "loading..."}</span>
                        </p>
                    </div>

                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end order-actions mb-4">
                <button
                    type="button"
                    className="btn btn-success mx-2 ConfirmOrderBtn"
                    onClick={() => console.log(inputRefs)}
                >
                    Confirm Order
                </button>
                <button type="button" className="btn btn-danger mx-2 DeleteOrderBtn">
                    Delete Order
                </button>
            </div>
        </div>
    );
};

const OrderPage = () => {
    return (
        <>
            <ManagementNav />
            <BodyContent>
                <Order />
            </BodyContent>
        </>
    );
};

export default OrderPage;
