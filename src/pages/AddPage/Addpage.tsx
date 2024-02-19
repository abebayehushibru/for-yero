import { useState, useEffect } from "react";
import "./addPage.scss";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Toast from "../../component/toast/Toast";
import axios from "axios";
import { loggedInby } from "../../component/Datas";
const initialRows: GridRowsProp = [];
type Ntf={
  text:string,
              Toastbg:string,
              color:string,
              toastState:boolean,
              disable:boolean
  
}
function Addpage() {
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify]:any = useState({});
 
  const [rows, setRows] = useState(initialRows);
  const [cat, setCat] = useState([]);
  const [campus, setCampus] = useState([[0,0]]);
  const [collges, setColleges] = useState([[0,0]]);
  const [dept, setDept] = useState([[0,0]]);
  const [selectedCollegedept, setselectedCollegedept] = useState(initialRows);
  


  // all registerd datas

  useEffect(() => {
     // all campus
    axios
      .post("http://localhost:8000/AllData", {
        from: "Campus",
      })
      .then((response) => {
        const newArray = response.data.allData.map((obj: any) => {
          return Object.values(obj);
        });
        setCampus(newArray);
      });

       // all colleges
      axios
      .post("http://localhost:8000/AllData", {
        from: "Colleges",
      })
      .then((response) => {
        const newArray = response.data.allData.map((obj: any) => {
          return Object.values(obj);
        });
        setColleges(newArray);
      });
      // all departments
      axios
      .post("http://localhost:8000/AllData", {
        from: "Departments",
      })
      .then((response) => {
        const newArray = response.data.allData.map((obj: any) => {
          return Object.values(obj);
        });
        setDept(newArray);
        console.log(response.data.allData);
        console.log(newArray);
      });
 //select all category
      axios
      .post("http://localhost:8000/AllData", {
        from: "Category",
      })
      .then((response) => {
        const newArray = response.data.allData.map((obj: any) => {
          return Object.values(obj);
        });
        setCat(newArray);
      });
  }, []);
 

  // handle change on college
  const handleSelectedCollege = (id: number) => {
    const updatedRows = dept.filter((row) => row[1] == id);
    const updatedData = updatedRows.map((row: any) => [row[3], row[2]]);
    setselectedCollegedept(updatedData);
    console.log(updatedRows);
  };
 

  const [selectedcat, setSelectedcat] = useState(cat[0]);
  const [IsFixed, setIsFixed] = useState("Fixed");
  const [status, setStatus] = useState("New");

  const [Pro, setPro] = useState([]);

  const handleAddRow = (e: any) => {
    e.preventDefault();
    if (
      e.target.productName.value != "" &&
      e.target.productName.value != null
    ) {
      const inventory = e.target.productName.value.split(",");
      const newRow = {
        id: rows.length + 1,
        Inventory_Name: inventory[1],
        Inventory_id: inventory[0],
        fide_or_not: e.target.fide_or_not.value,
        ifcondtion: e.target.ifcondtion.value,
        status:status,
        Qt: 1,
        unitPrice:status=="New"?inventory[2]:Number(inventory[2])*0.75,
      };

      if (!isNewRowExist(e.target.fide_or_not.value, inventory[1])) {
        setRows([...rows, newRow]);
      } else {
        // Handle case when new row already exists
        
        setNotify({

          text:"Already Exist Item",
          Toastbg:"yellow",
          color:"black",
          toastState:true,
          disable:false
          
        });
      }
    } else {
     
      setNotify({

        text:"No product",
        Toastbg:"yellow",
        color:"black",
        toastState:true,
        disable:false

      });
    }
  };
  const isNewRowExist = (fide_or_not: string, Inventory_Name: string) => {
    let count = 0;
    rows.map((row) => {
      if (
        row.Inventory_Name === Inventory_Name &&
        row.fide_or_not === fide_or_not
      ) {
        return count++;
      }
    });
    if (count > 0) {
      return true;
    }
  };

  const handleDeleteRow = (id: number) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };
  const handleRowsChange = (newRows: any) => {
    // Update the IDs of the remaining rows if needed
    const updatedRows = newRows.map((row: any, index: number) => ({
      ...row,
      rollno: index + 1,
    }));
    setRows(updatedRows);
  };
  const columns: GridColDef[] = [
    {
      field: "rollno",
      headerName: "R.no",
      width: 60,
      valueGetter: (params) => params.row.id,
    },

    { field: "Inventory_Name", headerName: "Pro Name", width: 150 },
    { field: "fide_or_not", headerName: " Fixed/Not", width: 100 },
    { field: "status", headerName: " Status ", width: 100 },

    { field: "Qt", headerName: "Qty", width: 80, editable: true },
    {
      field: "unitPrice",
      headerName: " Unit price",
      width: 150,
     
    },
    {
      field: "Unite",
      headerName: "Total Price",
      width: 150,
      valueGetter: (params: any) => {
        handleChangeOnRow(params.row.Qt, params.row.unitPrice, params.row.id);
        return params.row.Qt * params.row.unitPrice
          ? params.row.Qt * params.row.unitPrice
          : "";
      },
      renderCell: (props) => {
        return props.value;
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,

      renderCell: (params) => {
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

  // to set products based on catagory and fixed or not
  const products = (fixed: string, selected: string) => {
    axios.post("http://localhost:8000/AllData", {
        from: "RequestProduct",
        selectCat: selected != null ? selected : cat[0],
        IsFixed: fixed ? fixed : "Fixed",
        status:status
      })
      .then((response) => {
        if (response.data.allData != "" || response.data.allData != null) {
          setPro(response.data.allData);
        } else {
          setPro([]);
        }
      });
  };

  // to save indentity and save requested items
  const saveAll = (e: any) => {
    e.preventDefault();
  //  setDisable(true)
    let err = "";
    if (loggedInby.adminRole=="user" ) {
      if (e.target.Id.value === "") {
        err = "Id field empty";
      } else if (e.target.fullName.value === "") {
        err = "Full name field empty";
      } else if (e.target.campus.value === "") {
        err = "Campus field empty";
      }
      else if (e.target.college.value === "") {
        err = "College field empty";
      }
       else if (e.target.dept.value === "") {
        err = "Department field empty";
      }
     
       else if (e.target.email.value === "") {
        err = "Email field empty";
      }
    }
      if (err == "" && e.target.reason.value === "") {
      err = "Reason field empty";
    }
     else if (err == "" &&  !e.target.checkBox.checked) {
      err = "Check box is not checked";
    } else if (err == "" && rows.length === 0) {
      err = "No items Added";
    }

    if (err != "") {
      //setDisable(false)
      
      setNotify({

        text:err,
        Toastbg:"yellow",
        color:"black",
        toastState:true,
        disable:false
      });
     // setToaststate(true);
    } else {
      const formdata = new FormData();
     
      formdata.append("reason", e.target.reason.value);
      if (loggedInby.adminRole=="user" ) {

        formdata.append("Fname", e.target.fullName.value);
        formdata.append("duId", e.target.Id.value);
        formdata.append("email", e.target.email.value);
        formdata.append("campus", e.target.campus.value);
        formdata.append("college", e.target.college.value);
        formdata.append("dept", e.target.dept.value);
        formdata.append("from", "user");
      }

      else{
        formdata.append("Fname", loggedInby.fName);
        formdata.append("duId",loggedInby.adminId);
        formdata.append("forId",loggedInby.forId);
        formdata.append("email", loggedInby.adminEmail);
        formdata.append("from", loggedInby.adminRole);
      }
      formdata.append("rows", JSON.stringify(rows));

      axios
        .post("http://localhost:8000/specialAdd", formdata)
        .then((response) => {
         
          if (response.data.message === "Inserted") {
         
            setNotify({

              text:"Request added successfuly",
              Toastbg:"green",
              color:"white",
              toastState:true,
              disable:false
            });
           
            
           
          } else if (response.data.message === "Not Inserted") {
            
           
            setNotify({

              text:"please try  again",
              Toastbg:"red",
              color:"white",
              toastState:true,
              disable:false
              
            }
            
            
            );
           // setDisable(false)
          }

        //  setToaststate(true);
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
          console.log("error");
          setNotify({

            text:"please try  again",
            Toastbg:"red",
            color:"white",
            toastState:true,
            disable:false
            
          })
         // setDisable(false)
        });
    }

    //checkBox
  };
  // edit
  const handleChangeOnRow = (qt: any, up: any, id: number) => {
    const updatedRows = rows.map((row: any) =>
      row.id == id
        ? {
            ...row,
            Qt: qt,
            unitPrice: up,
          }
        : row
    );
    setRows(updatedRows);
  };
  const toastState=(value:boolean)=>{
    setNotify({

     ...notify,
      toastState:false,
     
    });
  }
  return (
    <>
      <div className="addpage">
        
        <div className="addPageContainer">
          <h2>Add Request</h2>

          <div className="addform">
            <form action="" id="addform" onSubmit={(e) => handleAddRow(e)}>
              <div className="items">
                <label>Product category</label>
                <select
                  name="catagorey"
                  id=""
                  value={selectedcat}
                  onChange={(e: any) => {
                    products(IsFixed, e.target.value);
                    setSelectedcat(e.target.value);
                  }}
                >
                  {cat.map((item: string) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="items">
                <label htmlFor="">Fixed/Not</label>
                <select
                  name="fide_or_not"
                  id=""
                  placeholder="No cata"
                  onChange={(e: any) => {
                    products(e.target.value, selectedcat);
                    setIsFixed(e.target.value);
                  }}
                >
                  <option value="Fixed"> Fixed</option>
                  <option value="Not">Not</option>
                </select>
              </div>
            
              <div className="items">
                <label htmlFor="">Product name</label>
                <select name="productName" id="">
                  {Pro.map((item: any) => {
                    return (
                      <option
                        key={item.id}
                        value={`${item.id},${item.Product_name},${item.unitPrice}`}
                      >
                        {item.Product_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="items">
                <label htmlFor="">Status</label>
                <select
                  name="status"
                  id=""
                  
                  onChange={(e: any) => {
                 
                    setStatus(e.target.value);
                  }}
                >
                  <option value="New"> New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
              <div className="items">
                <label htmlFor="">
                  Condtion
                  <span>
                    {" "}
                    if store inventory less than from your request the office
                    can do
                  </span>
                </label>

                <textarea name="ifcondtion" id=""></textarea>
              </div>
            </form>
            <input
              type="submit"
              value="Add more"
              className="addBtn"
              form="addform"
            />
          </div>

          <div className="allItems">
            <h2>Your Items</h2>
            <div className="table">
              <div className="div">
                <DataGrid
                  className="dataGrid "
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
          </div>
          <form
            className="basicinfo"
            id="indentity"
            onSubmit={(e: any) => {
              saveAll(e);
            }}
          >
           {loggedInby.adminRole!="user"?" ":  <h3>your identity Information </h3>}
            <div className="forminfo">
             {

              loggedInby.adminRole!="user"?"":
             <>
              <div className="items">
                <label>ID</label>
              
                <input type="text" placeholder="Id number" name="Id" value=  {loggedInby.forId}/>
              </div>
              <div className="items">
                <label>Full Name</label>
                <input type="text" placeholder="full name " name="fullName" />
              </div>
              <div className="items">
                <label>Email</label>
                <input name="email" id=""type="email"/>{" "}
              </div>
              <div className="items">
                <label>Campus</label>
                <select name="campus" id="" defaultValue={campus[0][0]}>
                  {campus.map((option:any) => {
                    return (
                      <>
                        <option value={option.length == 2 ? option[0] : option}>
                          {option.length == 2 ? option[1] : option}
                        </option>
                      </>
                    );
                  })}
                </select>
              </div>
              <div className="items">
                <label>College</label>
                <select name="college" id="" onChange={(e:any)=>handleSelectedCollege(e.target.value)} defaultValue={collges[0][0]}>
                  {collges.map((option:any) => {
                    return (
                      <>
                        <option value={option.length == 2 ? option[1] : option}>
                          {option.length == 2 ? option[0] : option}
                        </option>
                      </>
                    );
                  })}

                  
                </select>
              </div>
              
              <div className="items">
                <label>Dept</label>
                <select name="dept" id="">
                {selectedCollegedept.map((option:any) => {
                    return (
                      <>
                         {option[1]!=0?<option value={option.length == 2 ? option[1] : option}>
                          {option.length == 2 ? option[0] : option}
                        </option>:""}
                      </>
                    );
                  })}
                  <option value="0"> No Department</option>
                  </select>
              </div>
              </> }
              <div className="items">
                <label>Reason</label>
                <textarea name="reason" id=""></textarea>{" "}
              </div>
              
            </div>

            <div className="checkBox">
              <span>
                <input type="checkBox" name="checkBox" /> I accept terms and
                policy
              </span>
            </div>
          </form>
           <input
            type="submit"
            className={ notify.disable?"hide":"saveBtntn"}
            form="indentity"
            value="SEND"
           
          />
        </div>
      </div>

      <Toast
        toastmsg={notify.text}
        toastbg={notify.Toastbg}
        toastcolor={notify.color}
        toaststate={notify.toastState}
     
      />
    </>
  );
}

export default Addpage;
