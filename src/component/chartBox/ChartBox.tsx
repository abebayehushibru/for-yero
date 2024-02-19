import { Link } from "react-router-dom";
import "./chartBox.scss";
import { useState ,useEffect} from "react";
import { LineChart,Tooltip,Line,ResponsiveContainer} from "recharts";
import axios from "axios";
type Props={
  title:string,
  id:string,
  api:string,
  to:string,
  table:string
}
function ChartBox(props:Props) {
  const [ totaldata, setTotalData] = useState(0);
    
  const [data, setData] = useState([{Dt:0},{Dt:0},{Dt:0},{Dt:0},{Dt:0}]);
    
    
  useEffect(() => {
      axios
      .post(`http://localhost:8000/ReportdataInMONTH`,{
        from:props.table
      })
      .then((response) => {
        console.log("(response.data.allData");
      
       setData(response.data.allData)
      // console.log(response.data.allData[0]);
       
   //  setTotalData(response.data.allData[1])ReportTotaldata

    });

    axios
    .post(`http://localhost:8000/ReportTotaldata`,{
      from:props.table
    })
    .then((response) => {
      console.log("(response.data.allData");
    
   
    // console.log(response.data.allData[0]);
     
 setTotalData(response.data.allData)

  });
    
    
        
    }, []);

  let y=0;
  const counter =() => {
   
    var counters:any = document.getElementById(props.id+'counter');
    counters.textContent=y
  
    if (y==totaldata) {
     clearInterval(x)
    }
    y++;
 
    
  }
  const x = setInterval(counter, 50)
  
  // const data = [
  //   {
     
  //     "pv": 2400,
    
  //   },
  //   {
     
  //     "pv": 1398,
   
  //   },
  //   {
   
  //     "pv": 9800,
      
  //   },
  //   {
     
  //     "pv": 3908,
    
  //   },
  //   {
     
  //     "pv": 4800,
     
  //   },
  //   {
     
  //     "pv": 3800,
      
  //   },
  //   {
      
  //     "pv": 4300,
     
  //   }
  // ]
 
  return (
    <div className="chartBox" key={props.table}>
      <div className="boxinfo">
        <div className="title">
          <i className="fa-solid fa-weight-scale"></i>
          <span>{props.title} </span>
        </div>
     

        <h2 id={props.id+"counter"}></h2>
        <Link to={"/"+props.to}> view all</Link>
      </div>
      <div className="chartinfo">
        <div className="chart">
                                      
<ResponsiveContainer>
<LineChart  data={data}
  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  
  <Tooltip  contentStyle={{background:"transparent",border:"none"}}
  labelStyle={{display:"none"}}
  position={{x:10,y:70}}
  />

  <Line type="monotone" dataKey="Dt" stroke="#000" dot={false} />
  
</LineChart>
</ResponsiveContainer>
        </div>
        <div className="text">
          <span className="percentage">{(Number(data[4].Dt / totaldata) * 100).toFixed(2)}%</span>
          <span className="duration">This month</span>
        </div>
      </div>
    </div>
  );
}

export default ChartBox;
