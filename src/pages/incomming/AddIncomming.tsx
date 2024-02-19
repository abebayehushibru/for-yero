import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import "./AddIncomming.scss";
import Toast from "../../component/toast/Toast";
import axios from "axios";
const initialRows: GridRowsProp = [];
function AddIncomming() {
  const [cat, setCat] = useState(initialRows);
  const [Pro, setPro] = useState(initialRows);
   const [admins, setAdmins] = useState(initialRows);
  //select all category
  useEffect(() => {
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

  //select product or inventory based on  category
  const products = (selectedcat: string) => {
    axios
      .post("http://localhost:8000/AllData", {
        from: "Purchase",
        selectTo: selectedcat,
      })
      .then((response) => {
        console.log(response.data.allData);

        const newArray = response.data.allData.map((obj: any) => {
          return Object.values(obj);
        });
        setPro(newArray);
     setSingleProduct(newArray[0][0]+","+newArray[0][1])
      });
  };

  // select all recipent admins
   useEffect(() => {
    axios
      .post("http://localhost:8000/AllData", {
        from: "recipients",
      })
      .then((response) => {
        const newArray = response.data.allData.map((obj: any) => {
          return Object.values(obj);
        });
        setAdmins(newArray);
        console.log(response.data.allData);
        console.log(newArray);
      });
  }, []);
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "R.no",
      width: 60,
    },

    { field: "Inventory_Name", headerName: "Pro Name", width: 250 },

    { field: "Qt", headerName: "Qty", width: 80, editable: true },
    {
      field: "unitPrice",
      headerName: " Unit price",
      width: 150,
      editable: true,
    },

    {
      field: "UnitTotal",
      headerName: "Total Price",
      width: 150,
      valueGetter: (params: any) => {
        handleChangeOnRow(params.row.Qt, params.row.unitPrice, params.row.id);
        return params.row.Qt * params.row.unitPrice
          ? params.row.Qt * params.row.unitPrice
          : "";
      },
      renderCell: (props: any) => {
        return props.value;
      },
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

  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [toastmsgcolor, setToastmsgcolor] = useState("");
  const [toastbg, setToastbg] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [totalQuantity, settotalQuantity] = useState(0);
  const [totalPrice, settotalPrice] = useState(0);
  const [vat, setVat]:any = useState();
  const [singleProduct, setSingleProduct] = useState("");

  const handleAddRow = () => {
  
    const Inventory = singleProduct.split(",");


   if (Inventory.length!=1) {
    const newRow = {
      id: rows.length + 1,
      Inventory_Name: Inventory[0],
      Inventory_Id: Inventory[1],

      Qt: 1,
      unitPrice: "",
    };

    if (!isNewRowExist(Inventory[0])) {

     setRows([...rows, newRow]);
    } else {
      // Handle case when new row already exists
      setToastmsgcolor("black");
      setToastbg("rgb(194, 202, 47)");
      setNotify("Already Exist Item");
      setToaststate(true);
    }
   } else {
    setToastmsgcolor("black");
    setToastbg("rgb(194, 202, 47)");
    setNotify("No selected Product");
    setToaststate(true);
   }
  };
  const isNewRowExist = (Inventory_Name: string) => {
    let count = 0;
    rows.map((row: any) => {
      if (row.Inventory_Name === Inventory_Name) {
        return count++;
      }
    });
    if (count > 0) {
      return true;
    }
  };

  const handleDeleteRow = (id: number) => {
    const updatedRows = rows.filter((row: any) => row.id !== id);
    handleRowsChange(updatedRows);
  };
  const handleRowsChange = (newRows: any) => {
    // Update the IDs of the remaining rows if needed
    const updatedRows = newRows.map((row: any, index: number) => ({
      ...row,
      id: index + 1,
    }));
    setRows(updatedRows);
    Total(updatedRows);
  };
  // edit
  const handleChangeOnRow = (qt: any, up: any, id: number) => {
    const updatedRows = rows.map((row: any) =>
      row.id == id
        ? {
            ...row,
            Qt: qt,
            unitPrice: up
          }
        : row
    );
    setRows(updatedRows);
  Total(updatedRows);
  
  };

  //Handle Total Quantity and price function

  const Total = (Rowdata: any) => {
    let totalprice = 0;
    let totalqty = 0;
    Rowdata.map((item: any) => {
 totalqty = Number(item.Qt) + totalqty;
      totalprice = Number( item.Qt )*  Number(item.unitPrice) + totalprice;
      settotalPrice(totalprice);
      settotalQuantity(totalqty);
    });
  };
// save all data
const Save=(e:any)=>{
  e.preventDefault()
 
  let wrong=""
  if (e.target.recipient.value=="") {
    wrong="Please select Recipient!"
  } else  if (e.target.DonerOrg.value=="") {
    wrong="Doner Org  Name Field is empty!"
  }
  else  if (e.target.DonerName.value=="") {
    wrong="Doner Name Field is empty!"
  }
  else  if (e.target.DonerId.value=="") {
    wrong=" Doner Id Field is empty!"
  }
  else  if (rows.length==0) {
    wrong="No  Selected Product !"
  }
  else  if (vat=="" ||vat==0) {
    wrong="Please Enter Correct Vat!"
  }
  else{

    for (let index = 0; index < rows.length; index++) {
      const item= rows[index]
      if (item.Qt=="" || item.Qt==0) {
        wrong="Please Enter Correct Quatity for "+Number(index+1 )+" Product";
        break;
      }
      else if (item.unitPrice=="" || item.unitPrice==0) {
        wrong="Please Enter Correct unit Price for "+Number(index+1 )+" Product";
        break;
      }
      
    }
  
  }
  if (wrong!="") {
    setToastmsgcolor("black");
    setToastbg("rgb(194, 202, 47)");
    setNotify(wrong);
    setToaststate(true);
  }
  else {
   
      const formdata = new FormData();
      formdata.append("recipientId", e.target.recipient.value);
      formdata.append("DonerOrg", e.target.DonerOrg.value);
      formdata.append("DonerName", e.target.DonerName.value);
      formdata.append("DonerId", e.target.DonerId.value);
      formdata.append("vat", vat);
      
      formdata.append("rows", JSON.stringify(rows));
      formdata.append("from", "incomingby");
      axios
        .post("http://localhost:8000/specialAddforIncoming", formdata)
        .then((response) => {
          setToaststate(true);
          if (response.data.message === "Inserted") {
            // props.append(data+{id:props.index})
            setNotify("New incoming Items added successfuly");
            setToastbg("green");
            setToastmsgcolor("white");
          } else if (response.data.message === "Not Inserted") {
              setNotify(" please try again");

            setToastbg("red");
          }
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
          console.log("error");
        });
    
  }
}
  return (
    <>
      <form className="AddIncomming" id="allform" onSubmit={(e:any)=>{Save(e)}}>
        <span> New Incomming Items form</span>
        <div className="persons">
          <div className="person">
            <span>Recipient </span>
            <div className="items">
              <label>Select Recipient</label>
            </div>
            <div className="items">
              <select name="recipient" id="">
                {admins.map((option) => {
                  return (
                    <>
                      <option value={option[0]} >
                        { option[1]}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="person">
            <span>Donor </span>
            <div className="items">
              <label htmlFor="">Org Name</label>
              <input type="text" name="DonerOrg" />
            </div>

            <div className="items">
              <label htmlFor="">Full name</label>
              <input type="text" name="DonerName" />
            </div>
            <div className="items">
              <label htmlFor="">ID</label>
              <input type="text" name="DonerId" />
            </div>
          </div>
        </div>
        <div className="addform">
          <span>Incomming Asset Form</span>
          <div id="addform" >
            <div className="items">
              <label htmlFor="">Product category</label>
              <select
                name="catagorey"
                id=""
                onChange={(e: any) => {products(e.target.value)
                }}
              >
                {cat.map((option) => {
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
              <label htmlFor="">Product name</label>
              
              <select name="productName" id="" onChange={(e)=>{
               
                setSingleProduct(e.target.value)
              }}>
                {Pro.map((option,index) => {
                  return (
                    <>
                      <option value={option.toString()} selected={index==0?true:false}>
                        {option.length == 2 ? option[0] : option}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <p
           
           
            className="addBtn"
          
            onClick={() => handleAddRow()}
          >Add more</p>
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
              disableColumnMenu={false}
              disableRowSelectionOnClick
              disableColumnSelector
            />
          </div>
          <div className="total">
            <div className="totalDatas">
              <span>Total Quantity : {totalQuantity}</span>
              <span>Total Price : {totalPrice} Birr</span>
              <span>
                Vat % :{" "}
                <input
                  type="number"
                  min={"0"}
                  max={"100"}
                  onChange={(e: any) => {
                    setVat(e.target.value);
                  }}
                />{" "}
              </span>
              <span>
                Total Birr : {totalPrice + (vat * totalPrice) / 100} Birr
              </span>
            </div>
          </div>
        </div>
        <div className="description_and_Button">
          

          <div>
            <input className="savebtn" value={"SAVE"} type="submit" form="allform" />
          </div>
        </div>

        <Toast
          toastmsg={notify}
          toastbg={toastbg}
          toastcolor={toastmsgcolor}
          toaststate={toaststate}
         
        />
      </form>
    </>
  );
}

export default AddIncomming;
