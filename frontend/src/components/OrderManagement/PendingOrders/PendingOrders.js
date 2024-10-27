import React, { useState, useEffect, useRef } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./PendingOrders.css";
import { Link } from "react-router-dom";


//Technical debt - When searching an order, searchstate will hold so even if we click in Pending orders link, it does not refresh the page.

const OrderTable = () => {
    const [ordersArray, setOrdersArray] = useState([]);
    const [searchState, setSearchState] = useState([]);

    const searchRef = useRef()

    const handleSearch = () => {
        if( searchRef.current.value === "") {
            setSearchState([])
        } else {
        setSearchState([searchRef.current.value])
        }
    }

    const SearchBar = () => {
        return (
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Search order number..."
                    aria-label="Recipient's username" aria-describedby="button-addon2" 
                    onSubmit={() => handleSearch()} ref={searchRef} onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter') {
                                                                                                                handleSearch()
                                                                                                                }}} />
                <button className="btn btn-outline-secondary" type="button" id="button-addon2" 
                onClick={() => handleSearch()}>
                    <i className="bi bi-search"></i>
                </button>
            </div>
        )
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (searchState.length < 1) {
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
            } else {
                try {
                    const response = await fetch(`/getorder${searchState}`);
                    const data = await response.json();
                    if (response.status === 404) {
                        setOrdersArray([])
                    } else {
                        setOrdersArray([data.order])
                    }
                } catch (error) {
                    console.error("error fetching order:", error)
                }
            }
        }

        fetchOrders();
    }, [searchState]);

    const AllOrders = () => {
        if (ordersArray.length > 0) {
            return ordersArray.map(order => (
                <tr key={order.order_id}>
                    <th scope="row">
                        <Link to={`/order/${order.order_id}`}>
                        Order Number - {order.order_id} 
                        </Link>
                    </th>
                    <td>{order.customer}</td>
                    <td>{order.shipping_address}</td>
                    <td><strong>{order.order_date}</strong> by <strong>{order.creator}</strong></td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan="4"></td>
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
