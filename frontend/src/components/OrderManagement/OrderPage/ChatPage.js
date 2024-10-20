import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import { useParams,Link  } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./OrderPage.css";
import "./ChatPage.css"; // New CSS file for chat-specific styles

const Chat = () => {
    const { orderId } = useParams();
    const [orderMessages,setOrderMessages] = useState()
    const message = useRef()
    const [messageSent,setMessageSent] = useState(null)

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
    

    useEffect(() => {
        async function fetchMessages() {
            try {
                    const response = await fetch(`/getmessages/${orderId}`)
                
                    if (response.ok) {
                        const result = await response.json()
                        setOrderMessages(result)
                        setMessageSent(null)
                };
            } catch (error) {
                console.error("Network error: ", error)
            }
        }
        fetchMessages()
    },[messageSent])

    async function handleSendMessage () {
        try {
            const response = await fetch(`/sendmessage/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message.current.value), 
                credentials: 'include'
            });
            if (response.ok) {
                message.current.value = ""
                setMessageSent(true)
            }
        } catch (error) {
            console.error("Network error: ", error);
        }
        
    };

    const AllMessages =  () => {
        if (orderMessages) {
            return orderMessages.messages.map((message) => (
                <div className="chat-message" key={message.message}>
                        <p>{message.message}</p>
                        <span className="message-time">{message.timestamp}</span>
                </div>
            ))
        } else {
            return <p></p>
        }
    }


    return (
        <div className="chat-page-container">
            <OrderNav />
            <div className="chat-container">
                {/* Chat Messages Section */}
                <div className="chat-messages">
                    <AllMessages />
                </div>

                {/* Chat Input Section */}
                <div className="chat-input-container">
                    <input type="text" className="chat-input" placeholder="Type your message here..." ref={message} 
                    onKeyDown={(e) => {if (e.key === 'Enter') {handleSendMessage()}}}/>
                    <button className="btn btn-primary send-button" onClick={() => handleSendMessage()}>Send</button>
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
