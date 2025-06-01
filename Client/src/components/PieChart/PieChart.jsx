import React from "react";
import { PieChart, Pie, Cell} from "recharts";

const OrderPieChart = ({ served, dineIn, takeaway }) => {
  const data = [
    { name: "Dine In", value: dineIn, color: "#2C2C2C" },
    { name: "Take Away", value: takeaway, color: "#5B5B5B" },
    { name: "Served", value: served, color: "#828282" },
  ];

  return (
    <PieChart width={100} height={100}>
      <Pie data={data} innerRadius={30} outerRadius={50} dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default OrderPieChart;
