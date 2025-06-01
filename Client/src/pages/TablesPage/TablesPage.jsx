import React, { useEffect, useRef, useState } from "react";
import "./TablesPage.css";
import Navbar from "../../components/Navbar/Navbar";
import searchIcon from "../../assets/search.png";
import addTable from "../../assets/addTable.png";
import SingleTable from "../../components/SingleTable/SingleTable";
import axios from "axios";

const API_BASE = "https://royal-xy66.onrender.com/api/tables";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [tableNum, setTableNum] = useState("01");
  const [chairs, setChairs] = useState(3);
  const [deleteError, setDeleteError] = useState("");

  // Refs to detect outside clicks
  const createButtonRef = useRef(null);
  const formRef = useRef(null);

  // Close "Create" if clicking outside the form or button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        creating &&
        formRef.current &&
        !formRef.current.contains(event.target) &&
        createButtonRef.current &&
        !createButtonRef.current.contains(event.target)
      ) {
        setCreating(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [creating]);

  // Fetch tables on mount or after changes
  const fetchTables = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (!creating) return;

    // If no tables, start at "01"
    if (tables.length === 0) {
      setTableNum("01");
      return;
    }
    const maxNum = tables.reduce((max, t) => {
      // t.tablenum is e.g. "01", "02", "10"
      const num = parseInt(t.tablenum, 10);
      return num > max ? num : max;
    }, 0);

    const next = maxNum + 1;
    setTableNum(next < 10 ? `0${next}` : `${next}`);
  }, [tables, creating]);

  const createTable = async () => {
    try {
      await axios.post(API_BASE, {
        tablenum: tableNum,
        chairs: Number(chairs),
        status: "available",
      });
      setCreating(false);
      setChairs(3);
      fetchTables();
    } catch (err) {
      console.error("Error creating table:", err);
    }
  };

  const handleDeleteClick = (tableId) => {
    const selectedTable = tables.find((t) => t._id === tableId);
    if (selectedTable?.status === "reserved") {
      setDeleteError(
        `Table ${selectedTable.tablenum} is reserved and cannot be deleted.`
      );
      setShowConfirm(true);
      return;
    }
    setDeleteError("");
    setSelectedTableId(tableId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${selectedTableId}`);
      setShowConfirm(false);
      setSelectedTableId(null);
      fetchTables();
    } catch (err) {
      console.error("Error deleting table:", err);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedTableId(null);
  };

  //search funtionality
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tables based on search query
  const filteredTables = tables.filter((table) =>
    table.tablenum.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tablesPageContainer">
      <Navbar />

      <div style={{ width: "100%" }}>
        <div className="searchContainer">
          <input
            className="searchInput"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span>
            <img className="searchBtn" src={searchIcon} alt="searchIcon" />
          </span>
        </div>

        <div className="tablesPageContent">
          <p className="tablesPageheading">Tables</p>
          <div className="tablesDetailsContainer">
            {filteredTables.map((table) => (
              <SingleTable
                key={table._id}
                table={table}
                onDelete={() => handleDeleteClick(table._id)}
              />
            ))}

            <div style={{ position: "relative" }}>
              <div
                ref={createButtonRef}
                onClick={() => setCreating(true)}
                className="createTable"
              >
                <img src={addTable} alt="addImg" />
              </div>
              {creating && (
                <div ref={formRef} className="tableInputs">
                  <p style={{ fontSize: "18px" }}>Table name (optional)</p>
                  <input
                    className="tableNameInput"
                    type="text"
                    value={tableNum}
                    onChange={(e) => setTableNum(e.target.value)}
                  />
                  <p style={{ fontSize: "18px" }}>Chair</p>
                  <div className="chairNumDD">
                    <input
                      className="chairNumInput"
                      type="number"
                      onChange={(e) => setChairs(e.target.value)}
                      value={chairs}
                      min={1}
                    />
                  </div>
                  <button onClick={createTable} className="createTableBtn">
                    Create
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="overlay">
          <div className="confirmBox">
            {deleteError ? (
              <>
                <p>{deleteError}</p>
                <div className="confirmActions">
                  <button onClick={cancelDelete}>OK</button>
                </div>
              </>
            ) : (
              <>
                <p>Are you sure you want to delete this table?</p>
                <div className="confirmActions">
                  <button onClick={confirmDelete}>Confirm</button>
                  <button onClick={cancelDelete}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesPage;
