import "./pieChartBox.scss";
import { PieChart,Pie,ResponsiveContainer,Cell} from "recharts";
import { useState, useEffect } from "react";
import axios from 'axios';

function PieChartBox() {
 
 
      const [data, setData] = useState([]);
    
    
    useEffect(() => {
        axios
        .post("http://localhost:8000/AllData",{
          from:"piechart"
        })
        .then((response) => {
          console.log(response.data.allData);
          setData(response.data.allData)});
      
          
      }, []);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#000'];

  return (
    <div className="PieChartBox">
      <h1>Inventory in  Category</h1>
      <div className="chart">
      <ResponsiveContainer>
      <PieChart height={100} >
        <Pie
          data={data}
        
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
        >
          {COLORS.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`${entry}`}/>
          ))}
        </Pie>
       
      </PieChart>
      </ResponsiveContainer>
      </div>

      <div className="options">
       
      {data.map((item:any, index) => {
        return <div className="option">
        <div className="title">
          <div className="dot" style={{backgroundColor:COLORS[index % COLORS.length]}}/>
          <span>{item.name}</span>
        </div>
        <span>{item.value}</span>
      </div>
      })}
        
        
      </div>
    </div>
  );
}

export default PieChartBox;
