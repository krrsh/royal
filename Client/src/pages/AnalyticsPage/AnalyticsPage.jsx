import React, { useEffect, useState } from "react";
import "./AnalyticsPage.css";
import Navbar from "../../components/Navbar/Navbar";
import ddArrow from "../../assets/ddArrow.png";
import TotalData from "../../components/TotalDataContainer/TotalData";
import totalChef from "../../assets/totalChef.png";
import totalRevenue from "../../assets/inr.png";
import totalOrders from "../../assets/totalOrders.png";
import totalClients from "../../assets/totalClients.png";
import OrderSummaryCard from "../../components/OrderSummaryCard/OrderSummaryCard";
import RevenueCard from "../../components/RevenueCard/RevenueCard";
import TablesStatusCard from "../../components/TablesStatusCard/TablesStatusCard";
import axios from "axios";

const AnalyticsPage = () => {
  const [totalRevenueValue, setTotalRevenueValue] = useState(0);
  const [totalClientsValue, setTotalClientsValue] = useState(0);
  const [totalOrdersValue, setTotalOrdersValue] = useState(0);
  const [chefDetails, setChefDetails] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Filter...");
  const options = ["Order Summary", "Revenue", "Tables"];

  useEffect(() => {
    //Fetch total revenue
    axios
      .get("https://royal-xy66.onrender.com/api/totaldata/revenue")
      .then((res) => {
        setTotalRevenueValue(res.data.totalRevenue);
      })
      .catch((err) => {
        console.error("Failed to fetch revenue:", err);
      });

    //Fetch total clients
    axios
      .get("https://royal-xy66.onrender.com/api/totaldata/clients")
      .then((res) => {
        setTotalClientsValue(res.data.totalClients);
      })
      .catch((err) => {
        console.error("Failed to fetch clients:", err);
      });

    //Fetch total orders
    axios
      .get("https://royal-xy66.onrender.com/api/totaldata/orders")
      .then((res) => {
        setTotalOrdersValue(res.data.totalOrders);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });
  }, []);

  //fetching chef details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://royal-xy66.onrender.com/api/chef");
        setChefDetails(res.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchData();
  }, []);

  const handleOptionClick = (value) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className="analysticsPageContainer">
      <Navbar />

      <div style={{ width: "100%" }}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className={`filterContainer ${isOpen ? "active" : ""}`}
        >
          <input
            readOnly
            className="filterInput"
            type="text"
            value={selected}
          />
          <span>
            <img className="ddArrow" src={ddArrow} alt="dropDownArrowIcon" />
          </span>
        </div>

        {isOpen && (
          <div className="filterOptionsContainer active">
            {options.map((option) => (
              <input
                key={option}
                readOnly
                className="filterOptions"
                type="text"
                value={option}
                onClick={() => handleOptionClick(option)}
              />
            ))}
          </div>
        )}

        <div className="analyticsContent">
          <p className="heading">Analytics</p>

          <div className="totalDataContainer">
            <TotalData img={totalChef} value={"04"} title={"TOTAL CHEF"} />
            <TotalData
              img={totalRevenue}
              value={totalRevenueValue}
              title={"TOTAL REVENUE"}
            />
            <TotalData
              img={totalOrders}
              value={totalOrdersValue}
              title={"TOTAL ORDERS"}
            />
            <TotalData
              img={totalClients}
              value={totalClientsValue}
              title={"TOTAL CLIENTS"}
            />
          </div>

          <div className="analyticsDataContainer">
            {(selected === "Order Summary" ||
              selected === "Filter..." ||
              !selected) && <OrderSummaryCard />}
            {(selected === "Revenue" ||
              selected === "Filter..." ||
              !selected) && <RevenueCard />}
            {(selected === "Tables" ||
              selected === "Filter..." ||
              !selected) && <TablesStatusCard />}
          </div>

          <div className="chefDetailsContainer">
            <div className="chefDetailsTitle">
              <p>Chef Name</p>
              <p>Order Taken</p>
            </div>
            <ul className="chefList">
              {chefDetails.map((chef, index) => (
                <li key={index} className="chefRow">
                  <p style={{ width: "90px" }}>{chef.name}</p>
                  <p>{chef.orders}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
