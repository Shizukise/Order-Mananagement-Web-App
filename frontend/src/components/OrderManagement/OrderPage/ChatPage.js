import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./OrderPage.css"

const Chat = () => {
    const { orderId } = useParams();

    const OrderNav = () => {
        return (
            <div className="container-fluid">
                <nav className="nav orderNav">
                    <Link></Link>
                    <p className="nav-link orderNavLink"><Link className="orderNavLink" to={`/order/${orderId}`}>Order</Link></p>
                    <p className="nav-link active"  aria-current="page"><Link className="active">Chat</Link></p>
                    <p className="nav-link orderNavLink"><Link className="orderNavLink">Files</Link></p>
                    <p className="nav-link orderNavLink"><Link className="orderNavLink">Historic</Link></p>
                </nav>
            </div>
        )
    }

    return (
        <div className="chat-page-container">
            <OrderNav/>
            <p>{ orderId }</p>
        </div>
    );
};

const ChatPage = () => {
    return (
        <>
            <ManagementNav />
            <BodyContent>
                <span></span>
                <Chat />
            </BodyContent>
        </>
    );
};

export default ChatPage;
