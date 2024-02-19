import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Toast from "../../component/toast/Toast";
import { loggedInby } from "../../component/Datas.tsx";
import CryptoJS from "crypto-js";
type GridColDef = any;
type GridRowsProp = any;

const columns: GridColDef = [
  { field: "rollNo", headerName: "R.No", width: 60 },

  { field: "Product_name", headerName: "Product", width: 150 },

  { field: "current_stock", headerName: "Current stock", width: 150 },
  ,{ field: "ItemStatus", headerName: "Status", width: 150 },

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
const columns2: GridColDef = [
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
import "./singleRequest.scss";
import axios from "axios";
const initialRows: GridRowsProp = [];
function SingleRequest() {
  const [data, setData] = useState(initialRows);
  const [infodata, setInfoData] = useState(initialRows);
  const [totalQuantity, settotalQuantity] = useState(0);
  const [totalPrice, settotalPrice] = useState(0);
  const { id } = useParams();
 
  const [status, setStatus] = useState("");
  // toast used to notify for admin
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [toastmsgcolor, setToastmsgcolor] = useState("");
  const [toastbg, setToastbg] = useState("");
  const [bgColor, setBgColor] = useState("");

  //data of all purchase
  useEffect(() => {
    axios
      .post(`http://localhost:8000/IdData/${id}`, {
        adminRole: loggedInby.adminRole,
        Dept_Id: loggedInby.deptId,
      })
      .then((response) => {
        const updatedData = response.data.allData[1].map(
          (row: any, index: number) => ({
            ...row,
            rollNo: index + 1,
          })
        );

        setData(updatedData);

        const updatedInfoData = response.data.allData[0][0];
        setStatus(updatedInfoData.status);
        if (updatedInfoData.status == "Approved") {
          setBgColor("green");
        } else if (updatedInfoData.status == "Finished") {
          setBgColor("rgb(84, 84, 84)");
        } else {
          setBgColor("orange");
        }
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

  const handleApprove = (operation: string) => {
    console.log(operation);

    //handle a requsety quantity lessthan equal to current store quantity
    let canApprove = false;
    // to handle product number in store for will approved
    const approveProducts: any = [];
    if (
      loggedInby.adminRole == "SuperAdmin" ||
      loggedInby.adminRole == "admin"
    ) {
      data.forEach((item: any) => {
        if (item.current_stock >= item.Qty) {
          approveProducts.push({
            pro_id: item.Product_id,
            Qty: item.Qty,
          });
          canApprove = true;
        } else {
          setToastmsgcolor("white");
          setToastbg("red");
          setNotify(
            "Requsted Quantity fro  " +
              item.Product_name +
              "  Greater than Current stock quantity of Product\nPlease make purchase "
          );
          setToaststate(true);

          canApprove = false;
          return;
        }
      });
    } else  {
      canApprove = true;
    }

    if (!canApprove) {
      return;
    } else {
      axios
        .post("http://localhost:8000/Approve", {
          id: id,
          approveProducts: approveProducts,
          from: "requestedby",
          adminRole: loggedInby.adminRole,
          Dept_Id: loggedInby.deptId,
          operation: operation,
        })
        .then((response) => {
          if (response.data.message === "Approved") {
            setToastmsgcolor("white");
            setToastbg("green");
            setNotify("Requsted has Approved ");
            setToaststate(true);
            setStatus("Approved");
            setBgColor("green");
          } else {
          }
        });
    }
  };
  return (
    <>
      <Toast
        toastmsg={notify}
        toastbg={toastbg}
        toastcolor={toastmsgcolor}
        toaststate={toaststate}
      
      />

      <div className="singleReuest">
        <span>Request Id : {id}</span>

        <div className="requestInfo">
          <div className="indentityInfo">
            <div className="item">
              <span>Name :</span>
              <span>{infodata.fullName}</span>
            </div>
            <div className="item">
              <span>Id Number :</span>
              <span>{infodata.UserDuId} </span>
            </div>
            :
           { infodata.CollegeName}

            <div className="item">
              <span>email :</span>
              <a href={`mailTo:${infodata.Email}`}>{infodata.Email} </a>
            </div>
            {infodata.CollegeName!="No College"?
            <>
            <div className="item">
              <span>College &#8282; </span>
              <span>{infodata.CollegeName}</span>
            </div>
            <div className="item">
              <span>Department &#8282; </span>
              <span>{infodata.Dept_Name}</span>
            </div></>:<div className="item">
              <span>College : 
                </span>
              <span>{"Your College"}</span>
            </div>
            
          }
           
            <div className="item">
              <span>
                Status :{" "}
                <button
                  className="btn "
                  style={{
                    backgroundColor: bgColor,
                  }}
                >
                  {status}
                </button>
                

              
              </span>
            </div>
            <div className="item">
             

              {infodata.reqfrom == "you" ? infodata.whereRrq=="You can"?<span>You can get Your requested Items </span>:infodata.whereRrq!="Done"? <span>Your Request reach  to {infodata.whereRrq}</span>:"":""}
           
            </div>
          </div>
          <div
            className="reason"
            style={{ visibility: infodata.reason ? "visible" : "hidden" }}
          >
            <span>Reason</span>
            <p>{infodata.reason} </p>
          </div>
        </div>

        <div className="requestedItems">
          <span>Requested Item</span>
          <div className="table">
            <DataGrid
              className="dataGrid"
              rows={data}
              rowHeight={40}
              loading={false}
              columns={loggedInby.adminRole == "Admin" ? columns : columns2}
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
          <span>Total Price : {totalPrice} Birr</span>
        </div>

        {(loggedInby.adminRole == "SuperAdmin" ||loggedInby.adminRole == "admin"||loggedInby.adminRole == "vicePresident" ||loggedInby.adminRole == "Finance" )  &&  status == "pending" ? (
         <div className="btns">
          <button
            className="btn"
            onClick={() => {
              handleApprove("Approve");
            }}
          >
            Approve Request
          </button>
        
        </div>) : loggedInby.adminRole == "user" ? (
          ""
        ) : status == "pending" ? (
          <div className="btns">
            <button
              className="btn"
              onClick={() => {
                handleApprove("Approve");
              }}
            >
              Approve Request
            </button>
            <button
              className="btn"
              onClick={() => {
                handleApprove("redirect");
              }}
            >
              Set Finished
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default SingleRequest;
