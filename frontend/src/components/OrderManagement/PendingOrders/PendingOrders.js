import React, { useState, useEffect } from "react";
import ManagementNav from "../ManagementNav/Managementnav";
import { useAuth } from "../../../contexts/AuthContext";
import "./PendingOrders.css";
import { Link } from "react-router-dom";

const OrderTable = () => {
    const [ordersArray, setOrdersArray] = useState([]);

    useEffect(() => {
        // Fetch orders from the backend
        const fetchOrders = async () => {
            try {
                const response = await fetch('/getpendingorders');
                const data = await response.json();
                const ordersString = data.orders;

                // Parse the orders string into a JavaScript array of objects
                const parsedOrders = JSON.parse(ordersString.replace(/'/g, '"'));
                
                // Set the orders array state
                setOrdersArray(Array.isArray(parsedOrders) ? parsedOrders : parsedOrders.all);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const AllOrders = () => {
        if (ordersArray.length > 0) {
            return ordersArray.map(order => (
                <tr key={order.order_id}>
                    <th scope="row"><Link to={"#"}>{order.order_id}</Link></th>
                    <td>{order.customer}</td>
                    <td>{order.shipping_address}</td>
                    <td><strong>{order.order_date}</strong> by <strong>{order.creator}</strong></td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan="4">No orders available.</td>
                </tr>
            );
        }
    };

    return (
        <div className="order-table-container">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Order number</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Shipping Address</th>
                        <th scope="col">Creation</th>
                    </tr>
                </thead>
                <tbody>
                    <AllOrders />
                </tbody>
            </table>
        </div>
    );
};

const PendingOrders = () => {
    return (
        <>
            <ManagementNav />
            <OrderTable />
        </>
    );
};

export default PendingOrders;
