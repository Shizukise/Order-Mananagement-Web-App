import React, { useState, useEffect, useRef } from "react";
import ManagementNav from "../ManagementNav/Managementnav";
import { useAuth } from "../../../contexts/AuthContext";
import "./PendingOrders.css";


const OrderTable = () => {
    return (
      <div className="order-table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
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