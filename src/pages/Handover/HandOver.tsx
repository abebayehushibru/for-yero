import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import "./handover.scss";
import Toast from "../../component/toast/Toast";
import Autorizationchaker from "../../component/Autorizationchaker/Autorizationchaker";
import axios from "axios";
const initialRows: GridRowsProp= [];
function HandOver() {
   
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "R.no",
      width: 60,
      valueGetter: (params: any) => params.row.id,
    },

    { field: "Inventory_Name", headerName: "Pro Name", width: 150 },

    { field: "Qt", headerName: "Qty", width: 80, editable: true },
   

    {
      field: "old_r_no",
      headerName: "old R.No",
      width: 150,
      renderCell: (props: any) => {
        return "Req- Id-"+props.value;
      },
    },
    {
      field: "current_status",
      headerName: "Pro Current status",
      width: 150,
      editable: true,
    },

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
            <div className="delete" onClick={handleDelete}>
              <img src=" /delete.svg" alt="" />
            </div>
          </div>
        );
      },
    },
  ];
  const [collges, setColleges] = useState(initialRows);
  const [dept, setDept] = useState(initialRows);
  const [selectedCollegedept, setselectedCollegedept] = useState(initialRows);
 
  // all colleges

  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Colleges"
    })
    .then((response) => {
   const newArray=  response.data.allData.map((obj: any, ) => {
     return Object.values(obj);
      });
      setColleges(newArray)

      handleSelectedCollege(newArray[0][1],"old")
      handleSelectedCollege(newArray[0][1],"new")
      });
  }, []);

  const [depts, setDepts] = useState(initialRows);
  const [dept2, setDept2] = useState(initialRows);
  useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"Departments"
    })
    .then((response) => {
     console.log(response.data.allData);
 
      setDepts(response.data.allData)});
  }, []);

  const handleSelectedCollege=(id:any,forwho:any)=>{
    const updatedRows = depts.filter((row) => row.collegeId== id);
    
    if (forwho=="old") {
      setDept(updatedRows);
    }
    else{
      setDept2(updatedRows);
    }
 
   
   
  }

  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [toastmsgcolor, setToastmsgcolor] = useState("");
  const [toastbg, setToastbg] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [allreq, setAllreq] = useState(initialRows);
  const [allReqPro, setAllreqPro] = useState(initialRows);
  const [allIdreq, setAllIdreq] = useState(initialRows);
  const [Id, setId]:any = useState(initialRows);
 const [Info, setInfo]:any = useState();
 
 const [allIdreqpro, setAllIdreqpro] = useState(initialRows);
 const handleAddRow = () => {
 
    const inventory: any = selectedPro.split(",");
    console.log(selectedPro);

    if (inventory.length != 1) {
      const newRow = {
        id: rows.length + 1,
        Inventory_Name: inventory[1],
        Inventory_Id: inventory[0],
        
        old_r_no: oldR,
        current_status: stOfPro,
  
        Qt: 1,
      
      };

      if (
        !isNewRowExist(
       
          inventory[1],
          oldR
        )
      ) {
        setRows([...rows, newRow]);
      } else {
        // Handle case when new row already exists
        setToastmsgcolor("black");
        setToastbg("rgb(194, 202, 47)");
        setNotify("Already Exist Item");
        setToaststate(true);
      }
    } else {
      let wrong = "";
      if (Id == "") {
        wrong = "Id Field is empty";
      } else {
        wrong = "Product Hasn't Selected";
      }
      setToastmsgcolor("black");
      setToastbg("rgb(194, 202, 47)");
      setNotify(wrong);
      setToaststate(true);
    }
  };
  const isNewRowExist = (
    
    Inventory_Name: string,
    old_r_no: string
  ) => {
    let count = 0;
    rows.map((row: any) => {
      if (
        row.Inventory_Name === Inventory_Name &&
        
        row.old_r_no === old_r_no
      ) {
        return count++;
      }
    });
    if (count > 0) {
      return true;
    }
  };

  const handleDeleteRow = (id: number) => {
    const updatedRows = rows.filter((row:any) => row.id !== id);
    handleRowsChange(updatedRows);
  };
  const handleRowsChange = (newRows: any) => {
    // Update the IDs of the remaining rows if needed
    const updatedRows = newRows.map((row: any, index: number) => ({
      ...row,
      id: index + 1,
    }));
    setRows(updatedRows);
  };

  //all request
 
   useEffect(() => {
    axios
    .post("http://localhost:8000/AllData",{
      from:"AllRequest",
       adminRole:"Handover",
  
    })
    .then((response) => {
     
      
      setAllreq(response.data.allData)
    setOldR(response.data.allData[0])});
  }, []);

    //all product
 
    useEffect(() => {
      axios
      .post("http://localhost:8000/AllData",{
        from:"requests",
       
    
      })
      .then((response) => {
       
       
        
        setAllreqPro(response.data.allData)});
    }, []);

  // check autorization
  const [oldR, setOldR]:any = useState("");
  const [selectedPro, setselectedPro]:any = useState();
  const [stOfPro, setstOfPro]:any = useState("Working");
 
  const [ autorized, setautorized]=useState(false)

  const isAutorized=(isyes:boolean,info:any)=>{
    setautorized(isyes)
setInfo(info)
  }
