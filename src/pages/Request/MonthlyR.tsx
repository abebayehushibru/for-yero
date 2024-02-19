import { useState, useEffect } from "react";
import Datatable from "../../component/datatable/Datatable";
import Toast from "../../component/toast/Toast";
import "../../styles/pages.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import { loggedInby } from "../../component/Datas.tsx";
import CryptoJS from "crypto-js";
type GridColDef = any;
type GridRowsProp = any;
const secretPass = "XkhZG4fW2t2W";


function MonthlyR() {
  const initialRows: GridRowsProp = [];

  const [alldata, setAllData] = useState(initialRows);
  const [monthData, setMonthData] = useState(initialRows);
 
   //data of all Request
   useEffect(() => {
    axios
      .post("http://localhost:8000/AllData", {
        from: "AllRequest",
        adminRole:loggedInby.adminRole,
        forId:loggedInby.forId,
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

      const from:string  = fromarray[0] + "-" + fromarray[1] + "-" + fromarray[2];

      let toarray = e.target.to.value.split("-");
      if (Number(toarray[1] ) < 10) {
        toarray[1] = "0" + Number(toarray[1] );
      }
      console.log(alldata)

      const to:string = toarray[0] + "-" + toarray[1] + "-" + toarray[2];
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
    { field: "rollNo", headerName: "R.No", width: 100 },
  
    { field: "fullName", headerName: "Full Name", width: 150 },
  
    { field: "Date", headerName: "Date", width: 150 },
    { field: "totalQty", headerName: " Quantity", width: 150 },
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
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
  
      renderCell: (params: any) => {
      //   const encryptData=(id:string)=>{
      // const res = CryptoJS.AES.encrypt(JSON.stringify(id), secretPass).toString(CryptoJS.enc.Base64url);
      //   console.log(res);
      //           return res
      //           }
                return  <div className="action">
          
                <Link to={`/Approve/request/${params.row.id}`} className="view"><img src=" /view.svg" alt="" /></Link>
                 
               </div>
      },
    },
  ];

  
  const [cliked, setClicked] = useState(false);
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  return (
    <div className="PageConatainer">
      <div className="PageConatainer-info">
        <h1> Request </h1>

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

          <button type="submit">Go</button>
        </form>
      </div>

      {monthData && <Datatable columns={columns} rows={monthData} />}
      {
        <Toast
          toastmsg={notify}
          toastbg={"rgb(235, 159, 159)"}
          toastcolor={"black"}
          toaststate={toaststate}
       
        />
      }
    </div>
  );
}

export default MonthlyR;
