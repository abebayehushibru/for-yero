import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import "./handover.scss";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
const initialRows: GridRowsProp = [];
function SingleHandover() {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "R.no",
      width: 60,
      valueGetter: (params: any) => params.row.id,
    },

    { field: "Product_name", headerName: "Pro Name", width: 150 },

    { field: "Qty", headerName: "Qty", width: 80 },
    
    {
      field: "OldReqId",
      headerName: "old R.No",
      width: 150,
      renderCell: (props: any) => {
        return  <Link to={`/Approve/request/${ props.value}`} className="view">{"Req- Id-" + props.value}
        </Link>
      },
    },
    {
      field: "status",
      headerName: "Pro Current status",
      width: 150,
      editable: true,
    },
  ];

  const [infodata, setInfoData]:any = useState(initialRows);
  const [rows, setRows] = useState(initialRows);
  const { id } = useParams();

  useEffect(() => {
    axios
      .post(`http://localhost:8000/getHandoverData/${id}`)
      .then((response) => {
        console.log(response);
        
        const updatedData = response.data.allData[1].map(
          (row: any, index: number) => ({
            ...row,
            rollNo: index + 1,
          })
        );

      
        const updatedInfoData = response.data.allData[0];
        console.log(response.data.allData);
        
        setRows(updatedData);
        setInfoData(updatedInfoData);
      });
  }, []);

  return (
    <>
      <form className="handover">
        <span> Fixed Asset Transfer For Mafer</span>
        <div className="persons">
          <div className="person">
            <span>User of Asset Or From</span>
            <div className="items">
              <label>
                ID 
              </label>
              <span>{infodata.OldRequesteId}</span>
            </div>
            <div className="items">
              <label htmlFor="">Full name</label>
              <span>{infodata.OldRequesterName}</span>
            </div>
            <div className="items">
              <label htmlFor="">Address</label>
              <span>{infodata.OldRequesteAddress}</span>
            </div>
            <div className="items">
              <label htmlFor="">Dept</label>
              <span>{infodata.OldRequesteDeptId}</span>
            </div>
            <div className="items">
              <label htmlFor="">Bureau No</label>
              <span>{infodata.OldRequesteBureau}</span>
              
            </div>
          </div>
          <div className="person">
            <span>Asset Transferd To </span>
            <div className="items">
              <label>
                ID 
              </label>
              <span>{infodata.NewRequesteId}</span>
            </div>
            <div className="items">
              <label htmlFor="">Full name</label>
              <span>{infodata.NewRequesteName}</span>
            </div>
            <div className="items">
              <label htmlFor="">Address</label>
              <span>{infodata.NewRequesteAddress}</span>
            </div>
            <div className="items">
              <label htmlFor="">Dept</label>
              <span>{infodata.NewtRequesteDeptId}</span>
            </div>
            <div className="items">
              <label htmlFor="">Bureau No</label>
              <span>{infodata.NewRequesteBureau}</span>
            </div>
          </div>
        </div>
        <div className="Reperesent">
          <h2>Represent person Information And Date</h2>
          <div className="allInfo">
          <div className="items">
              <label>
                ID 
              </label>
              <span>{infodata.RepId}</span>
            </div>
            
            <div className="items">
              <label htmlFor="">Name</label>
              <span>{infodata.RepName}</span>
            </div>
            <div className="items">
              <label htmlFor="">Date</label>
              <span>{infodata.Date}</span>
            </div>
          </div>
        </div>

        <div className="table">
          <div className="div">
            <DataGrid
              className="dataGrid"
              rows={rows}
              rowHeight={35}
              columns={columns}
              localeText={{ noRowsLabel: "No Items Added" }}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              disableDensitySelector
              disableColumnFilter
              disableColumnMenu={true}
              disableRowSelectionOnClick
              disableColumnSelector
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default SingleHandover;
