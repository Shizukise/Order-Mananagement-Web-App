import { useEffect, useState } from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import "./HistoricPage.css"; // Link to CSS file
import { useParams, Link } from "react-router-dom";

const HistoricPage = () => {
    const { orderId } = useParams();
    const [historyData, setHistoryData] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Mockup data for now; replace with actual fetch from backend
                const response = await fetch(`/getorderhistoric/${orderId}`)
                if (response.ok) {
                    const result = await response.json()
                    setHistoryData(result);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);

    const OrderNav = () => (
        <div className="container-fluid">
            <nav className="nav orderNav">
                <Link className="nav-link orderNavLink" to={`/order/${orderId}`}>
                    Order
                </Link>
                <Link className="nav-link orderNavLink" to={`/orderchat/${orderId}`}>
                    Chat
                </Link>
                <Link className="nav-link orderNavLink" to="#">
                    Files
                </Link>
                <Link className="nav-link orderNavLink active" to={`/orderhistoric/${orderId}`}>
                    History
                </Link>
            </nav>
        </div>
    );

    const HistoryList = () => {
        if (historyData) {
        return historyData.events.map((entry, index) => (
                <div key={index} className="history-entry">
                    <p className="history-timestamp">{entry.event}</p>
                    <p className="history-message">{entry.timestamp}</p>
                </div>
            ))
        }
    };

    return (
        <div className="historic-page-container">
            <OrderNav />
            <div className="history-section">
                <h3 className="section-title">Order {orderId} History</h3>
                <div className="history-list">
                    <HistoryList />
                </div>
            </div>
        </div>
    );
};

const Historic = () => (
    <>
        <ManagementNav />
        <BodyContent>
            <HistoricPage />
        </BodyContent>
    </>
);

export default Historic;
