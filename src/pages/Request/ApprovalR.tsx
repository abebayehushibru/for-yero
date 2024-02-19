import { useState,useEffect } from "react";
import CryptoJS from "crypto-js";
import Datatable from "../../component/datatable/Datatable"
import "../../styles/pages.scss"
import axios from "axios";
import { Link } from "react-router-dom";
import { loggedInby } from "../../component/Datas.tsx";

type GridColDef = any
type GridRowsProp = any





const initialRows: GridRowsProp = [];

 

function ApprovalR() {
  const secretPass = "XkhZG4fW2t2W";

  // async function encryptData(id: string):Promise<string> {
  //   try {
  //     // const res = CryptoJS.AES.encrypt(JSON.stringify(id), secretPass).toString();
  //     // console.log(res);
  //     return "res";
  //   } catch (error) {
  //     // Handle encryption error
  //     console.error('Error encrypting data:', error);
  //     // You can throw a specific error type or return null/undefined based on your needs
  //     throw new Error('Encryption failed');
  //   }
  // }
  const [data, setData] = useState(initialRows);
 // handle deletd row
//  const handleDeleteRow = (id: number) => {
//   console.log(id);
  
//   axios
//  .post("http://localhost:8000/Delete",{
//    id:id,
//    from:"requestedby"
//  })
//  .then((response) => {
//    if (response.data.message==="Deleted") {
//      const updatedRows = data.filter((row:any) => row.id !== id);
//      const updatedData = updatedRows.map((row: any, index: number) => ({
//        ...row,
//        rollNo: index + 1,
//      }));
//      setData(updatedData);

//    } else {
     
//    }
  
//   });

// };
  //data of all purchase
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"AllRequest",
       adminRole:loggedInby.adminRole,
       forId:loggedInby.forId,
    })
    .then((response) => {
      const filterRows = response.data.allData.filter((row:any) => row.status == "pending");
      const updatedData = filterRows.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      console.log(updatedData)
      setData(updatedData)});
  }, []);
  const columns: GridColDef[] = [
    { field: 'rollNo', headerName: 'R.No', width: 100,},

  
    { field: 'fullName', headerName: 'Full Name', width: 150 },
      
    { field: 'Date', headerName: 'Date', width: 150 },
    { field: 'totalQty', headerName: ' Quantity', width: 150 },
    { field: 'status', headerName: 'Satus', width: 150 ,renderCell:(params:any) =>{
  
      return <button className="btn " style={{backgroundColor:"orange"}}>{params.value}</button>
      
  }},
  { field: 'action', headerName: 'Action', width: 80,sortable: false ,valueGetter: (params:any) =>params.row.status === 'Approved'?"Approved":""  ,
      
  renderCell: (params: any) => {
 //   const handleDelete = () => {
//       handleDeleteRow(params.row.id);}
//       const encryptData=(id:string)=>{
// const res = CryptoJS.AES.encrypt(JSON.stringify(id), secretPass).toString();
//       console.log(res);
//       return res
//       }
      return  <div className="action">

      <Link to={`/Approve/request/${params.row.id}`} className="view"><img src=" /view.svg" alt="" /></Link>
       
     </div>
  }},
   
  
  
  ];
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>Request Approval</h1>
     
    </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
 
  </div>

  )
}

export default ApprovalR