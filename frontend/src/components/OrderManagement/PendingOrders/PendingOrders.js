import React, { useState, useEffect, useRef } from "react";
import ManagementNav from "../ManagementNav/Managementnav";
import { useAuth } from "../../../contexts/AuthContext";
import "./PendingOrders.css";
import { Link } from "react-router-dom";


const OrderTable = () => {
    const [orders,setOrders] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch('/getpendingorders');
                const result = await response.json();
                setOrders(result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false)
            }             
        }
        fetchOrders()
    },[]);

    if (loading) {
        return ( <div className="spinner-border" role="status">
            <span className="visually-hidden"></span>
        </div>)
    }
    if (!orders) {
        return <p>Error fetching data</p>
    }

    const ordersArray = Array.isArray(orders) ? orders : orders.all; //turn orders into an array

    const AllOrders = () => {
        if (ordersArray) {
            return ordersArray.map(order => (
                <tr key={order[0]}>
                    <th scope="row"><Link to={"#"}>{order['order_id']}</Link></th>
                    <td scope="row">{order['customer']}</td>
                    <td scope="row">{order['creator']}</td>
                    <td scope="row">{order['order_date']}</td>
                </tr>
            ))
        }
    }

    return (
      <div className="order-table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Order number</th>
              <th scope="col">Customer</th>
              <th scope="col">Created by</th>
              <th scope="col">Creation date</th>
            </tr>
          </thead>
          <tbody>
            <AllOrders/>
          </tbody>
        </table>
      </div>
    );
  };




const PendingOrders = () => {
    return (
        <>
            <ManagementNav/>
            <OrderTable />
        </>
    )
}




export default PendingOrders