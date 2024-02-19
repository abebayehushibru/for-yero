import {useState,useEffect} from 'react'
import axios from "axios";
import Datatable from '../../component/datatable/Datatable';
import Add from '../../component/add/Add';
import "../../styles/pages.scss"
import {
 
  GridRowsProp,

} from "@mui/x-data-grid";
import { loggedInby } from '../../component/Datas';

const formData:any=[{
  Title:"College Name",
  type:"text",
  Name:"CollegeName"
},


]


const initialRows: GridRowsProp = [];



function Colleges() {
  const [open,setOpen]=useState(false)
  const [data, setData] = useState(initialRows);

  // columns 
  const columns: any = [
    { field: 'id', headerName: 'Id', width: 80 },
  
  { field: 'CollegeName', headerName: ' College Name', width: 150 },
  
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
      from:"AllColleges"
    })
    .then((response) => {
      const updatedRows = response.data.allData.filter((row:any) => row.campus_id ==loggedInby.forId);
      const updatedData = updatedRows.map((row: any, index: number) => ({
        ...row,
        id: index + 1,
      }));
      setData(updatedData)});
  }, []);



  const handleDeleteRow = (id: number) => {
     axios
    .post("http://localhost:8000/Delete",{
      id:id,
      from:"Colleges"
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
      <h1>Colleges</h1>
      <button onClick={()=>{setOpen(true)}} className='button'>Add Colleges</button>
    </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
     { <Add slug={"Colleges"} formData={formData} setOpen={setOpen} open={open} products={products} />}
    </div>
  )
}

export default Colleges