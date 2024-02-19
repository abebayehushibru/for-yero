import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Toast from "../../component/toast/Toast";
import BarCode from "./BarCode";

type GridColDef = any;
type GridRowsProp = any;

const columns: GridColDef = [
  { field: "rollNo", headerName: "R.No", width: 60 },

  { field: "Product_name", headerName: "Product", width: 150 },

  
  { field: "Qty", headerName: "QTY", width: 150 },
  { field: "unitPrice", headerName: "Unit Price", width: 150 },

  {
    field: "totalPrice",
    headerName: " Total Price",
    width: 150,
    valueGetter: (params: any) => {
      return params.row.Qty * params.row.unitPrice;
    },
  },
];
import "../Request/singleRequest.scss";
import axios from "axios";
import { loggedInby } from "../../component/Datas";

const initialRows: GridRowsProp = [];
function SinglePurchase() {
  const [data, setData] = useState(initialRows);
  const [infodata, setInfoData] = useState(initialRows);
  const [totalQuantity, settotalQuantity] = useState(0);
  const [totalPrice, settotalPrice] = useState(0);
  const { id } = useParams();
 //status of request
 const [view, setViewu] = useState(false);
  //status of request
  const [status, setStatus] = useState("");
  // toast used to notify for admin
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [toastmsgcolor, setToastmsgcolor] = useState("");
  const [toastbg, setToastbg] = useState("");
  // function  decryptData  (text:any)  {
  //   const secretPass = "XkhZG4fW2t2W";
  //   const bytes = CryptoJS.AES.decrypt(text, secretPass);
  //   const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //   return data;
  // };
  //data of all purchase
  useEffect(() => {
    axios.post(`http://localhost:8000/getIncommingData/${id}`, {
      adminRole:loggedInby.adminRole,
      id:loggedInby.id
    }).then((response) => {
      const updatedData = response.data.allData[1].map(
        (row: any, index: number) => ({
          ...row,
          rollNo: index + 1,
        })
      );

      setData(updatedData);
console.log(updatedData);

      const updatedInfoData = response.data.allData[0][0];
      setStatus(updatedInfoData.status);
      setInfoData(updatedInfoData);
      Total(response.data.allData[1]);
    });
  }, []);

  //Handle Total Quantity and price function

  const Total = (Rowdata: any) => {
    let totalprice = 0;
    let totalqty = 0;
    Rowdata.map((item: any) => {
      console.log(item.unitPrice);

      totalqty = item.Qty + totalqty;
      totalprice = item.Qty * item.unitPrice + totalprice;
      settotalPrice(totalprice);
      settotalQuantity(totalqty);
    });
  };

  // Handle Approve

  const handleApprove = () => {
    
   
    axios
        .post("http://localhost:8000/Approve", {
          id: id,
          approveProducts: data,
          adminRole: loggedInby.adminRole,
          from: "incomingby",
        })
        .then((response) => {
          if (response.data.message === "Approved") {
            setToastmsgcolor("white");
            setToastbg("green");
            setNotify("Incomming status has Approved ");
            setToaststate(true);
            setStatus("Approved");
          } else {
          }
        });
    
  };
  return (
    <>
        {view && <BarCode data={data} setViewu={setViewu}></BarCode>}

      <Toast
        toastmsg={notify}
        toastbg={toastbg}
        toastcolor={toastmsgcolor}
        toaststate={toaststate}
        
      />

      <div className="singleReuest ">
        <span>Incomming Id : {id}</span>

        <div className="requestInfo">
          <div className="indentityInfo">
            <span>Recipient</span>
            
            <div className="item">
              <span>Name :</span>
              <span>{infodata.RecipientName}</span>
            </div>
            <div className="item">
              <span>Id :</span>
              <span>{infodata.RecipientDuId} </span>
            </div>
            <div className="item">
              <span>Date :</span>
              <span>{infodata.Date} </span>
            </div>
           

            <div className="item">
             {status && <span>
                Status :{" "}
                <button
                  className="btn "
                  style={{
                    backgroundColor: status == "Approved" ? "green" : "orange",
                  }}
                >
                  {status}
                </button>
              </span>}
            </div>
          </div>
          <div className="indentityInfo">
            <span>Donor </span>
            <div className="item">
              <span>Org Name :</span>
              <span>{infodata.DonorOrg}</span>
            </div>
            <div className="item">
              <span>Rep /Ind Name :</span>
              <span>{infodata.DonorName}</span>
            </div>
            <div className="item">
              <span>Id  :</span>
              <span>{infodata.DonorId} </span>
            </div>
           

           
          </div>
        </div>

        <div className="requestedItems">
          <span>All Incomming Item  <button className="viewBtn" onClick={()=>setViewu(true)}> View Bar-Code</button></span>
          <div className="table">
            <DataGrid
              className="dataGrid"
              rows={data}
              rowHeight={40}
              loading={false}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { pageSize: 6 } },
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                  quickFilterProps: { debounceMs: 600 },
                },
              }}
              pageSizeOptions={[6]}
              checkboxSelection
              disableRowSelectionOnClick
              disableDensitySelector
              disableColumnFilter
              disableColumnMenu={true}
            
              disableColumnSelector
            />{" "}
          </div>
        </div>
        <div className="totalDatas">
          <span>Total Quantity : {totalQuantity}</span>
            <span>Total item Price : {totalPrice} Birr</span>
         <span>Vat: {infodata.Vat} %</span>
       
          <span>Total Price : {totalPrice+totalPrice*infodata.Vat/100} Birr</span>
        </div>

        {infodata.status? status== "pending" ? (
          <button className="btn" onClick={handleApprove}>
            Approve Request
          </button>
        ) : (
          ""
        ):""}
      </div>

    </>
  );
}

export default SinglePurchase;
