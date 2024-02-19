import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Toast from "../../component/toast/Toast";
import { loggedInby } from "../../component/Datas.tsx";

type GridColDef = any;
type GridRowsProp = any;



const columns2: GridColDef = [
  { field: "rollNo", headerName: "R.No", width: 60 },

  { field: "Product_name", headerName: "Product", width: 150 },

  { field: "Qty", headerName: "QTY", width: 150 },
  { field: "CurrentStatus", headerName: "Current status", width: 150 },


];
import "./SingleRetrived.scss";
import axios from "axios";
const initialRows: GridRowsProp = [];
function SingleRetrived() {
  const [data, setData] = useState(initialRows);
  const [infodata, setInfoData] = useState(initialRows);
  const [adminsData, setAdimnsData] = useState([{}]);
  const  [adminsStatus, setadminsStatus]:any= useState([]);
  const { id } = useParams();
  const  [ approveProducts]= useState([{}]);
  //status of request
  const [status, setStatus] = useState("");
  // toast used to notify for admin
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [toastmsgcolor, setToastmsgcolor] = useState("");
  const [toastbg, setToastbg] = useState("");
 
  useEffect(() => {
    axios
      .get(`http://localhost:8000/backTostoreIdData/${id}`)
      .then((response) => {
        console.log(response.data.allData);
        const updatedData = response.data.allData[1].map(
          (row: any, index: number) => ({
            ...row,
            rollNo: index + 1,
          })
        );

        setData(updatedData);

        const updatedInfoData = response.data.allData[0];

      //  setStatus(updatedInfoData.status);

        setInfoData(updatedInfoData);
        setAdimnsData(updatedInfoData.adminsData);
      
        setadminsStatus([updatedInfoData.onGarageStatus,updatedInfoData.FirstControllerStatus
          ,updatedInfoData.SecondControllerStatus
          ,updatedInfoData.SuperAdminSatus
        ])
        // Total(response.data.allData[1]);
      });
  }, []);

 
  const handleApprove = () => {
  
    
    data.forEach((item: any) => {
    
        approveProducts.push({
          pro_id: item.Product_id,
          Qty: item.Qty,
        });
      
     
    });
      axios
        .post("http://localhost:8000/Approve", {
          id: id,
       
          from: "Backtostore",
          adminRole: loggedInby.adminRole,
          adminId: loggedInby.id,
          approveProducts:approveProducts
        
        })
        .then((response) => {
          if (response.data.message === "Approved") {
            setToastmsgcolor("white");
            setToastbg("green");
            setNotify("Requsted has Approved ");
            setToaststate(true);
            setStatus("Approved");
           
          } else {
          }
        });
    
  };

 

const header=["Garage Checked By","Inventory Controller 1","Inventory Controller 2","Halafi "]
  return (
    <>
      <Toast
        toastmsg={notify}
        toastbg={toastbg}
        toastcolor={toastmsgcolor}
        toaststate={toaststate}
       
      />
      {/* SELECT id, Fname, R_id, onGarageId, onGarageStatus, FirstControllerId, FirstControllerStatus, SecondControllerId, SecondControllerStatus, SuperAdminSatus, Date FROM backtostore WHERE 1 */}
      <div className="singleReuest">
        <span>Retrived Id : {id}</span>

        <div className="requestInfo retriver">
          <div className="indentityInfo">
            <span>Retrived from</span>
            <div className="item">
              <span>Name :</span>
              <span>{infodata.Fname}</span>
            </div>
            <div className="item">
              <span>Id Number :</span>
              <span>{infodata.R_id} </span>
            </div>
            <div className="item">
              <span>Date :</span>
              <span>{infodata.Date} </span>
            </div>
          </div>
        
         
        </div>
        <div className="requestInfo">
        {adminsData.map((item:any,index)=>{
          
         
           
           return <div className="indentityInfo">
           <span>{header[index]}</span>
           <div className="item">
             <span>Name :</span>
             <span>{item.fName}</span>
           </div>
           <div className="item">
             <span>Id Number :</span>
             <span>{item.adminId} </span>
           </div>
        
           <div className="item">
             <span>
               Status :{" "}
               {adminsStatus[index]&&   <button
                 className="btn "
                 style={{
                   
                   backgroundColor:adminsStatus[index]=="pending" ?"orange":adminsStatus[index]=="Approved" ?"green":"rgb(10,30,60)",
                 }}
               >
                 {adminsStatus[index]}
               </button>}
             </span>
           </div>
         </div>
         })}
             

          
         
        </div>

        <div className="requestedItems">
          <span>Retrived Item</span>
          <div className="table">
            <DataGrid
              className="dataGrid"
              rows={data}
              rowHeight={40}
              loading={false}
              columns={ columns2}
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
       {status=="pending"? <button className="btn" onClick={handleApprove}>
            Approve
          </button>:""}
          {adminsData.map((item:any,index)=>{
          if (loggedInby.adminId==item.adminId) {
            return adminsStatus[index]=="pending"? <button className="btn" onClick={handleApprove}>
            Approve
          </button>:""
          }})}
            
      </div>
    </>
  );
}

export default SingleRetrived;
