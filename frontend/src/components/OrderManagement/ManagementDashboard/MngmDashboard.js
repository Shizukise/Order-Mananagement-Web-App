import React, { useEffect, useState } from 'react';
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import { Link } from 'react-router-dom';
import UrgentImg from '../../UrgentImg';
import './MngmDashboard.css';

const ManagementDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/getallorders'); // Adjust endpoint as needed
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'status-pending';
            case 'Delivery':
                return 'status-delivery';
            case 'Sent':
                return 'status-sent';
            default:
                return '';
        }
    };

    return (
        <>
            <ManagementNav />
            <BodyContent>
                <div className="dashboard-container">
                    <h2 className="dashboard-title">Order Dashboard</h2>
                    <div className="dashboard-table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer Name</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id} className={getStatusClass(order.status)}>
                                        <td><Link to={`/order/${order.order_id}`} className='DashboardLink'>
                                            Order Number - {order.order_id}
                                        </Link></td>
                                        <td>{order.customer}</td>
                                        <td>{order.order_date}</td>
                                        <td>{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </BodyContent>
        </>
    );
};

export default ManagementDashboard;
