import React, { useEffect, useState } from "react";
import "./OrdersPage.css";
import Navbar from "../../components/Navbar/Navbar";
import searchIcon from "../../assets/search.png";
import OrderLineCard from "../../components/OrderLineCard/OrderLineCard";
import axios from "axios";

const OrdersPage = () => {
  const [orderDetails, setOrderDetails] = useState([]);

  console.log(orderDetails);

  //fetching order details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://royal-xy66.onrender.com/api/orderDetails");
        setOrderDetails(res.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders by orderNum (partial match)
  const filteredOrders = orderDetails.filter((order) =>
    order.orderNum?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ordersPageContainer">
      <Navbar />

      <div style={{ width: "100%" }}>
        <div className="searchContainer">
          <input
            className="searchInput"
            type="text"
            placeholder="Search by Order Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span>
            <img className="searchBtn" src={searchIcon} alt="searchIcon" />
          </span>
        </div>

        <div className="ordersPageContent">
          <p className="orderPageHeading">Order Line</p>

          <div className="ordersDataContainer">
            {filteredOrders.map((order) => {
              return (
                <OrderLineCard
                  key={order._id}
                  status={order.status}
                  orderType={order.orderType}
                  cookingTime={order.cookingTime}
                  totalItems={order.totalItems}
                  items={order.items}
                  orderNum={order.orderNum}
                  createdAt={order.createdAt}
                  tableNum={order.tableNum}
                  remainingCookingTime={order.remainingCookingTime}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
