import { useEffect, useState } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./OrderPage.css"; // Ensure your CSS is properly linked
import { useParams } from "react-router-dom";

const Order = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState(null)
    const [isUrgent, setIsUrgent] = useState(true)    // only for development. This needs to be passed from backend, and defined when creating order
    const [stateColor, setStateColor] = useState("black")




    const UrgentImg = () => {
        return (
            <div className="form-group mb-3">
                <span><img alt="UrgentIcon" src={require("../../../assets/images/alarm.png")} className="UrgentIcon" /> Urgent</span>
            </div>

        )
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/getorder${orderId}data`)
                const data = await response.json()
                setOrderData(data)
                if (data.order.status === "Pending") {
                    setStateColor("#FFC107")
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])


    const AllItems = () => {
        if (orderData) {
        return orderData.products.map(product => (
            <div className="row">
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
                <input className="IndItemQtToDeliver" type="number" min={0} max={product.quantity} />
            </div>
        </div>
        ))
    } else {
        return (
            <p>Error Loading items</p>
        )
    }
        
    }

    return (
        <div className="order-page-container">
            {/* Order Data Section */}
            <div className="order-section creator-customer-container">
                {/* Creator Details */}
                <div className="creator-customer-details">
                    <div className="section-title">Order {orderId} Details</div>
                    <div className="form-group mb-3">
                        <label className="form-label">Order Creator</label>
                        <p className="form-control-plaintext">{orderData ? orderData.order.creator : "loading.."}</p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Creator Contact</label>
                        <p className="form-control-plaintext">{orderData ? orderData.order.creator_contact : "loading.."}</p> {/*need to fetch this also */}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Creator Email</label>
                        <p className="form-control-plaintext">john.doe@example.com</p>{/*need to fetch this also */}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Remarks</label>
                        <p className="form-control-plaintext">blablabla...</p>{/*need to fetch this also */}
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
                        <p className="form-control-plaintext">{orderData ? orderData.order.customer_email : "loading.."}</p>
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">Delivery Address</label>
                        <p className="form-control-plaintext">{orderData ? orderData.order.shipping_address : "Loading .."}</p>
                    </div>
                    {isUrgent ? <UrgentImg /> : null}
                    <div className="form-group mb-3">
                        <label className="form-label">State</label>
                        <span className="StateStatus" style={{ backgroundColor: stateColor }}>{orderData ? orderData.order.status : "Loading.."}</span>
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
                <span className="margintop"><br></br></span>
                <Order />
            </BodyContent>
        </>
    );
};

export default OrderPage;
