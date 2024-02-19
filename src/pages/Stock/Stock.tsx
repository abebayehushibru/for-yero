
import { useEffect, useState } from "react"; 
import Datatable from "../../component/datatable/Datatable"
import axios from "axios";


type GridColDef = any
type GridRowsProp = any



const columns: GridColDef[] = [
    { field: 'rollNo', headerName: 'Id', width: 80 },
  { field: 'Product_name', headerName: ' Name', width: 150 },
{ field: 'Category', headerName: ' Catagorey', width: 150 },
  { field: 'Unit', headerName: ' Unit', width: 150 },
  { field: 'inQty', headerName: ' InQt', width: 100,renderCell:(params:any) =>{

    return <button className="stockBtn " style={{backgroundColor:"green"}}>{params.value}</button>
    
} },
  { field: 'outQty', headerName: 'OutQt', width: 100 ,renderCell:(params:any) =>{

    return <button className="stockBtn " style={{backgroundColor:"red"}}>{params.value}</button>
    
} },
  { field: 'stock', headerName: 'Stock', width: 150,valueGetter: (params:any) =>params.row.inQty -  params.row.outQty  ,
      
  renderCell:(params:any) =>{

    return <button className="stockBtn " style={{backgroundColor:"rgb(28, 145, 203)"}}>{params.value}</button>
    
} }
  


];
const initialRows: GridRowsProp = [];
function Stock() {
  const [data, setData] = useState(initialRows);
  //data of all purchase
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"AllStock"
    })
    .then((response) => {
      const updatedData = response.data.allData.map((row: any, index: number) => ({
        ...row,
        rollNo: index + 1,
      }));
      setData(updatedData)});
  }, []);
 return (
   <>
   
     
    <div className="PageConatainer">
      <div className="PageConatainer-info">
        <h1>Stock Report</h1>
        </div>
      <Datatable columns={columns} rows={data}/>
     
   
      
    </div>
  </>
  )
}

export default Stock