import {useState,useEffect} from 'react'
import Datatable from '../../component/datatable/Datatable';
import Add from '../../component/add/Add';
import "../../styles/pages.scss"
import axios from 'axios';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';






function AllHandover() {
  const [open,setOpen]=useState(false)
  const initialRows: GridRowsProp = [];

  const [alldata, setAllData] = useState(initialRows);

 
   //data of all AllHandover
   useEffect(() => {
    axios
      .post("http://localhost:8000/AllData", {
        from: "handover",
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

 

 
//columns

const columns: GridColDef[] = [
  { field: 'rollNo', headerName: 'Id', width: 50 },

{ field: 'OldRequesterName', headerName: ' Old R.Name', width: 170 },

{ field: 'NewRequesteName', headerName: 'New R.Name', width: 170 },

{ field: 'RepName', headerName: ' Rep.Name', width: 170 },

{ field: 'Date', headerName: ' Date', width: 150 },





{ field: 'action', headerName: 'Action', width: 80,sortable: false  ,
      
renderCell:(params:any) =>{

 return <div className="action">
      
 <Link to={`/Stock/Handover/view/${params.row.id}`} className="view"><img src=" /view.svg" alt="" /></Link>
  
</div>

}},


];

 
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>All Handover</h1>
    
    </div>
    <Datatable columns={columns} rows={alldata} 
 
  
  />
   </div>
  )
}

export default AllHandover