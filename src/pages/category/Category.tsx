import {useState,useEffect} from 'react'
import axios from "axios";
import Datatable from '../../component/datatable/Datatable';
import Add from '../../component/add/Add';
import "../../styles/pages.scss"
import {
 
  GridRowsProp,

} from "@mui/x-data-grid";

const formData:any=[{
  Title:"Category Name",
  type:"text",
  Name:"CategoryName"
},


]


const initialRows: GridRowsProp = [];



function Category() {
  const [open,setOpen]=useState(false)
  const [data, setData] = useState(initialRows);

  // columns 
  const columns: any = [
    { field: 'id', headerName: 'Id', width: 80 },
  
  { field: 'CategoryName', headerName: ' Category', width: 150 },
  
  {
    field: "action",
    headerName: "Action",
    width: 80,
    sortable: false,
  
    renderCell: (params: any) => {
      const handleDelete = () => {
        handleDeleteRow(params.row.id,params.row.CategoryName);
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
      from:"Category"
    })
    .then((response) => {
      const updatedData = response.data.allData.map((row: any, index: number) => ({
        ...row,
        id: index + 1,
      }));
      setData(updatedData)});
  }, []);



  const handleDeleteRow = (id: number,CategoryName:string) => {
     axios
    .post("http://localhost:8000/Delete",{
      CategoryName:CategoryName,
      from:"Category"
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
      <h1>Category</h1>
      <button onClick={()=>{setOpen(true)}} className='button'>Add Category</button>
    </div>
    <Datatable columns={columns} rows={data} 
 
  
  />
     { <Add slug={"Category"} formData={formData} setOpen={setOpen} open={open} products={products} />}
    </div>
  )
}

export default Category