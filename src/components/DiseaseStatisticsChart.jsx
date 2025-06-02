import { useState } from "react";
import { Bar } from "react-chartjs-2";

const DiseaseStatisticsChart = () => {
  const [view, setView] = useState("Monthly");

  // Chart data
  const data = {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    datasets: [
      {
        label: "Disease A",
        data: [10, 20, 40, 30, 25, 50, 15, 10, 30, 20, 35, 10],
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Disease B",
        data: [15, 10, 30, 25, 35, 45, 20, 15, 25, 15, 40, 5],
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Pink bars
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff", // White text for legend
        },
      },
      title: {
        display: true,
        text: "Disease Statistics",
        color: "#fff", // White text for title
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#fff", // White text for x-axis
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Light grid lines
        },
        ticks: {
          color: "#fff", // White text for y-axis
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#16213E", borderRadius: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ color: "#fff" }}>DISEASE STATISTICS</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setView("Monthly")}
            style={{
              padding: "10px 20px",
              backgroundColor: view === "Monthly" ? "#4e8fff" : "#16213E",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setView("Weekly")}
            style={{
              padding: "10px 20px",
              backgroundColor: view === "Weekly" ? "#4e8fff" : "#16213E",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            WEEKLY
          </button>
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DiseaseStatisticsChart;
