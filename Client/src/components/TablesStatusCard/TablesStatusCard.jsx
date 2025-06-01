import React, { useEffect, useState } from "react";
import "./TablesStatusCard.css";
import axios from "axios";

const TablesStatusCard = () => {
  const [tables, setTables] = useState([]);
  console.log(tables);

  // Fetch tables on mount or after changes
  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="tablesStatusContainer">
      <div className="tablesStatusTitleSection">
        <p className="tablesStatusTitleText">Tables</p>
        <div className="statusContainer">
          <div className="tableStatus">
            <div className="statusDot reserved"></div>
            <p className="statusText">Reserved</p>
          </div>
          <div className="tableStatus">
            <div className="statusDot"></div>
            <p className="statusText">Available</p>
          </div>
        </div>
      </div>

      <hr style={{ border: "#D9D9D9 solid 1px", margin: "0" }} />

      <div className="tablesDataContent">
        {tables.map((table) => {
          return (
            <div
              key={table._id}
              style={{
                backgroundColor:
                  table.status === "available" ? "#FFF" : "#3DC35F",
              }}
              className="tableData"
            >
              <p
                style={{
                  fontSize: "10px",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                }}
              >
                Table
              </p>
              <p className="tableNumber">{table.tablenum}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablesStatusCard;
