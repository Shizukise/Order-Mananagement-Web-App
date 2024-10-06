import React, { useState, useEffect } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./PendingOrders.css";
import { Link } from "react-router-dom";

const OrderTable = () => {
    const [ordersArray, setOrdersArray] = useState([]);


    const SearchBar = () => {
        return (
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search order number..." aria-label="Recipient's username" aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2"><i className="bi bi-search"></i></button>
            </div>

        )
    };

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
        <SearchBar />
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
            <BodyContent >
                <OrderTable />
            </BodyContent>
        </>
    );
};

export default PendingOrders;
