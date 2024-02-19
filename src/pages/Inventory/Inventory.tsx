
import { useState,useEffect } from "react"
import Datatable from "../../component/datatable/Datatable"
import "../../styles/pages.scss"
import Add from "../../component/add/Add"
import axios from "axios";
type GridColDef = any
type GridRowsProp = any



const initialRows: GridRowsProp = [];

function Inventory() {
  const [open,setOpen]=useState(false)
  const [data, setData] = useState(initialRows);
  const [cat, setCat] = useState(initialRows);
  const [unit, setUnit] = useState(initialRows);
// form data
const formData:any=[
  {
    Title:"Category",
    type:"select",
    option:cat,
    Name:"Product_catagory"
  },
  {
    Title:"Fixed / Not",
      type:"select",
      option:["Fixed","Not"],
      Name:"IsFixed"
  }
  ,
  {
    Title:"Unit",
    type:"select",
    option:unit,
    Name:"Product_unit"
  },
  {
  Title:"Product Name",
  type:"text",
  Name:"Product_name"
}
,


{
  Title:"product Image",
  type:"file",
    Name:"Product_img"
}

]
  //select all category
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Category"
    })
    .then((response) => {
   const newArray=  response.data.allData.map((obj: any, ) => {
     return Object.values(obj);
      });
      setCat(newArray)
      });
  }, []);

  //select all Unit
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Unit"
    })
    .then((response) => {
   const newArray=  response.data.allData.map((obj: any, ) => {
     return Object.values(obj);
      });
      setUnit(newArray)
      });

  }, []);


  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Inventory"
    })
    .then((response) => {
      const updatedData = response.data.allData.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      setData(updatedData)});
  }, []);



  const handleDeleteRow = (id: number) => {
     axios
    .post("http://localhost:8000/Delete",{
      id:id,
      from:"Inventory"
    })
    .then((response) => {
      if (response.data.message==="Deleted") {
        const updatedRows = data.filter((row:any) => row.id !== id);
        const updatedData = updatedRows.map((row: any, index: number) => ({
          ...row,
          rollNo: index + 1,
        }));
        setData(updatedData);
  
      } else {
        
      }
     
     });
   
  };


  //column
  const columns: GridColDef[] = [
    { field: 'rollNo', headerName: 'Id', width: 80 },
   
    { field: 'Img', headerName: 'Image', width: 100,
renderCell:(params:any) =>{
    return <img src={"http://localhost:8000/images/"+params.row.Img||" /noavatar.png"}/>
},sortable: false },

  { field: 'Product_name', headerName: ' Name', width: 150 },
    { field: 'Category', headerName: ' Catagorey', width: 150 },
  { field: 'Unit', headerName: ' Unit', width: 150 },
  { field: 'Date', headerName: 'Date', width: 150 },
  { field: 'action', headerName: 'Action', width: 80,sortable: false ,
  
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
    );}},


];

// bellow function used for removal of warring message in using of add component
const products=(selectedcat:string) => {
console.log(selectedcat);
  
}

  return (
   <>
   
     
    <div className="PageConatainer">
      <div className="PageConatainer-info">
        <h1>Inventories</h1>
        <button className="button" onClick={()=>{setOpen(true)}} >Add Inventory</button>
      </div>
      <Datatable columns={columns} rows={data}/>
      {<Add formData={formData} slug={"Inventory"} setOpen={setOpen} open={open} products={products}/>}


   
      
    </div>
  </>
  )
}

export default Inventory