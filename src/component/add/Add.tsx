import axios from "axios";
import { useState } from "react";
import { loggedInby } from "../../component/Datas.tsx";
import "./ad.scss";
import Toast from "../toast/Toast";
type Props = {
  slug: string;
  products: any;
  open: boolean;

  formData: (
    | {
        Title: string;
        type: string;
        Name: string;
        option?: undefined;
        min: string;
      }
    | {
        Title: string;
        type: string;
        option:  [[]];
        Name: string;
        min: string;
      }
      
  )[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
function Add(props: Props) {
  const [toastmsg, setToastmsg] = useState("");
  const [toastbg, setToastbg] = useState("");
  const [toastcolor, setToastcolor] = useState("");
  const [toaststate, setToaststate] = useState(false);

  const [erromsg, setErrorsg] = useState("");
  const [erromsgbg, setErrormsgbg] = useState("rgb(255, 255, 112)");
 const saveData = (e: any) => {
    e.preventDefault();
    setErrorsg("");
    const formdata:any = new FormData();
    switch (props.slug) {
      case "Unit" : {
        if (e.target.unitName.value.trim() == "") {
          setErrorsg("Unit Name field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.unitSymbol.value.trim() == "") {
          setErrorsg("Unit Symbol field is Empty");
          setErrormsgbg("yellow");
        } else {
          formdata.append("unitName", e.target.unitName.value);
          formdata.append("unitSymbol", e.target.unitSymbol.value);

          break;
        }
      }
      case "Category": {
        if (e.target.CategoryName.value == "") {
          setErrorsg("Category Name field is Empty");
          setErrormsgbg("yellow");
        } else {
          formdata.append("CategoryName", e.target.CategoryName.value);
        }

        break;
      }

      case "Colleges": {
        if (e.target.CollegeName.value == "") {
          setErrorsg("College Name field is Empty");
          setErrormsgbg("yellow");
        } else {
          formdata.append("campusId", loggedInby.forId);
          formdata.append("CollegeName", e.target.CollegeName.value);
        }

        break;
      }
      case "Campus": {
        if (e.target.CampusName.value == "") {
          setErrorsg("Campus Name field is Empty");
          setErrormsgbg("yellow");
        } else {
          formdata.append("CampusName", e.target.CampusName.value);
        }

        break;
      }
      case "Department": {
         if (e.target.deptName.value == "") {
          setErrorsg("Detpt Name field is Empty");
          setErrormsgbg("yellow");
        } else {
          
          
          formdata.append("collegeId", loggedInby.forId);
          formdata.append("Dept_Name", e.target.deptName.value);
       
        }

        break;
      }
      case "Inventory": {
        if (e.target.Product_catagory.value == "") {
          setErrorsg("Category Name field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.Product_unit.value == "") {
          setErrorsg("Unit Name field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.Product_name.value == "") {
          setErrorsg("Category Name field is Empty");
          setErrormsgbg("yellow");
        } 
        else if (e.target.IsFixed.value == "") {
          setErrorsg("Fixed / Not field is Empty");
          setErrormsgbg("yellow");
        }else {
          formdata.append("Product_name", e.target.Product_name.value);
          formdata.append("file", e.target.Product_img.files[0]);
          formdata.append("Product_unit", e.target.Product_unit.value);
          formdata.append("Product_catagory", e.target.Product_catagory.value);
          formdata.append("IsFixed", e.target.IsFixed.value);
         
          //IsFixed
        }

        break;
      }
      case "Purchase": {
        if (e.target.Purchase_Number.value == "") {
          setErrorsg("Purchase Number  field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.Product_catagory.value == "") {
          setErrorsg("Product Catagory field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.Product_Name.value == "") {
          setErrorsg("Product Name field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.Product_Quantity.value == "") {
          setErrorsg("Product Quantity field is Empty");
          setErrormsgbg("yellow");
        } else {
          formdata.append("Product_id", e.target.Product_Name.value);
          formdata.append("purchase_No", e.target.Purchase_Number.value);
          formdata.append("Product_Quantity", e.target.Product_Quantity.value);
         }

        break;
      }
      case "Admin": {
      const role=loggedInby.adminRole
        if (role=== "SuperAdmin"&&e.target.role.value == "") {
          setErrorsg("Role Not selected");
          setErrormsgbg("yellow");
        }
       else if (role=== "vicePresident"&&e.target.collegeId.value == "") {
        
          setErrorsg("college Not selected");
          setErrormsgbg("yellow");
       
      }
       else if (role=== "collegeAdmin"&&e.target.deptid.value == "") {
        
            setErrorsg("Department Not selected");
            setErrormsgbg("yellow");
         
        }
        else if (role=== "SuperAdmin"&&(e.target.role.value == "vicePresident"&&e.target.campus.value == "")) {
        
          setErrorsg("Campus Not selected");
          setErrormsgbg("yellow");
       
      }
        else if (e.target.Fname.value == "") {
          setErrorsg("Admin Name field is Empty");
          setErrormsgbg("yellow");
        }
        else if (e.target.Fname.value == "") {
          setErrorsg("Admin Name field is Empty");
          setErrormsgbg("yellow");
        }
       else if (e.target.duId.value == "") {
          setErrorsg("Du Id  field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.uName.value == "") {
          setErrorsg("User Name field is Empty");
          setErrormsgbg("yellow");
        } else if (e.target.email.value == "") {
          setErrorsg("Email field is Empty");
          setErrormsgbg("yellow");
        }else if (e.target.pwd.value == "") {
          setErrorsg("Password field is Empty");
          setErrormsgbg("yellow");
        }else {
         if (loggedInby.adminRole=="collegeAdmin") {
          formdata.append("forId",e.target.deptid.value );
         }
         else  if (loggedInby.adminRole=="vicePresident") {
          formdata.append("forId",e.target.collegeId.value );
         }
         else  if (loggedInby.adminRole=="SuperAdmin") {
          formdata.append("forId",e.target.campus.value );
         }
     

          formdata.append("Fname", e.target.Fname.value);
          formdata.append("duId", e.target.duId.value);
          formdata.append("role", e.target.role.value);
          formdata.append("uName", e.target.uName.value);
          formdata.append("email", e.target.email.value);
          formdata.append("pwd", e.target.pwd.value);
         
        }

        break;
      }
      case "Representation": {
        if (e.target.Fname.value == "") {
          setErrorsg("Please Enter Full Name");
          setErrormsgbg("yellow");
        }

        //duId
        else if (e.target.duId.value == "") {
          setErrorsg("Please Enter Du Id");
          setErrormsgbg("yellow");
        } else {
         const min=10000000;
         const max=99999999;
         const randomNum =Math.floor(Math.random()*(max-min+1))+min
          formdata.append("Fname", e.target.Fname.value);
          formdata.append("duId", e.target.duId.value);
          formdata.append("code", randomNum);

          console.log(e.target.Fname.value);
          
       
       
        }

        break;
      }
      default:
        break;
    }
    //console.log(erromsg.length);

    if (erromsg.length == 0) {
      console.log(formdata);
      formdata.append("from", props.slug);
      axios
        .post("http://localhost:8000/Add", formdata)
        .then((response) => {
        
          
          setToaststate(true);
          if (response.data.message === "Inserted") {
            // props.append(data+{id:props.index})
            setToastmsg(props.slug + " added successfuly");
            setToastbg("green");
            setToastcolor("white");
            props.setOpen(false);
          } else  if (response.data.message === "Not Inserted"){
            // If the request is not successful processed
            setErrorsg(" please try 4 again");

            setErrormsgbg("red");
          }
          else  if (response.data.message === "Exist"){
            // If the request is not successful processed
            setErrorsg(" already Exist Id Or Taken user Name \n please make change and try Again!");
            setErrormsgbg("red");
          }
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
          console.log("error");
        });
    }
  };

  // for purchase manupulation
  const handleCatChange = (e: any) => {
    if (props.slug === "Purchase" && e.target.name === "Product_catagory") {
      props.products(e.target.value);
    }
    if (props.slug === "Admin"&&  e.target.name=="collegeId") {
      props.products(e.target.value);
    
      
    }
    if (props.slug === "Admin"&&  e.target.name=="role") {
      const campus=document.querySelector('[name="campus"')
      const collegeId=document.querySelector('[name="collegeId"')
      const deptid=document.querySelector('[name="deptid"')
   
      if ( e.target.value=="deptAdmin") {
        campus?.setAttribute("class","displaynone")
       collegeId?.setAttribute("class","displaynone")
        deptid?.setAttribute("class","")

      }
      else if ( e.target.value=="collegeAdmin") {
        campus?.setAttribute("class","displaynone")
          collegeId?.setAttribute("class","")
           deptid?.setAttribute("class","displaynone")
         }
      else if ( e.target.value=="vicePresident") {
        campus?.setAttribute("class","")
          collegeId?.setAttribute("class","displaynone")
           deptid?.setAttribute("class","displaynone")
         }
    
      
      else{
        campus?.setAttribute("class","displaynone")
       collegeId?.setAttribute("class","displaynone")
       deptid?.setAttribute("class","displaynone")
      }
    
      
    }
  };
  return (
    <>
      <Toast
        toastbg={toastbg}
        toastmsg={toastmsg}
        toastcolor={toastcolor}
        toaststate={toaststate}
       
      />
      <div className="add" style={{ display: props.open ? "flex" : "none" }}>
        <div className="conatiner">
          <div className="add-info">
            <h2>Add {props.slug}</h2>
            <h1
              onClick={() => {
                props.setOpen(false);
              }}
            >
              X
            </h1>
          </div>
          <p
            style={{
              display: erromsg == "" ? "none" : "flex",
              backgroundColor: erromsgbg,
              padding: "3px 20px",
            }}
          >
            {erromsg}
          </p>
          <form
            id="Addform"
            method="Post"
            onSubmit={(e) => saveData(e)}
            encType="multipart/form-data"
          >
            {props.formData.map((item) => {
              let x = null;
              if (item.type == "select") {
                x = (
                  <select
                    name={item.Name}
                    id=""
                    onChange={(e: any) => {
                      handleCatChange(e);
                    }}
                  >
                  
                    {item.option?.map((option:any) => {

                     
                 
                      
                      
                      return (
                        <>
                          <option value={option.length==2?option[1]:option}>{option.length==2?option[0]:option}</option>
                        </>
                      );
                    })}
                  </select>
                );
              } else if (item.type == "textarea") {
                x = (
                  <textarea
                    name={item.Name}
                    id=""
                    onFocus={() => {
                      setErrorsg("");
                    }}
                  ></textarea>
                );
              } else {
                x = (
                  <input
                    type={item.type}
                    min={item.min}
                    name={item.Name}
                    onFocus={() => {
                      setErrorsg("");
                    }}
                  />
                );
              }
              return (
                <>
                  <div className="items">
                    <label>{item.Title}</label>

                    {x}
                  </div>
                </>
              );
            })}
          </form>
          <input type="submit" id="addBtn" form="Addform" value="Add" />
        </div>
      </div>
    </>
  );
}

export default Add;