const HandleAllRequestOf=(id:string)=>{
  const updatedRows = allreq.filter((req:any) => req.UserDuId == id);
  setAllIdreq(updatedRows);
  setOldR(updatedRows[0].id)
}
const HandleProductOf=(id:string)=>{
  const updatedRows = allReqPro.filter((req:any) => req.RequestedById == id);
  setselectedPro(`${updatedRows[0].Product_id},${updatedRows[0].Product_name}`)
  setAllIdreqpro(updatedRows);

}

const Save=(e:any)=>{
  e.preventDefault();

  let err = "j";
    if (e.target.userID.value === "") {
      err = "Id of old user field empty";
    }  else if (e.target.userName.value === "") {
      err = "Full name of old user field empty";
    } else if (e.target.userAddress.value === "") {
      err = "Address of old user field empty";
    } else if (e.target.userDept.value === "") {
      err = "Department of old user empty";
    } else if (e.target.userBureau.value=="") {
      err = "Bureau of Old user field is empty";
    } else  if (e.target.ToID.value === "") {
      err = "Id of new user field empty";
    } else if (e.target.ToName.value === "") {
      err = "Full name of new user field empty";
    } else if (e.target.ToAddress.value === "") {
      err = "Address of new user field empty";
    } else if (e.target.ToDept.value === "") {
      err = "Department of new user empty";
    } else if (e.target.ToBureau.value==="") {
      err = "Bureau of new user field is empty";
    } else if (rows.length === 0) {
      err = "No items Added";
    }
    err = "";
     if (err=="") {
      const oldUser={
        id:e.target.userID.value,
        name:e.target.userName.value,
       Address:e.target.userAddress.value,
       Dept:e.target.userDept.value,
       Bureau:e.target.userBureau.value,
      }
      const newUser={
        id:e.target.ToID.value,
        name:e.target.ToName.value,
       Address:e.target.ToAddress.value,
       Dept:e.target.ToDept.value,
       Bureau:e.target.ToBureau.value,
      } 

      console.log(oldUser);
      
      axios
        .post("http://localhost:8000/handoverAdd", {
          oldUser:oldUser,
          newUser:newUser,
          rows:JSON.stringify(rows),
          info:Info
        })
        .then((response) => {
          setToaststate(true);
          if (response.data.message === "Inserted") {
            // props.append(data+{id:props.index})
            setNotify("Handover Registered successfuly");
            setToastbg("green");
            setToastmsgcolor("white");
            setRows([])
          } else if (response.data.message === "Not Inserted") {
            // If the request is not successful processed
            setNotify(" please try 4 again");

            setToastbg("red");
          }
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
          console.log("error");
        });
    }
    else{
      setToaststate(true);
      setNotify(err);
      setToastmsgcolor("white");
      setToastbg("red");
    }
 
  //console.log(oldUser);
  
}
  return (
   <>

   {
    !autorized&& <Autorizationchaker isAutorized={isAutorized}/>
   }
    <form className="handover" onSubmit={(e:any)=>Save(e)}>
      <span> Fixed Asset Transfer Form</span>
      <div className="persons">
        <div className="person">
          <span>User of Asset Or From</span>
          <div className="items">
            <label >ID <span style={{color:"red"}}>*</span></label>
            <input type="text" name="userID"  onChange={(e:any)=>{HandleAllRequestOf(e.target.value)
            setId(e.target.value)}}/>
          </div>
          <div className="items">
            <label htmlFor="">Full name</label>
            <input type="text" name="userName" />
          </div>
          <div className="items">
            <label htmlFor="">Address</label>
            <input type="text" name="userAddress" />
          </div>
          <div className="items">
            <label htmlFor="">College</label>
           <select name="" id="" onChange={(e:any)=>(handleSelectedCollege(e.target.value,"old"))}>
           {collges.map((item: any) => {
                    return (
                      <option key={item} value={item[1]}>
                        {item[0]}
                      </option>
                    );
                  })}

           </select>
          </div>
          <div className="items">
            <label htmlFor="">Dept</label>
            <select name="userDept" id="" >
           {dept.map((item: any) => {
                    return (
                      <option key={item.id} value={item.Dept_Name}>
                        {item.Dept_Name}
                      </option>
                    );
                  })}

           </select>
          </div>
          <div className="items">
            <label htmlFor="">Bureau No</label>
            <input type="text" name="userBureau" />
          </div>
         
        </div>
        <div className="person">
          <span>Asset Transferd To </span>
          <div className="items">
            <label htmlFor="">ID</label>
            <input type="text" name="ToID" />
          </div>
          <div className="items">
            <label htmlFor="">Full name</label>
            <input type="text" name="ToName" />
          </div>
          <div className="items">
            <label htmlFor="">Address</label>
            <input type="text" name="ToAddress" />
          </div>
          <div className="items">
            <label htmlFor="">College</label>
           <select name="" id="" onChange={(e:any)=>(handleSelectedCollege(e.target.value,"new"))}>
           {collges.map((item: any) => {
                    return (
                      <option key={item} value={item[1]}>
                        {item[0]}
                      </option>
                    );
                  })}

           </select>
          </div>
          <div className="items">
            <label htmlFor="">Dept</label>
         
            <select name="ToDept" id="" >
           {dept2.map((item: any) => {
                    return (
                      <option key={item.id} value={item.Dept_Name}>
                        {item.Dept_Name}
                      </option>
                    );
                  })}

           </select>
          </div>
          <div className="items">
            <label htmlFor="">Bureau No</label>
            <input type="text" name="ToBureau" />
          </div>
        </div>
      </div>
      <div className="addform">
        <span>Asset Form</span>
        <form action="" id="addform" >
        <div className="items">
            <label htmlFor="">Old R.No</label>
            <select name="old_r_no" id="" defaultValue={oldR} onChange={(e:any)=>{
              setOldR(e.target.value)
              HandleProductOf(e.target.value)}} >
              {
                allIdreq.map((req:any)=>{

                  return <option key={req.id} value={req.id}> Req Id- {req.id}</option>
                })
              }
             
            </select>
          </div>
         

          
          <div className="items">
            <label htmlFor="">Product name</label>
            <select name="productName" id="" value={selectedPro} onChange={(e:any)=>{
              setselectedPro(e.target.value)
             }} >
            {
                allIdreqpro.map((req:any)=>{

                  return <option key={req.Product_name} value={`${req.Product_id},${req.Product_name}`}> {req.Product_name}</option>
                })
              }
            </select>
          </div>
         
          <div className="items">
            <label htmlFor="">Pro current status</label>
            <select name="current_status"
            onChange={(e:any)=>{
              setstOfPro(e.target.value)
         }}  >
              <option value="Working"> Working </option>
              <option value="not">not</option>
            </select>
          </div>
          
        </form>
        <input
          type="button"
          value="Add more"
          className="addBtn"
          onClick={ handleAddRow}

        />
       
      </div>

      <div className="table">
       <div className="div">
       <DataGrid
          className="dataGrid"
          rows={rows}
          rowHeight={35}
          columns={columns}
          localeText={{ noRowsLabel: "No Items Added" }}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          disableDensitySelector
          disableColumnFilter
          disableColumnMenu={true}
          disableRowSelectionOnClick
          disableColumnSelector
        />
       </div>
      </div>
      <div className="description_and_Button">
       
       <div>
       <input className="savebtn"  type="submit" value="SAVE"/>
       </div>
      </div>

      <Toast
        toastmsg={notify}
        toastbg={toastbg}
        toastcolor={toastmsgcolor}
        toaststate={toaststate}
       
      />
    </form></>
  );
}

export default HandOver;
