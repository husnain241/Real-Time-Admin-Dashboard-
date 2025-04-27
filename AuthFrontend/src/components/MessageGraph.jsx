import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MessageGraph = ({ messageCounts }) => {
  const data = Object.entries(messageCounts).map(([email, count]) => ({
    email,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 300, marginTop: "40px" }}>
      <h2>📊 Live Messages Graph</h2>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="email" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MessageGraph;
