import React from "react";
import "./TotalData.css";

const TotalData = ({ img, value, title }) => {
  return (
    <div className="dataContainer">
      <img
        className={`${title === "TOTAL REVENUE" && "revenue"}`}
        src={img}
        alt="img"
      />
      <div className="analyticsData">
        <p className="count">{value}</p>
        <p className="dataHeading">{title}</p>
      </div>
    </div>
  );
};

export default TotalData;
