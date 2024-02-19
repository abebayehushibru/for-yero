import  './barchart.scss'
import { BarChart,Bar,ResponsiveContainer,Tooltip} from "recharts";
import { useState ,useEffect} from "react";
import axios from "axios";

function Barchart() {
  const [data, setData] = useState([{Dt:0},{Dt:0},{Dt:0},{Dt:0},{Dt:0}]);
   const  tempData= [{Dt:60},{Dt:50},{Dt:69},{Dt:26},{Dt:70}]
  // useEffect(() => {
  //   axios
  //   .post("http://localhost:8000/ReportStoredata",{
    
  //   })
  //   .then((response) => {
  //     console.log("(response.data.allData");
    
  //    setData(response.data.allData)
  
  // });
  
      
  // }, []);


 
  return (
    <div className='barchartbox'>
        
        <h1>   <i className='fa-solid fa-weight-scale'>

</i> <span>store</span></h1>
        <div className="chart">

        <ResponsiveContainer width="99%" height={130}>
        <BarChart width={150} height={40} data={tempData}>
        <Tooltip  contentStyle={{background:"white",borderRadius:"5px",border:".5px solid black"}}
  labelStyle={{display:"none"}}
  cursor={{fill:"none"}}
 
  />
          <Bar dataKey="Dt" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
        </div>
    </div>
  )
}

export default Barchart