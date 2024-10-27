import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import UrgentImg from "../../UrgentImg";
import './OrdersByAddress.css';

const OrdersByAddress = () => {
    const [orders, setOrders] = useState([]); 
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [allIds,setAllIds] = useState(null)
    const { address } = useParams();

    const handleSelectOrder = (orderId) => {
        setSelectedOrders((prevSelected) => 
            prevSelected.includes(orderId) 
                ? prevSelected.filter(id => id !== orderId) 
                : [...prevSelected, orderId]
        );
    };

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch(`/getordersbyaddress/${address}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders);
                    let orderids = []
                    for (const order of data.orders) {
                        orderids.push(order.order_id)
                    }
                    setAllIds(orderids)
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchOrders();
    }, [address]);

    const handleSelectAll = () => {
        if (selectedOrders.length === allIds.length) {
            setSelectedOrders([])
        } else  if (selectedOrders.length > 0) {
            setSelectedOrders(allIds)
        } else {
            setSelectedOrders(allIds)
        }
    }

    const handleDeliverSelected = () => {
        console.log(selectedOrders);
        // Add delivery logic here
    };

    const OrderTable = ({ orders, onSelectOrder }) => {
        return (
            <div className="order-table-container-delivery">
                <h2 className="section-title">Orders for Selected Address</h2>
                <div className="table-responsive">
                    <table className="table table-delivery table-striped">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Creation Date</th>
                                <th>Urgent</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.order_id}
                                    className={selectedOrders.includes(order.order_id) ? "selected-order-row" : ""}
                                >
                                    <td>{order.customer}</td>
                                    <td>{order.creation_date}</td>
                                    <td>{order.urgent === 'true' ? <UrgentImg /> : ""}</td>
                                    <td>
                                        <button 
                                            className="select-order-btn"
                                            onClick={() => onSelectOrder(order.order_id)}
                                        >
                                            {selectedOrders.includes(order.order_id) ? "Deselect" : "Select for Delivery"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <>
            <ManagementNav />
            <BodyContent>
                <OrderTable orders={orders} onSelectOrder={handleSelectOrder} />
                <div className="deliver-button-container">
                    <button className="select-all-btn"
                            onClick={handleSelectAll}>
                        {selectedOrders.length === allIds?.length ? "Deselect All" : "Select All"}
                    </button>
                    <button 
                        className="deliver-selected-btn"
                        onClick={handleDeliverSelected}
                        disabled={selectedOrders.length === 0}
                    >
                        Deliver Selected Orders
                    </button>
                </div>
            </BodyContent>
        </>
    );
};

export default OrdersByAddress;
