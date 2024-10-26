import React from "react";
import { ManagementNav, BodyContent } from "../ManagementNav/Managementnav";
import './OrdersByAddress.css'



const OrderTable = () => {
    return (
        <p>Hello worlds</p>
    )
}






const OrdersByAddress = () => {
    return (
        <>
            <ManagementNav />
            <BodyContent >
                <OrderTable />
            </BodyContent>
        </>
    );
};

export default OrdersByAddress;