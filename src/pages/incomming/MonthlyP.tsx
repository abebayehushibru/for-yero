import { useEffect, useState } from "react";
import Datatable from "../../component/datatable/Datatable";
import Toast from "../../component/toast/Toast";
import CryptoJS from "crypto-js";
import axios from "axios";
import "../../styles/pages.scss";
import { Link } from "react-router-dom";
import { loggedInby } from "../../component/Datas";
type GridColDef = any;
type GridRowsProp = any;

const secretPass = "XkhZG4fW2t2W";

const initialRows: GridRowsProp = [];
function MonthlyP() {
  const [cliked, setClicked] = useState(false);
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [alldata, setAllData] = useState(initialRows);
  const [data, setMonthData] = useState(initialRows);
 //data of all Request
 useEffect(() => {
  axios
    .post("http://localhost:8000/AllData", {

      from:"allIncomming",
      adminRole:loggedInby.adminRole,
      id:loggedInby.id
    })
    .then((response) => {
      const updatedData = response.data.allData.map(
        (row: any, index: number) => ({
          ...row,
          rollNo: index + 1,
        })
      );

      setAllData(updatedData);
    });
}, []);



const go = (e: any) => {
  e.preventDefault();

  if (
    e.target.to.value >= e.target.from.value &&
    e.target.to.value != "" &&
    e.target.from.value != ""
  ) {
    let fromarray = e.target.from.value.split("-");
    if (Number(fromarray[1] )< 10) {
      fromarray[1] = "0" + Number(fromarray[1] );
    }

    const from:string  = fromarray[0] + "-" + fromarray[1] + "-" +  Number(fromarray[2]);

    let toarray = e.target.to.value.split("-");
    if (Number(toarray[1] ) < 10) {
      toarray[1] = "0" + Number(toarray[1] );
    }
  
    const to:string = toarray[0] + "-" + toarray[1] + "-" + Number(toarray[2]);
    console.log(to);
    
    const filterRows = alldata.filter(
      (row: any) => row.Date >= from && row.Date <= to
    );
    const updatedData = filterRows.map((row: any, index: number) => ({
      ...row,
      rollNo: index + 1,
    }));
console.log(updatedData+" from: "+from+" to: "+to);

    setMonthData(updatedData);
    setClicked(true);
    return;
  } else if (
    e.target.to.value < e.target.from.value &&
    e.target.to.value != "" &&
    e.target.from.value != ""
  ) {
    setNotify(" Month  selection has Wrong ");
  } else if (e.target.from.value == "") {
    setNotify("Starting month is not selected");
  } else if (e.target.to.value == "") {
    setNotify("Ending month is not selected");
  }

  setToaststate(true);
};
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
        <h1>Monthly Purchase </h1>

        <form
          className="date"
          onSubmit={(e) => {
            go(e);
          }}
        >
          <div>
            From : <input type="date" name="from"></input>
          </div>
          <div>
            To : <input type="date" name="to"></input>
          </div>

          <button type="submit" className="button">Go</button>
        </form>
      </div>

      {cliked && <Datatable columns={columns} rows={data} />}
      {
        <Toast
          toastmsg={notify}
          toastbg={"rgb(235, 0, 0)"}
          toastcolor={"white"}
          toaststate={toaststate}
         
        />
      }
    </div>
  );
}

export default MonthlyP;
