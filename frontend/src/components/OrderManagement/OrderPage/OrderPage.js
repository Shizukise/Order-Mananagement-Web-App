import { useEffect, useState, useRef } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./OrderPage.css"; // Ensure your CSS is properly linked
import { useParams,useNavigate } from "react-router-dom";
import UrgentImg from "../../UrgentImg";
import { Link } from "react-router-dom";

const Order = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [isUrgent, setIsUrgent] = useState(false);
    const [stateColor, setStateColor] = useState("black");
    const [quantities, setQuantities] = useState(null)
    const [delivery, setDelivery] = useState(false)
    const [confirmationModal,setConfirmationModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [refresh,setRefresh] = useState(true)
    const inputRefs = useRef({})
    const navigate = useNavigate()

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
                    <Link className="nav-link orderNavLink" to={`/orderhistoric/${orderId}`}>
                        History
                    </Link>
                </nav>
            </div>
        );
    };

    const handleConfirmationModal = () => setConfirmationModal(true)
    const handleCloseModal = () => {
        setConfirmationModal(false);
        setDeleteModal(false);
        }
    const handleDeleteModal = () => setDeleteModal(true)
    

    const ConfirmationModal = ({ show, onClose, title, children, onSave }) => {
        if (!show) return null; 
    
        return (
            <div className="custom-modal" onClick={onClose}>
                <div className="custom-modal-dialog" onClick={(e) => e.stopPropagation()}>
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <h5 className="custom-modal-title">{title}</h5>
                            <button type="button" className="close-btn" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <div className="custom-modal-body">
                            {children}
                        </div>
                        <div className="custom-modal-footer">
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button type="button" className="btn-primary" onClick={onSave}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DeleteModal = ({ show, onClose, title, children, onSave }) => {
        if (!show) return null; 
    
        return (
            <div className="custom-modal" onClick={onClose}>
                <div className="custom-modal-dialog" >
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <h5 className="custom-modal-title">{title}</h5>
                            <button type="button" className="close-btn" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <div className="custom-modal-body">
                            {children}
                        </div>
                        <div className="custom-modal-footer">
                            <button type="button" className="btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button type="button" className="btn-danger" onClick={onSave}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
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
                } else if (data.order.status === "Delivery") {
                    setDelivery(true)
                    setStateColor("#4FC3F7");
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
    }, [orderId,refresh]);

    const handleQuantityChange = (name,quantity) => {
        setQuantities((prevDATA) => ({
            ...prevDATA,
            [name]: quantity,
        }));
        if (inputRefs.current[name]) {
            setTimeout(() => {
                inputRefs.current[name].focus(); 
            }, 1); 
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
                        <p>{product.product_price},00€</p>
                    </div>
                    <div className="col-2">
                        <p>{product.quantity}</p>
                    </div>
                    <div className="col-2">
                        <p>{product.total_price},00€</p>
                    </div>
                    <div className="col-2">
                        <input
                            className="IndItemQtToDeliver"
                            type={delivery ? "text": "number"}
                            min={0}
                            max={product.quantity}
                            value={quantities ? (quantities[product.product_name] <= product.quantity ? quantities[product.product_name] : product.quantitiy) : product.quantity}
                            onChange={(e) => handleQuantityChange(product.product_name,e.target.value,e)} 
                            ref={(el) => (inputRefs.current[product.product_name] = el)}
                            disabled = {delivery}
                        />
                    </div>
                </div>
            ));
        } else {
            return <p>Error loading items</p>;
        }
    };


    
    async function confirm() {
        const response = await fetch(`/confirmorder/${orderId}`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantities }), 
            credentials: 'include'
        });
        if (response.ok) {
            console.log("should navigate")
            navigate(`/order/${orderId}`)
            setConfirmationModal(false)
            setRefresh(!refresh)
        }      
    }

    async function deleteOrder() {
        const response = await fetch(`/deleteorder/${orderId}`,{
            method: 'DELETE',
            headers : { 'Content-Type' : 'application/json' },
            credentials : 'include'
        });
        if (response.ok) {
            navigate('/pendingorders')
            setConfirmationModal(false)
        }
    }
    
    const ActionButtons = () => {
        if (delivery) {
            return (
                <div className="d-flex justify-content-end order-actions mb-4">
                    <button type="button" className="btn btn-danger mx-2 DeleteOrderBtn"
                        onClick={() => handleDeleteModal()}>
                        Delete Order
                    </button>
                </div>
            )
        } else {
            return (
                <div className="d-flex justify-content-end order-actions mb-4">
                    <button
                        type="button"
                        className="btn btn-success mx-2 ConfirmOrderBtn"
                        onClick={() => handleConfirmationModal()}
                    >
                        Confirm Order
                    </button>
                    <button type="button" className="btn btn-danger mx-2 DeleteOrderBtn"
                        onClick={() => handleDeleteModal()}>
                        Delete Order
                    </button>
                </div>
            )
        }
    }


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
                            Total Price: <span className="total-amount">{orderData ? orderData.order.total_amount : "loading..."},00 €</span>
                        </p>
                    </div>

                </div>
            </div>
            <ConfirmationModal
                show={confirmationModal}
                onClose={handleCloseModal}
                onSave={() => confirm()}
                title="Alert"
            >
                <p>Do you wish to confirm order and send it to delivery?</p>
            </ConfirmationModal>

            <DeleteModal
                show={deleteModal}
                onClose={handleCloseModal}
                onSave={() => deleteOrder()}
                title="Alert"
            >
                <p>Do you really wish to delete order?</p>
            </DeleteModal>

            {/* Action Buttons */}
            <ActionButtons />
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
