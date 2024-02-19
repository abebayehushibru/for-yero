import { useState,useEffect } from "react";

import Datatable from "../../component/datatable/Datatable"
import "../../styles/pages.scss"
import { Link } from "react-router-dom";
import axios from "axios";
import { loggedInby } from "../../component/Datas.tsx";


type GridColDef = any
type GridRowsProp = any




const columns: GridColDef[] = [
  { field: 'rollNo', headerName: 'R.No', width: 100,},

  
  { field: 'fullName', headerName: 'Full Name', width: 150 },
    
  { field: 'Date', headerName: 'Date', width: 150 },
  { field: 'reqfrom', headerName: 'From', width: 150 },
  { field: 'totalQty', headerName: ' Quantity', width: 150 },
  { field: 'status', headerName: 'Satus', width: 150 ,renderCell:(params:any) =>{
    let bgColor=""
    if (params.value=="Approved") {
      bgColor="green"
      
    } else if (params.value=="Finished") {
      bgColor="rgb(84, 84, 84)"
      
    }   else {
      bgColor="orange"
    }

    return <button className="btn " style={{backgroundColor:bgColor}}>{params.value}</button>
    
}},
{ field: 'action', headerName: 'Action', width: 80,sortable: false  ,
      
renderCell:(params:any) =>{
 
   return  <div className="action">
    
          <Link to={`/Approve/request/${params.row.id}`} className="view"><img src=" /view.svg" alt="" />
          </Link>
           <p></p>
         </div>

}},
 


];

const initialRows: GridRowsProp = [];
function YourRequest() {
 
  const [data, setData] = useState(initialRows);
 
  //data of all purchase
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"AllRequest",
      adminRole:loggedInby.adminRole,
      forId:loggedInby.forId,
    })
    .then((response) => {
      
      const filterRows = response.data.allData.filter(
        (row: any) => row.reqfrom== "you"
      );
      const updatedData = filterRows.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      console.log(updatedData)
      setData(updatedData)});
  }, []);
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>Request</h1>
      </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
  </div>

  )
}

export default YourRequest