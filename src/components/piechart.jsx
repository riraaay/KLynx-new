import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const PieChartExample = ({ data }) => {
  // ✅ Handle loading or empty data
  if (!data || data.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No data available for chart.</p>;
  }

  // 🎯 Prepare chart data (top 10 diseases by total cases)
  const pieData = data
    .map(item => ({
      name: item.DiagnosisName,
      value:
        (item["Age 0-17"] || 0) +
        (item["Age 18-40"] || 0) +
        (item["Age 41-59"] || 0) +
        (item["Age 60+"] || 0),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const RAINBOW_COLORS = [
    "#FF6666", "#FFB266", "#FFFF66", "#B2FF66", "#66FFB2",
    "#66FFFF", "#66B2FF", "#B266FF", "#FF66B2", "#FF99CC"
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <PieChart width={550} height={300}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={RAINBOW_COLORS[index % RAINBOW_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          wrapperStyle={{
            fontSize: '10px',
            paddingTop: '10px',
            marginTop: '20px',
          }}
        />
      </PieChart>
    </div>
  );
};

export default PieChartExample;