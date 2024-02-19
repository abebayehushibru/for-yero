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
 
  // const decryptData = (encryptedData:any) => {
  //  // console.log(encryptedData);
    
  //   const secretPass = "XkhZG4fW2t2W";
  //   const ciphertext = CryptoJS.enc.Base64url.parse(encryptedData);
  //  //console.log(ciphertext);
  //   const decrypted = CryptoJS.AES.decrypt(ciphertext, secretPass, { iv: "ahavah" });
  //   const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  //  console.log(decrypted);
    
  // // return JSON.parse(plaintext);
  // };
//   const encryptData = (id:any) => {
   
    
//     const secretPass = "XkhZG4fW2t2W";
//     const encrypted = CryptoJS.AES.encrypt(JSON.stringify(id), secretPass, { iv: ["ahavah"] });
//    // console.log(encrypted);
    
//     const res = CryptoJS.enc.Base64url.stringify(encrypted.ciphertext);
//   // console.log(res);
//  decryptData(res);
 
//     return res;
//   };
  // const encryptedData = encryptData(params.row.id); // Encrypt the data
  // const decryptedData = decryptData(encryptedData); // Decrypt the data
  // console.log(decryptedData);
          return  <div className="action">
    
          <Link to={`/Approve/request/${params.row.id}`} className="view"><img src=" /view.svg" alt="" />
          </Link>
           <p></p>
         </div>

}},
 


];

const initialRows: GridRowsProp = [];
function Request() {
 
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
      <h1>Request</h1>
      </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
  </div>

  )
}

export default Request