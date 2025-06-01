import React, { useEffect, useMemo, useState } from "react";
import "./RevenueCard.css";
import ddArrow from "../../assets/ddArrow.png";
import RevenueGraph from "../RevenueGraph/RevenueGraph";
import axios from "axios";

const generateRevenueData = (orders) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const sortedOrders = orders.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const firstOrderDate = new Date(sortedOrders[0].createdAt);

  const now = new Date();
  // const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday of this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), 0, 1);
  const currentYear = new Date().getFullYear();

  const daily = Array(7).fill(0);
  const weekly = [];
  const monthly = Array(12).fill(0);
  const yearly = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const revenue = order.revenue || 0;

    // Daily
    const dayDiff = Math.floor((date - startOfWeek) / (1000 * 60 * 60 * 24));
    if (dayDiff >= 0 && dayDiff < 7) {
      const day = date.getDay();
      daily[day] += revenue;
    }

    // Weekly
    const weekDiff = Math.floor(
      (date - firstOrderDate) / (1000 * 60 * 60 * 24 * 7)
    );
    if (!weekly[weekDiff]) weekly[weekDiff] = 0;
    weekly[weekDiff] += revenue;

    // Monthly
    const month = date.getMonth();
    monthly[month] += revenue;

    // Yearly
    const year = date.getFullYear();
    if (!yearly[year]) yearly[year] = 0;
    yearly[year] += revenue;
  });

  const dailyData = days.map((day, i) => ({ name: day, value: daily[i] }));
  const weeklyData = weekly.map((val, i) => ({
    name: `Week ${i + 1}`,
    value: val,
  }));
  const monthlyData = months.map((month, i) => ({
    name: month,
    value: monthly[i],
  }));

  const years = Object.keys(yearly)
    .map(Number)
    .sort((a, b) => a - b);
  const last7Years = years.slice(-7);
  const yearlyData = last7Years.map((year) => ({
    name: `${year}`,
    value: yearly[year],
  }));

  return { dailyData, weeklyData, monthlyData, yearlyData };
};

const RevenueCard = () => {
  const [orders, setOrders] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  const noData = [];

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/totaldata/graph-revenue"
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
      }
    })();
  }, []);

  const { dailyData, weeklyData, monthlyData, yearlyData } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        dailyData: [],
        weeklyData: [],
        monthlyData: [],
        yearlyData: [],
      };
    }
    return generateRevenueData(orders);
  }, [orders]);

  return (
    <div className="revenueContainer">
      <div className={`orderSummaryTitleSection ${isActive ? "active" : ""}`}>
        <p className="orderSummaryTitleText">Revenue</p>
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

      {selectedPeriod === "Daily" ? (
        <RevenueGraph data={dailyData} />
      ) : selectedPeriod === "Monthly" ? (
        <RevenueGraph data={monthlyData} />
      ) : selectedPeriod === "Weekly" ? (
        <RevenueGraph data={weeklyData} />
      ) : selectedPeriod === "Yearly" ? (
        <RevenueGraph data={yearlyData} />
      ) : (
        <RevenueGraph data={noData} />
      )}
    </div>
  );
};

export default RevenueCard;
