import React, { useEffect, useState } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import './DeliveryPage.css';
import { useNavigate } from "react-router-dom";

const OrderTable = () => {
    const [orders,setOrders] = useState()
    const navigate = useNavigate()


    useEffect(() => {
        async function fetchAddresses () {
            try {
                const response = await fetch('/getaddresses');
                const data  = await response.json();
                if (response.ok) {
                    setOrders(data.orders)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAddresses()
    },[])

    const AllAddresses = () => {
        if (orders) {
        return orders.map((order, index) => (
            <tr key={index}>
                <td>{order[0]}</td>
                <td>{order[1]}</td>
                <td>
                    <button className="go-to-address-btn" onClick={() => navigate(`/ordersbyaddress/${order[0]}`)}>
                        Show orders
                    </button>
                </td>
            </tr>
        ))
        }
    }

    return (
        <div className="order-table-container">
            <h2 className="section-title">Out for delivery</h2>
            <div className="table-responsive">
                <table className="table table-striped delivery-table">
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Number of Orders</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <AllAddresses/>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DeliveryPage = () => {
    return (
        <>
            <ManagementNav />
            <BodyContent>
                <OrderTable />
            </BodyContent>
        </>
    );
};

export default DeliveryPage;
