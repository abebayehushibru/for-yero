import { useState, useEffect } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";

// import Datatable from '../../component/datatable/Datatable'
import "./unit.scss";
import Add from "../../component/add/Add";
import axios from "axios";

const formData: any = [
  {
    Title: "Unit Name",
    type: "text",
    Name: "unitName",
  },
  {
    Title: "Unit Symbol",
    type: "text",
    Name: "unitSymbol",
  },
];

const initialRows: GridRowsProp = [];

function Unit() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialRows);


  //columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "R.no",
      width: 60,
      
    },
    { field: "unitName", headerName: " Unit Name", width: 150 },
  
    { field: "unitSymbol", headerName: " Symbol", width: 150 },
  
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
  
      renderCell: (params: any) => {
        const handleDelete = () => {
          handleDeleteRow(params.row.id,params.row.unitName,params.row.unitSymbol);
        };
  
        return (
          <div className="action">
            
            <div className="delete">
              <img src=" /delete.svg" alt="" onClick={handleDelete}  />
            </div>
          </div>
        );
      },
    },
  ];
  // const fetchUnitData = () => {
  //   return axios
  //     .post("http://localhost:8000/AllUnit")
  //     .then((response) => setData(response.data.units));
  // };

  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Unit"
    })
    .then((response) => {
      const updatedData = response.data.allData.map((row: any, index: number) => ({
        ...row,
        id: index + 1,
      }));
      setData(updatedData)});
  }, []);

  //   const data = () => {
  //     axios
  //     .post("http://localhost:8000/AllUnit",{})
  //     .then((response) => {
  //       console.log(response.data.units );
  //      return response.data.units
  //     })
  //     .catch((error) => {
  //       // Handle the error
  //       console.log(error);
  //       console.log("error")
  //     });

  //  }

  const handleDeleteRow = (id: number,unitName:string,unitSymbol:string) => {
     axios
    .post("http://localhost:8000/Delete",{
      unitName:unitName,
      unitSymbol:unitSymbol,
      from:"Unit"
    })
    .then((response) => {
      if (response.data.message==="Deleted") {
        const updatedRows = data.filter((row) => row.id !== id);
        const updatedData = updatedRows.map((row: any, index: number) => ({
          ...row,
          id: index + 1,
        }));
        setData(updatedData);
  
      } else {
        
      }
     
     });
   
  };
// bellow function used for removal of warring message in using of add component
const products=(selectedcat:string) => {
  console.log(selectedcat);
    
  }
 
  return (
    <div className="PageConatainer">
      <div className="PageConatainer-info">
        <h1>Unit</h1>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="button"
        >
          Add Unit
        </button>
      </div>
      <div className="datatable" style={{ height: "auto" }}>
        <DataGrid
          className="dataGrid"
          rows={data}
          rowHeight={40}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 6 } } }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
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
        />
      </div>

      { <Add slug={"Unit"} formData={formData} setOpen={setOpen}   open={open} products={products}/>}
    </div>
  );
}

export default Unit;
