import React, { useEffect, useState } from "react";
import "./OrderSummaryCard.css";
import OrderPieChart from "../PieChart/PieChart";
import PercentageBars from "../PercentageBars/PercentageBars";
import ddArrow from "../../assets/ddArrow.png";
import axios from "axios";

const OrderSummaryCard = () => {
  const [isActive, setIsActive] = useState(false);

  const [servedStats, setServedStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [dineInStats, setDineInStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [takeAwayStats, setTakeAwayStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const [servedRes, dineInRes, takeAwayRes] = await Promise.all([
          axios.get("http://localhost:4000/api/totaldata/served"),
          axios.get("http://localhost:4000/api/totaldata/dinein"),
          axios.get("http://localhost:4000/api/totaldata/takeaway"),
        ]);
        setServedStats({
          daily: servedRes.data.daily || 0,
          weekly: servedRes.data.weekly || 0,
          monthly: servedRes.data.monthly || 0,
          yearly: servedRes.data.yearly || 0,
        });
        setDineInStats({
          daily: dineInRes.data.daily || 0,
          weekly: dineInRes.data.weekly || 0,
          monthly: dineInRes.data.monthly || 0,
          yearly: dineInRes.data.yearly || 0,
        });
        setTakeAwayStats({
          daily: takeAwayRes.data.daily || 0,
          weekly: takeAwayRes.data.weekly || 0,
          monthly: takeAwayRes.data.monthly || 0,
          yearly: takeAwayRes.data.yearly || 0,
        });
      } catch (err) {
        console.error("Failed to fetch order stats:", err);
      }
    };

    fetchOrderStats();
  }, []);

  const getCountForPeriod = (statsObj) => {
    switch (selectedPeriod) {
      case "Daily":
        return statsObj.daily;
      case "Weekly":
        return statsObj.weekly;
      case "Monthly":
        return statsObj.monthly;
      case "Yearly":
        return statsObj.yearly;
      default:
        return 0;
    }
  };

  const servedOrders = getCountForPeriod(servedStats);
  const dineInOrders = getCountForPeriod(dineInStats);
  const takeAwayOrders = getCountForPeriod(takeAwayStats);

  return (
    <div className="orderSummary">
      <div className={`orderSummaryTitleSection ${isActive ? "active" : ""}`}>
        <p className="orderSummaryTitleText">Order Summary</p>
        <button
          onClick={() => setIsActive(!isActive)}
          className="orderSummaryDdBtn"
        >
          {selectedPeriod}
        </button>
        <img className="ddArrowInData" src={ddArrow} alt="img" />

        {isActive && (
          <div className="periodOptionsContainer active">
            {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
              <input
                key={period}
                readOnly
                className="periodOptions"
                type="text"
                value={period}
                onClick={() => {
                  setSelectedPeriod(period);
                  setIsActive(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <hr style={{ border: "#D9D9D9 solid 1px" }} />
      <div className="orderDataContainer">
        <div className="orderData">
          <p className="orderCount">{servedOrders}</p>
          <p className="orderType">Served</p>
        </div>
        <div className="orderData">
          <p className="orderCount">{dineInOrders}</p>
          <p className="orderType">Dine in</p>
        </div>
        <div className="orderData">
          <p className="orderCount">{takeAwayOrders}</p>
          <p className="orderType">Take Away</p>
        </div>
      </div>

      <div className="pieChartContainer">
        <OrderPieChart
          served={servedOrders}
          dineIn={dineInOrders}
          takeaway={takeAwayOrders}
        />
        <PercentageBars
          served={servedOrders}
          dineIn={dineInOrders}
          takeaway={takeAwayOrders}
        />
      </div>
    </div>
  );
};

export default OrderSummaryCard;
