import { useState,useEffect } from "react";

import Datatable from "../../component/datatable/Datatable.tsx"
import "../../styles/pages.scss"
import { Link } from "react-router-dom";
import axios from "axios";
import { loggedInby } from "../../component/Datas.tsx";
import CryptoJS from "crypto-js";

type GridColDef = any
type GridRowsProp = any

 const secretPass = "XkhZG4fW2t2W";



const columns: GridColDef[] = [
  { field: 'rollNo', headerName: 'R.No', width: 100,},

  
  { field: 'fullName', headerName: 'Full Name', width: 150 },
  { field: 'R_id', headerName: 'Id ', width: 150 },
  { field: 'Date', headerName: 'Date', width: 150 },

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
 
//   const encryptData=(id:string)=>{
// const res = CryptoJS.AES.encrypt(JSON.stringify(id), secretPass).toString(CryptoJS.enc.Base64url);
//   console.log(res);
//           return res
//           }
          return  <div className="action">
    
          <Link to={`/Retrival/Approval/${params.row.id}`} className="view"><img src=" /view.svg" alt="" /></Link>
           
         </div>

}},
 


];
const initialRows: GridRowsProp = [];
function Retirval() {
  const [data, setData] = useState(initialRows);
 
 
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Retirval",
      adminRole:loggedInby.adminRole,
      id:loggedInby.id,
    })
    .then((response) => {
      const updatedData = response.data.allData.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      console.log(updatedData)
      setData(updatedData)});
  }, []);
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>Retirval</h1>
      </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
  </div>

  )
}

export default Retirval