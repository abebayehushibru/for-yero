
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import "./barcode.scss"
import Barcode from "react-barcode";
import { Value } from "sass";

function BarCode(props:any) {
    
    const columns: any = [
        { field: "rollNo", headerName: "R.No", width: 60 },
      
        { field: "id", headerName: "Pro ID", width: 150 },
      
        
        {field:"barCode", headerName: "Barcode" ,width:200,
        valueGetter: (params: any) => {
          return params.row.id+10000000000000;
        },
          renderCell: (param:any) => {
            return  <Barcode value ={param.value} height={40}/>;
          },
       
    
    
    }]
       
  return (
    <div className='barcode'>
        
        <div className="barConatiner">
            <h4><span>View Bar-Codes</span> <button onClick={()=>props.setViewu(false)}>X</button></h4>

            <div className="table">
             
            <DataGrid
              className="dataGrid"
           rows={props.data}
              rowHeight={70}
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
              disableColumnMenu={false}
              
             
            />{" "}
          </div>
        </div>

    </div>

  )
}

export default BarCode