import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/letter-r.png";
import tables from "../../assets/tablesIcon.png";
import analytics from "../../assets/analyticsIcon.png";
import orders from "../../assets/ordersIcon.png";
import menu from "../../assets/menuIcon.png";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getLocation = () => {
    if (location.pathname.includes("analytics")) return "Analytics";
    if (location.pathname.includes("tables")) return "Tables";
    if (location.pathname.includes("orders")) return "Orders";
    return "";
  };

  const currentPage = getLocation();

  return (
    <div className="navContainer">
      <img className="logoIcon" src={logo} alt="logoIcon" />
      <div className="iconsContainer">
        <div onClick={() => navigate("/analytics")} className="icon-container">
          <img
            style={{
              backgroundColor: currentPage === "Analytics" && "#D9D9D9",
            }}
            src={analytics}
            alt="analyticsIcon"
          />
          <span className="tooltip">Analytics</span>
        </div>

        <div onClick={() => navigate("/tables")} className="icon-container">
          <img
            style={{ backgroundColor: currentPage === "Tables" && "#D9D9D9" }}
            src={tables}
            alt="tablesIcon"
          />
          <span className="tooltip">Tables</span>
        </div>

        <div onClick={() => navigate("/orders")} className="icon-container">
          <img
            style={{ backgroundColor: currentPage === "Orders" && "#D9D9D9" }}
            src={orders}
            alt="ordersIcon"
          />
          <span className="tooltip">Orders</span>
        </div>

        <div onClick={() => navigate("/menu")} className="icon-container">
          <img src={menu} alt="menuIcon" />
          <span className="tooltip">Menu</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
