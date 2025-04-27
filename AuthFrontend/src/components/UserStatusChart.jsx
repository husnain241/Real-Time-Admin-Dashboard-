import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const UserStatusChart = ({ onlineCount, offlineCount }) => {
  const data = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [onlineCount, offlineCount],
        backgroundColor: ["#28a745", "#dc3545"], // Green and Red
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "300px", margin: "20px auto" }}>
      <Pie data={data} />
    </div>
  );
};

export default UserStatusChart;
