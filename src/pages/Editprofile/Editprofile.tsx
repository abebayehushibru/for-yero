import { useState } from "react";
import "../../styles/change.scss";
import axios from "axios";
import Toast from "../../component/toast/Toast";
import { loggedInby } from "../../component/Datas";
function Editprofile() {
  const [fName ,setFname]=useState(loggedInby.fName)
  const [uName ,setuName]=useState(loggedInby.adminUserName)
  const [DuId ,setDuId]=useState(loggedInby.adminId)
  const [email ,setEmail]=useState(loggedInby.adminEmail)
  const [pwd ,setPwd]=useState("")
  
  // = e.target.fName.value;
  //   const uName = e.target.uName.value;
  //   const DuId = e.target.DuId.value;
  //   const email = e.target.email.value;
  //   const pwd ]
  const [imageFile, setImageFile] = useState(null);
  const [erromsg, setErrorsg] = useState("");
  const [toastmsg, setToastmsg] = useState("");
  const [toastbg, setToastbg] = useState("");
  const [toastcolor,setToastcolor] = useState("");
const [toaststate, setToaststate]= useState(false);


  const Changepasswordform = (e: any) => {
    e.preventDefault();
  
    if (fName.trim() === "") {
      setErrorsg("Full name field is empty");
    } else if (uName.trim() === "") {
      setErrorsg("User name field is empty");
    } else if (DuId.trim() === "") {
      setErrorsg("Haramaya university Id field is empty");
    } else if (email.trim() === "") {
      setErrorsg("Email field is empty");
    } else if (pwd.trim() === "") {
      setErrorsg("Password field is empty");
    } else {
      const formdata:any = new FormData();
      formdata.append( "fName" ,fName.trim()),
      formdata.append( "adminUserName",uName.trim())
      formdata.append( "adminId",DuId.trim())
      formdata.append( "adminEmail",email.trim())
      formdata.append( "file",imageFile)
      formdata.append( "id",loggedInby.id)
      formdata.append( "password" ,pwd.trim())
      formdata.append( "ImageHasSetted" ,imageFile==null?"Notsetted":"Setted")
      axios
    .post("http://localhost:8000/UpdateProfile", 
     formdata
    )
    .then((response) => {
      console.log(response.data.message );
      if (response.data.message === "Invalid") {
        setToastmsg("Wrong password");
        setToastbg("rgb(255, 207, 207)");
        setToastcolor("red");
        setToaststate(true)
      } else if (response.data.message === "Updated") {
        setToastmsg("Profile updated successfuly");
        setToastbg("green")
        setToastcolor("white");
        setToaststate(true)
       
        //   formdata.append("img",response.data.newData)
          
       
        // localStorage.removeItem("userData")
    location.href = "/profile";
      } else {
        // If the request is not successful, the user is not authenticated
        setErrorsg(" please try again");
       
      }
    })
    .catch((error) => {
      // Handle the error
      console.log(error);
      console.log("error")
    });
      // if (true) {
      //   setToastmsg("Password has changed successfuly");
      //   setToastbg("green");
      // } else {
      //   setToastmsg("wrong Old password");
      //   setToastbg("red");
      // }

      //for incorect password or username bg  rgb(255, 207, 207); color:red;
    }
  };

  const onfocus = () => {
    setErrorsg("");
  };
  return (
    <>
      <div className="change-container">
        <div className="header">
          <h3>Edit Profile</h3>
          <p style={{ display: erromsg == "" ? "none" : "flex" }}>{erromsg}</p>
        </div>
        <form
          className="form"
          id="loginform"
          method="post"
          onSubmit={(e) => {
            Changepasswordform(e);
          }}
        >
          <div className="inputs">
            <div className="item">
              <label htmlFor=""> Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                name="fName"
                value={fName}
                form="loginform"
                onFocus={onfocus}
                onChange={(e)=>setFname(e.target.value)}
              />
            </div>
            <div className="item">
              <label htmlFor=""> User Name</label>
              <input
                type="text"
                placeholder="UserName"
                name="uName"
                value={uName}
                form="loginform"
                onFocus={onfocus}
                onChange={(e)=>setuName(e.target.value)}
              />
            </div>
            <div className="item">
              <label htmlFor="">Du Id</label>
              <input
                type="text"
                placeholder="Du Id"
                name="DuId"
                value={DuId}
                form="loginform"
                onFocus={onfocus}
                onChange={(e)=>setDuId(e.target.value)}
              />
            </div>
            <div className="item">
              <label htmlFor=""> Email</label>{" "}
              <input
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                form="loginform"
                onFocus={onfocus}
                onChange={(e)=>setEmail(e.target.value)}
              />
                </div>
            <div className="item">
              <label htmlFor=""> Profile</label>{" "}
              
              <input
                type="file"
                placeholder="image"
                name="file"
                form="loginform"
                onFocus={onfocus}
                onChange={(e:any)=>{
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0])
                   
                  }
                }}
              />
            </div>
            <div className="item">
              <label htmlFor=""> Password</label>
              <input
                type="password"
                placeholder="Your Password"
                name="password"
                onFocus={onfocus}
                onChange={(e)=>setPwd(e.target.value)}
              />
            </div>

            <input type="submit" value="Update profile" className="login-btn" />
          </div>{" "}
        </form>
      </div>
    </>
  );
}

export default Editprofile;
