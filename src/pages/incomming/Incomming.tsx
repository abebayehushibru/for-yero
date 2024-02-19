import { useState,useEffect } from "react";
import CryptoJS from "crypto-js";
import Datatable from "../../component/datatable/Datatable"
import "../../styles/pages.scss"
import axios from "axios";
import { Link } from "react-router-dom";
import { loggedInby } from "../../component/Datas";
type GridColDef = any
type GridRowsProp = any
const secretPass = "XkhZG4fW2t2W";



const initialRows: GridRowsProp = [];

function Incomming() {
 const [data, setData] = useState(initialRows);

  //data of all incomming
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"allIncomming",
      adminRole:loggedInby.adminRole,
      id:loggedInby.id
    })
    .then((response) => {
      const updatedData = response.data.allData.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      setData(updatedData)});
  }, []);



 


  //columns 
  const columns: GridColDef[] = [
    { field: 'rollNo', headerName: 'Row no', width: 100,},
  
    { field: 'RecipientName', headerName: 'Recipient Name', width: 150 },
  
    { field: 'DonorOrg', headerName: ' Donate Org', width: 150 },
    { field: 'DonorName', headerName: ' Rep Org/ In Name', width: 150 },
    { field: 'Date', headerName: 'Date', width: 150 },
    { field: 'status', headerName: 'Satus', width: 150 ,renderCell:(params:any) =>{
  
      return <button className="btn " style={{backgroundColor:params.value=="Approved"?"green":"orange"}}>{params.value}</button>
      
  }},
  { field: 'action', headerName: 'Action', width: 80,sortable: false ,valueGetter: (params:any) =>params.row.status === 'Approved'?"Approved":""  ,
    
  renderCell:(params:any) =>{
  
  //   const encryptData=(id:string)=>{
  // const res = CryptoJS.AES.encrypt(JSON.stringify(id), secretPass).toString(CryptoJS.enc.Base64url);
  //   console.log(res);
  //           return res
  //           }
            return  <div className="action">
      
            <Link to={`/Approve/Incomming/${params.row.id}`} className="view"><img src=" /view.svg" alt="" /></Link>
             
           </div>
  
  }},
  
  
  ];
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>Incomming</h1>
      <Link  to="/Incomming/add"className="button">Add Incomming</Link>
    </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
   </div>

  )
}

export default Incomming