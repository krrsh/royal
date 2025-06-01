import React from "react";
import "./SingleTable.css";
import deleteIcon from "../../assets/deleteIcon.png";
import chairImg from "../../assets/chairImg.png";

const SingleTable = ({ table, onDelete }) => {
  return (
    <div className="singleTable">
      <p className="tableText">Table</p>
      <p className="tableNumber">{table.tablenum}</p>
      <img
        onClick={onDelete}
        className="deleteImg"
        src={deleteIcon}
        alt="deleteImg"
      />
      <div className="chairDetails">
        <img style={{ height: "12px" }} src={chairImg} alt="chairImg" />
        <p className="chairNumber">
          {table.chairs.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
};

export default SingleTable;
