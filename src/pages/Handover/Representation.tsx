import {useState,useEffect} from 'react'
import Datatable from '../../component/datatable/Datatable';
import Add from '../../component/add/Add';
import "../../styles/pages.scss"
import axios from 'axios';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';






function Representation() {
  const [open,setOpen]=useState(false)
  const initialRows: GridRowsProp = [];

  const [alldata, setAllData] = useState(initialRows);

 
   //data of all Representation
   useEffect(() => {
    axios
      .post("http://localhost:8000/AllData", {
        from: "Representation",
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

 

  const formData:any=[
   
    
    {
    Title:"Full Name",
    type:"text",
    Name:"Fname"
  },
  {
    Title:"Du ID",
    type:"text",
    Name:"duId"
  }
  
  
  ]
//columns

const columns: GridColDef[] = [
  { field: 'rollNo', headerName: 'Id', width: 80 },

{ field: 'R_Name', headerName: ' Full Name', width: 160 },
{ field: 'R_Id', headerName: 'DU Id', width: 140 },

{ field: 'R_Code', headerName: 'Code', width: 170 },



{ field: 'action', headerName: 'Action', width: 80,sortable: false  ,
      
renderCell:(params:any) =>{
  const handleDelete = () => {
    handleDeleteRow(params.row.id);}
 return  <div className="action">
  
 <div className="delete"><img src=" /delete.svg" alt=""  onClick={()=>{handleDelete()}}/></div>
  </div>

}},


];
  // handle deletd row
 const handleDeleteRow = (id: number) => {

  
  axios
 .post("http://localhost:8000/Delete",{
   id:id,
   from:"Representation"
 })
 .then((response) => {
   if (response.data.message==="Deleted") {
     const updatedRows = alldata.filter((row:any) => row.id !== id);
     const updatedData = updatedRows.map((row: any, index: number) => ({
       ...row,
       rollNo: index + 1,
     }));
     setAllData(updatedData);

   } else {
     
   }
  
  });

};
 // to handle warrning
 const product = ()=>{

 }
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>All Representation</h1>
      <button onClick={()=>{setOpen(true)}} className='button'>Add Representation</button>
    </div>
    <Datatable columns={columns} rows={alldata} 
 
  
  />
    {<Add slug={"Representation"} formData={formData} setOpen={setOpen} open={open} products={product}/>}   
  </div>
  )
}

export default Representation