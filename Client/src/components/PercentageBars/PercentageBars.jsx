import React from "react";

const PercentageBars = ({ served, dineIn, takeaway }) => {
  const data = [
    { name: "Served", value: served, color: "#828282" },
    { name: "Dine In", value: dineIn, color: "#2C2C2C" },
    { name: "Take Away", value: takeaway, color: "#5B5B5B" },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div
      style={{
        width: "65%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      {data.map((item, idx) => {
        const percent = ((item.value / total) * 100).toFixed(1);
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", fontSize: "12px", color: "#BBB9BF" }}>
              {item.name} ({percent}%)
            </div>
            <div
              style={{
                background: "#FFF",
                borderRadius: "100px",
                height: "5px",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  backgroundColor: item.color,
                  height: "100%",
                  borderRadius: "100px",
                  transition: "width 0.8s ease-in-out",
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PercentageBars;
