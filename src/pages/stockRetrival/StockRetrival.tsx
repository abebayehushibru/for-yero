import { useEffect, useState } from "react";
// import "./addPage.scss";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Toast from "../../component/toast/Toast";
import axios from "axios";
import "./StockRetrival.scss";

const initialRows: GridRowsProp = [];
function StockRetrival() {
  const [toaststate, setToaststate] = useState(false);
  const [notify, setNotify] = useState("");
  const [toastmsgcolor, setToastmsgcolor] = useState("");
  const [toastbg, setToastbg] = useState("");
  const [rows, setRows] = useState(initialRows);
  const [cat, setCat] = useState(initialRows);
  const [selectedcat, setSelectedcat]:any = useState(cat[0]);
  const [IsFixed, setIsFixed] = useState("Fixed");
  const [Id, setId] = useState("ugr/171809/12");

  const [Pro, setPro] = useState([]);
  const [Admins, setAdmins] = useState([]);
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


  //select all admins
  useEffect(() => {
    axios
      .post("http://localhost:8000/AllData", {
        from: "Admins",
      })
      .then((response) => {
        const updatedData = response.data.allData.map(
          (row: any) => ({
           id:row.id,
           fName:row.fName,
           role:row.adminRole,
          })
        );
        setAdmins(updatedData);
      });
  }, []);

  const handleAddRow = (e: any) => {
    e.preventDefault();
    const inventory: any = e.target.productName.value.split(",");
    console.log(inventory.length);

    if (inventory.length != 1) {
      const newRow = {
        id: rows.length + 1,
        Inventory_Name: inventory[1],
        Inventory_id: inventory[0],
        fide_or_not: e.target.fide_or_not.value,
        current_status: e.target.current_status.value,
        Qt: 1,
      };

      if (
        !isNewRowExist(
          e.target.fide_or_not.value,
          inventory[1],
          e.target.current_status.value
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
    fide_or_not: string,
    Inventory_Name: string,
    current_status: string
  ) => {
    let count = 0;
    rows.map((row) => {
      if (
        row.Inventory_Name === Inventory_Name &&
        row.fide_or_not === fide_or_not &&
        row.current_status === current_status
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
      id: index + 1,
    }));
    setRows(updatedRows);
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "R.no",
      width: 60,
      valueGetter: (params) => {
        console.log(params.row.id);
      },
    },

    { field: "Inventory_Name", headerName: "Pro Name", width: 150 },
    { field: "fide_or_not", headerName: " Fixed/Not", width: 100 },

    { field: "Qt", headerName: "Qty", width: 80, editable: true },
    {
      field: "current_status",
      headerName: "Current status",
      width: 150,
      editable: false,
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
  const products = (fixed: string, selected: string, id: string) => {
    if (id != "") {
      axios
        .post("http://localhost:8000/AllData", {
          from: "RetriveProduct",
          selectCat: selected != null ? selected : cat[0],
          IsFixed: fixed ? fixed : "Fixed",

          Id: id,
        })
        .then((response) => {
          if (response.data.allData != "" || response.data.allData != null) {
            console.log(response.data.allData);

            setPro(response.data.allData);
          } else {
            setPro([]);
          }
        });
    }
  };
  const Save = (e: any) => {
    e.preventDefault();
    let Wrong = "";
    if (e.target.Garage.value == "") {
      Wrong = " Garage Checker   is Not selected!";
    } else if (e.target.Controller1.value == "") {
      Wrong = " First inventory Controller checker is Not selected!";
    } else if (e.target.Controller2.value == "") {
      Wrong = "Second inventory Controller checker is Not selected!";
    } else if (rows.length == 0) {
      Wrong = "Empty asset ";
    }

    if (Wrong != "") {
      setToastmsgcolor("black");
      setToastbg("rgb(194, 202, 47)");
      setNotify(Wrong);
      setToaststate(true);
    } else {
      const formdata = new FormData();
      formdata.append("userid", Id);
      formdata.append("ControllerFirstId", e.target.Controller1.value);
      formdata.append("ControllerSecondeId", e.target.Controller2.value);
      formdata.append("GaragecheckerId", e.target.Garage.value);

      formdata.append("rows", JSON.stringify(rows));
      console.log(e.target.Controller1.value);

      axios
        .post("http://localhost:8000/backtoStore", {
          userid: Id,
          ControllerFirstId: e.target.Controller1.value,
          ControllerSecondeId: e.target.Controller2.value,
          GaragecheckerId: e.target.Garage.value,
          rows: JSON.stringify(rows),
        })
        .then((response) => {
          setToaststate(true);
          if (response.data.message === "Inserted") {
            // props.append(data+{id:props.index})
            setNotify("Request added successfuly");
            setToastbg("green");
            setToastmsgcolor("white");
          } else if (response.data.message === "Not Inserted") {
            // If the request is not successful processed
            setNotify(" please try  again");

            setToastbg("red");
          }
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
          console.log("error");
        });
    }
  };
  return (
    <>
      <div className="addpage">
        <div className="addPageContainer">
          <h2>Back To Store</h2>
          <div className="addform">
            <form action="" id="addform" onSubmit={(e) => handleAddRow(e)}>
              <div className="items id">
                <label>ID</label>
                <input
                  type="text"
                  placeholder="Id number"
                  onChange={(e: any) => {
                    products(IsFixed, selectedcat, e.target.value);
                    setId(e.target.value);
                  }}
                />
              </div>
              <div className="items">
                <label htmlFor="">Product category</label>
                <select
                  name="catagorey"
                  value={selectedcat}
                  onChange={(e: any) => {
                    products(IsFixed, e.target.value, Id);
                    setSelectedcat(e.target.value);
                  }}
                >
                  {cat.map((item: any) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}{" "}
                </select>
              </div>

              <div className="items">
                <label htmlFor="">Fixed/Not</label>
                <select
                  name="fide_or_not"
                  id=""
                  placeholder="No cata"
                  onChange={(e: any) => {
                    products(e.target.value, selectedcat, Id);
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
                        value={`${item.id},${item.Product_name}`}
                      >
                        {item.Product_name}
                      </option>
                    );
                  })}{" "}
                </select>
              </div>
              <div className="items">
                <label htmlFor="">Pro current status</label>
                <select name="current_status" id="">
                  <option value="Working"> Working </option>
                  <option value="not">not</option>
                </select>
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
          <form
            action=""
            method="get"
            id="SaveForm"
            onSubmit={(e: any) => Save(e)}
          >
            <div className="persons">
              <div className="person">
                <span>Checked By</span>
                <div className="item">
                  <label htmlFor=""> Name </label>
                  <select name="Garage">
                    {Admins.map((item: any) => {
                      if (item.role=="garage") {
                        return (
                          <option
                            key={item.id}
                            value={`${item.id}`}
                          >
                            {item.fName}
                          </option>
                        );
                      }
                     
                    })}{" "}
                  </select>
                  <label htmlFor=""> On Garage </label>
                </div>
                <div className="item">
                  <label htmlFor="">1. Name </label>
                  <select name="Controller1">
                    {Admins.map((item: any) => {
                      if (item.role=="controller") {
                        return (
                          <option
                            key={item.id}
                            value={`${item.id}`}
                          >
                            {item.fName}
                          </option>
                        );
                      }
                    })}{" "}
                  </select>
                  <label htmlFor=""> Inventory Controller </label>
                </div>
                <div className="item">
                  <label htmlFor="">2. Name </label>
                  <select name="Controller2">
                    {Admins.map((item: any) => {
                      if (item.role=="controller") {
                        return (
                          <option
                            key={item.id}
                            value={`${item.id}`}
                          >
                            {item.fName}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <label htmlFor=""> Inventory Controller </label>
                </div>
              </div>
            </div>
          </form>

          <input
            className="saveBtntn"
            value={"SAVE"}
            type="Submit"
            form="SaveForm"
          />
        </div>
      </div>

      <Toast
        toastmsg={notify}
        toastbg={toastbg}
        toastcolor={toastmsgcolor}
        toaststate={toaststate}
      
      />
    </>
  );
}

export default StockRetrival;
