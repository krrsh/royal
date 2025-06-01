import React from "react";
import {
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: "var(--primary)",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontSize: "12px",
        }}
      >
        <p>{label}</p>
        <p>Rs.{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const RevenueGraph = ({ data }) => {
  return (
    <div
      style={{
        margin: "0 10px",
        backgroundColor: "#FFF",
        border: "1px solid #D9D9D9",
        borderRadius: "10px",
        padding: "10px 0 0 0",
        boxShadow: "rgba(0, 0, 0, 0.24) 1px 1px 6px",
      }}
    >
      <ResponsiveContainer width={370} height={200}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#2C2C2C" }}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#2E2E30"
            opacity={0.1}
            activeBar={{ opacity: 0.5 }}
            barSize={60}
            radius={[5, 5, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2E2E30"
            strokeWidth={3}
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueGraph;
