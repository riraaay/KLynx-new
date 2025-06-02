
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Teen", value: 400 },
  { name: "Adult", value: 350}

];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042" ];

const PrenatalPie = () => {
  return (
    <div>   
      <PieChart width={550} height={500}>
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
          fontSize: '20px',       
          paddingTop: '10px',
          marginTop: '20px',
       
        }} 
      />
    </PieChart>
    </div>
  );
};

export default PrenatalPie;
