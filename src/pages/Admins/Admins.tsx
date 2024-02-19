import {useState,useEffect} from 'react'
import Datatable from '../../component/datatable/Datatable';
import Add from '../../component/add/Add';
import "../../styles/pages.scss"
import axios from 'axios';
import { GridRowsProp } from '@mui/x-data-grid';

import { loggedInby } from "../../component/Datas.tsx";






function Admins() {
  const [open,setOpen]=useState(false)
  const initialRows: GridRowsProp = [];

  const [alldata, setAllData] = useState(initialRows);
  const [collges, setColleges] = useState(initialRows);
  const [campus, setCampus] = useState(initialRows);
  const [dept, setDept] = useState(initialRows);

  const [selectedCollegedept, setselectedCollegedept] = useState(initialRows);
 // all colleges

 useEffect(() => {
  axios
  .post("http://localhost:8000/AllData",{
    from:"Campus"
  })
  .then((response) => {
 const newArray=  response.data.allData.map((obj: any, ) => {
   return Object.values([obj.campusName,obj.id]);
    });
   
    
    setCampus(newArray)
    });

     // all colleges
     axios
     .post("http://localhost:8000/AllData",{
       from:"AllColleges"
     })
     .then((response) => {
       const filterRows = response.data.allData.filter((row: any) => row.campus_id ==loggedInby.forId
       );
    const newArray=  filterRows.map((obj: any, ) => {
      return Object.values([obj.CollegeName,obj.id]);
       });
       setColleges(newArray)
       });
   // all departments
       axios
       .post("http://localhost:8000/AllData",{
         from:"Departments"
       })
       .then((response) => {
         const filterRows = response.data.allData.filter(
           (row: any) => row.collegeId ==loggedInby.forId
         );
         const updatedData =filterRows.map((row: any) => ([row.Dept_Name,row.id
           ]
    ));
         const newArray=updatedData.map((obj: any ) => {
           return Object.values(obj);
            });
         setDept(newArray)
         console.log(response.data.allData);
         console.log(newArray);
         
         
         });
    //data of all admins
         axios
         .post("http://localhost:8000/AllData", {
           from: "Admins",
           role:loggedInby.adminRole,
          forId:loggedInby.forId
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
 

 

  //
  const handleSelectedCollege=(id:number)=>{
    const updatedRows = dept.filter((row) => row[1]== id);
    const updatedData = updatedRows.map((row: any) => ([row[3],
      row[2]]
      
      
    ));
    setselectedCollegedept(updatedData);
    console.log(updatedRows);
    
  }
  const admininfo:any=[   {
    Title:"Full Name",
    type:"text",
    Name:"Fname"
  },
  {
    Title:"Du ID",
    type:"text",
    Name:"duId"
  },
  {
    Title:"user Name",
    type:"text",
    Name:"uName"
  },
  {
    Title:"email",
    type:"email",
    Name:"email"
  },
  {
    Title:"Password",
    type:"text",
    Name:"pwd"
  }]
//
  const [formData, setFormData]:any = useState([{}]);
const handleAdminRoles=(role:string)=>{


  if (role=== "SuperAdmin") {

    setFormData([
      {
        Title:"Role ",
        type:"select",
        option:[["Vice P Admin","vicePresident"],["Finance","Finance"],["Staff Admin","admin"],["Garage Admin","garage"],["Used Asset Admin","usedAssetadmin"],["Inventory Controller","controller"],["Recipient","Recipient"]],
        Name:"role"
      }
      ,{
        Title:"Campus ",
        type:"select",
        option:campus,
         Name:"campus"
      }
    
    ].concat(admininfo))
  
    
  }
  else if (role=== "collegeAdmin") {
    setFormData([
    {
      Title:"Role ",
      type:"select",
      option:[["Dept Admin","deptAdmin"]],
      Name:"role"
    },
    {
      Title:"Department ",
      type:"select",
      option:dept,
      Name:"deptid"
    }].concat(admininfo))
  }
  else if (role=== "vicePresident") {
    setFormData( [
      {
        Title:"Role ",
        type:"select",
        option:[["College Admin","collegeAdmin"]],
        Name:"role"
      },{
      Title:"Collges ",
      type:"select",
      option:collges,
      Name:"collegeId"
    }].concat(admininfo))
  }


  setOpen(true)
}
  const [columns]:any = useState( [
    { field: 'rollNo', headerName: 'Id', width: 80 },
  
  { field: 'fName', headerName: ' Full Name', width: 150 },
  { field: 'adminId', headerName: 'DU Id', width: 120 },
  { field: 'adminRole', headerName: '  Role', width: 150 },
   ]);


//columns
if (loggedInby.adminRole=="collegeAdmin") {
  columns.push({ field: 'Dept_Name', headerName: '  Department', width: 200 })
 }
else  if (loggedInby.adminRole=="vicePresident") {
  columns.push({ field: 'CollegeName', headerName: 'College', width: 150 })
}

columns.push({ field: 'action', headerName: 'Action', width: 80,sortable: false ,valueGetter: (params:any) =>params.row.id ==1?"not":"yes"  ,
      
renderCell:(params:any) =>{
  const handleDelete = () => {
    handleDeleteRow(params.row.id);}
 return params.value==="not"?"": <div className="action">
  
 <div className="delete"><img src=" /delete.svg" alt=""  onClick={()=>{handleDelete()}}/></div>
  </div>

}})
  // handle deletd row
 const handleDeleteRow = (id: number) => {

  
  axios
 .post("http://localhost:8000/Delete",{
   id:id,
   from:"Admins"
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
 
  return (
    <div className="PageConatainer">
    <div className="PageConatainer-info">
      <h1>All Admins</h1>
      <button onClick={()=>{handleAdminRoles(loggedInby.adminRole)}} className='button'>Add Admins</button>
    </div>
    <Datatable columns={columns} rows={alldata} 
 
  
  />
    {<Add slug={"Admin"} formData={formData} setOpen={setOpen} open={open} products={handleSelectedCollege}/>}   
  </div>
  )
}

export default Admins