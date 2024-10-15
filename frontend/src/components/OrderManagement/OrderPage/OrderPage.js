import { useEffect, useState } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./OrderPage.css"; // Ensure your CSS is properly linked
import { useParams } from "react-router-dom";

const Order = () => {
    const { orderId } = useParams();
    const [orderData,setOrderData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/getorder${orderId}data`)
                const data = await response.json()
                setOrderData(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    },[])
    
    return (
        <div className="order-page-container">
                {/* Order Data Section */}
                <div className="order-section creator-customer-container">
                    {/* Creator Details */}
                    <div className="creator-customer-details">
                        <div className="section-title">Order {orderId} Details</div>
                        <div className="form-group mb-3">
                            <label className="form-label">Order Creator</label>
                            <p className="form-control-plaintext">{orderData.order.creator}</p>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Creator Contact</label>
                            <p className="form-control-plaintext">+123456789</p> {/*need to fetch this also */}
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Creator Email</label>
                            <p className="form-control-plaintext">john.doe@example.com</p>{/*need to fetch this also */}
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="creator-customer-details">
                        <div className="section-title">Customer & Delivery Details</div>
                        <div className="form-group mb-3">
                            <label className="form-label">Customer Contact</label>
                            <p className="form-control-plaintext">+987654321</p>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Customer Email</label>
                            <p className="form-control-plaintext">customer@example.com</p>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Delivery Address</label>
                            <p className="form-control-plaintext">{orderData.order.shipping_address}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items Section */}
                <div className="order-section">
                    <h3 className="section-title">Order Items</h3>
                    <div className="OrderItemsSection">
                        <div className="row OrderItemsDivTitles">
                            <div className="col-6">
                                <h4>Item</h4>
                            </div>
                            <div className="col-3">
                                <h4>Quantity</h4>
                            </div>
                            <div className="col-3">
                                <h4>Deliver</h4>
                            </div>
                        </div>
                        <div className="OrderItemsList">
                            <div className="row">
                                <div className="col-6">
                                    <p>Item 1</p>
                                </div>
                                <div className="col-3">
                                    <p>5</p>
                                </div>
                                <div className="col-3">
                                    <input className="IndItemQtToDeliver" type="number" min={0} max={5} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <p>Item 2</p>
                                </div>
                                <div className="col-3">
                                    <p>3</p>
                                </div>
                                <div className="col-3">
                                    <input className="IndItemQtToDeliver" type="number" min={0} max={3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end order-actions mb-4">
                    <button type="button" className="btn btn-success mx-2 ConfirmOrderBtn" onClick={() => console.log(orderData)}>Confirm Order</button>
                    <button type="button" className="btn btn-danger mx-2 DeleteOrderBtn">Delete Order</button>
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
