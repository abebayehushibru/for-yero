import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import "./datatable.scss";

type Props = {
  columns: GridColDef[];
  rows: GridRowsProp;
};
function Datatable(props: Props) {
  return (
    <div className="datatable" style={{ height: "auto" }}>
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        rowHeight={40}
        columns={props.columns}
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
  );
}

export default Datatable;
