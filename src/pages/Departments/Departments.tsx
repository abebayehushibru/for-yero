import {useState,useEffect} from 'react'
import axios from "axios";
import Datatable from '../../component/datatable/Datatable';
import Add from '../../component/add/Add';
import "../../styles/pages.scss"
import {
 
  GridRowsProp,

} from "@mui/x-data-grid";
import { loggedInby } from "../../component/Datas.tsx";





const initialRows: GridRowsProp = [];



function Departments() {
  const [open,setOpen]=useState(false)
  const [data, setData] = useState(initialRows);
  const [collges, setColleges] = useState(initialRows);
  const formData:any=[
 
  {
    Title:"Dept Name",
    type:"text",
    Name:"deptName"
  },
  
  ]
  // columns 
  const columns: any = [
    { field: 'rollNo', headerName: 'Id', width: 80 },
    { field: 'CollegeName', headerName: ' College', width: 150 },
  
  { field: 'Dept_Name', headerName: ' Department', width: 150 },
  
  {
    field: "action",
    headerName: "Action",
    width: 80,
    sortable: false,
  
    renderCell: (params: any) => {
      const handleDelete = () => {
        handleDeleteRow(params.row.id);
      };
  
      return (
        <div className="action">
          
          <div className="delete">
            <img src=" /delete.svg" alt="" onClick={handleDelete}  />
          </div>
        </div>
      );
    },
  },,
  
  
  ];
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Departments"
    })
    .then((response) => {

      const filterRows = response.data.allData.filter(
        (row: any) => row.collegeId ==loggedInby.forId
      );
      const updatedData = filterRows.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      setData(updatedData)});
  }, []);





  const handleDeleteRow = (id: number) => {
     axios
    .post("http://localhost:8000/Delete",{
      id:id,
      from:"Departments"
    })
    .then((response) => {
      if (response.data.message==="Deleted") {
        const updatedRows = data.filter((row) => row.id !== id);
        const updatedData = updatedRows.map((row: any, index: number) => ({
          ...row,
          rollNo: index + 1,
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
      <h1>Departments</h1>
      <button onClick={()=>{setOpen(true)}} className='button'>Add Department</button>
    </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
     { <Add slug={"Department"} formData={formData} setOpen={setOpen} open={open} products={products} />}
    </div>
  )
}

export default Departments