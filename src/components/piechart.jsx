// PieChartExample.js
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Flu", value: 400 },
  { name: "Cold", value: 300 },
  { name: "Malaria", value: 300 },
  { name: "Leptospirosis", value: 200 },
  { name: "Tubercolosis", value: 250},
  { name: "Fever", value: 150},
  { name: "COVID", value: 100},
  { name: "Monkey Pox", value: 160},
  { name: "Pneumonia", value: 50},
  { name: "Rabies", value: 10}

];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042" ];

const PieChartExample = () => {
  return (
    <div>   
      <PieChart width={550} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
    
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
