import React, { useState } from "react";
import "./OrderLineCard.css";
import fork from "../../assets/forkKnife.png";
import watchGlass from "../../assets/watchGlass.png";
import takeAwayDone from "../../assets/takawayDone.png";
import dineInDone from "../../assets/dineInDone.png";
import ddArrowBtn from "../../assets/darkerDownArrow.png";

const OrderLineCard = ({
  status,
  orderType,
  totalItems,
  items,
  orderNum,
  createdAt,
  tableNum,
  remainingCookingTime,
}) => {
  const [changingStatus, setChangingStatus] = useState(false);
  const [takeAwayStatus, setTakeAwayStatus] = useState("Not Picked Up");

  function formatTo12HourTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }

  const orderdTime = formatTo12HourTime(createdAt);

  return (
    <div
      style={{
        backgroundColor:
          status === "served" &&
          orderType === "TakeAway" &&
          takeAwayStatus === "Picked Up"
            ? "#B9F8C9"
            : status === "served" && orderType === "TakeAway"
            ? "#C2D4D9"
            : status === "served" && orderType === "DineIn"
            ? "#B9F8C9"
            : status === "OnGoing"
            ? "#FFE3BC"
            : "#FFE3BC",
      }}
      className="ordersInfoCard"
    >
      <div className="orderNumContainer">
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div className="itemNumber">
            <img src={fork} alt="Img" />
            <p
              style={{
                color: "#111111",
                fontSize: "15px",
              }}
            >
              # {orderNum}
            </p>
          </div>
          {orderType === "DineIn" && (
            <p style={{ fontSize: "8px" }}>Table-{tableNum}</p>
          )}
          <p style={{ fontSize: "8px" }}>{orderdTime}</p>
          <p style={{ fontSize: "14px" }}>{totalItems} Item</p>
        </div>

        <div
          style={{
            backgroundColor:
              status === "served" &&
              orderType === "TakeAway" &&
              takeAwayStatus === "Picked Up"
                ? "#B9F8C9"
                : status === "served" &&
                  orderType === "TakeAway" &&
                  takeAwayStatus === "Not Picked Up"
                ? "#C2D4D9"
                : status === "served" && orderType === "DineIn"
                ? "#B9F8C9"
                : status === "OnGoing"
                ? "#FFE3BC"
                : "#FFE3BC",
          }}
          className="timeLeftContainer"
        >
          {status === "served" && orderType === "DineIn" && (
            <>
              <p style={{ color: "#34C759", fontSize: "10px" }}>Done</p>
              <p style={{ color: "#2C2C2E", fontSize: "10px" }}>Served</p>
            </>
          )}

          {status === "OnGoing" && orderType === "DineIn" && (
            <>
              <p style={{ color: "#FF9500", fontSize: "10px" }}>Dine In</p>
              <p style={{ color: "#2C2C2E", fontSize: "10px" }}>
                Ongoing: {remainingCookingTime} min
              </p>
            </>
          )}

          {status === "OnGoing" && orderType === "TakeAway" && (
            <>
              <p style={{ color: "#FF9500", fontSize: "10px" }}>Take Away</p>
              <p style={{ color: "#2C2C2E", fontSize: "10px" }}>
                Ongoing: {remainingCookingTime} min
              </p>
            </>
          )}

          {status === "served" && orderType === "TakeAway" && (
            <>
              <p
                style={{
                  color: takeAwayStatus === "Picked Up" ? "#34C759" : "#3181A3",
                  fontSize: "10px",
                }}
              >
                Take Away
              </p>
              <div className="takeAwayContainer">
                <button
                  onClick={() => setChangingStatus(!changingStatus)}
                  className="takeAwayBtn"
                  style={{ color: "#2C2C2E", fontSize: "10px" }}
                >
                  {takeAwayStatus}
                </button>
                <img className="ddArrBtn" src={ddArrowBtn} alt="dropdown" />
                {changingStatus && (
                  <div className="statusOptionsDD">
                    <p
                      onClick={() => {
                        setTakeAwayStatus("Picked Up");
                        setChangingStatus(false);
                      }}
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        fontSize: "10px",
                        borderBottom: "#939494 solid 1px",
                        width: "100%",
                      }}
                    >
                      Picked up
                    </p>
                    <p
                      onClick={() => {
                        setTakeAwayStatus("Not Picked Up");
                        setChangingStatus(false);
                      }}
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        fontSize: "10px",
                        width: "100%",
                      }}
                    >
                      Not Picked Up
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="foodItemsContainer">
        {items.map((item, index) => {
          return (
            <p key={index}>
              {item.count} x {item.name}
            </p>
          );
        })}
      </div>

      {status === "served" ? (
        orderType === "TakeAway" ? (
          takeAwayStatus === "Picked Up" ? (
            <div style={{ backgroundColor: "#31FF65" }} className="orderStatus">
              <p
                style={{
                  color: "#0E912F",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                Order Done
              </p>
              <img src={dineInDone} alt="Done Icon" />
            </div>
          ) : (
            <div style={{ backgroundColor: "#9BAEB3" }} className="orderStatus">
              <p
                style={{
                  color: "#3B413D",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                Order Done
              </p>
              <img src={takeAwayDone} alt="Takeaway Icon" />
            </div>
          )
        ) : (
          <div style={{ backgroundColor: "#31FF65" }} className="orderStatus">
            <p
              style={{ color: "#0E912F", fontSize: "10px", fontWeight: "bold" }}
            >
              Order Done
            </p>
            <img src={dineInDone} alt="Done Icon" />
          </div>
        )
      ) : (
        <div style={{ backgroundColor: "#FDC474" }} className="orderStatus">
          <p style={{ color: "#D87300", fontSize: "10px", fontWeight: "bold" }}>
            Processing
          </p>
          <img src={watchGlass} alt="Processing Icon" />
        </div>
      )}
    </div>
  );
};

export default OrderLineCard;
