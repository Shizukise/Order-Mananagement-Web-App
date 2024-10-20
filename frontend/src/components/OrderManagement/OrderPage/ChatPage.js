import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./OrderPage.css";
import "./ChatPage.css"; // New CSS file for chat-specific styles

const Chat = () => {
    const { orderId } = useParams();

    const OrderNav = () => {
        return (
            <div className="container-fluid">
                <nav className="nav orderNav">
                    <Link className="nav-link orderNavLink" to={`/order/${orderId}`}>
                        Order
                    </Link>
                    <Link className="nav-link orderNavLink active" to={`/orderchat/${orderId}`}>
                        Chat
                    </Link>
                    <Link className="nav-link orderNavLink" to="#">
                        Files
                    </Link>
                    <Link className="nav-link orderNavLink" to="#">
                        History
                    </Link>
                </nav>
            </div>
        );
    };
    
    

    return (
        <div className="chat-page-container">
            <OrderNav />
            <div className="chat-container">
                {/* Chat Messages Section */}
                <div className="chat-messages">
                    <div className="chat-message received">
                        <p>Customer: Hello, I need an update on my order.</p>
                        <span className="message-time">10:30 AM</span>
                    </div>
                    <div className="chat-message sent">
                        <p>You: The order is in progress and will be delivered soon.</p>
                        <span className="message-time">10:35 AM</span>
                    </div>
                </div>

                {/* Chat Input Section */}
                <div className="chat-input-container">
                    <input type="text" className="chat-input" placeholder="Type your message here..." />
                    <button className="btn btn-primary send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

const ChatPage = () => {
    return (
        <>
            <ManagementNav />
            <BodyContent>
                <Chat />
            </BodyContent>
        </>
    );
};

export default ChatPage;
