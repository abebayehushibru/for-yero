
import { useState } from "react";
import "../../styles/change.scss";
import axios from "axios";
import Toast from "../../component/toast/Toast";
import {loggedInby} from "../../component/Datas.tsx";
function Changepassword() {
const [erromsg,setErrorsg] = useState("");
const [toastmsg,setToastmsg] = useState("");
const [toastbg,setToastbg] = useState("");
const [toastcolor,setToastcolor] = useState("");
const [toaststate, setToaststate]= useState(false);


const Changepasswordform = (e:any) =>{
e.preventDefault();
const oldpaswword=e.target.oldpaswword.value
const new_password=e.target.new_password.value
const confirm_password=e.target.confirm_password.value

if (oldpaswword.trim()==="") {
  setErrorsg("You forget entering Old password");
} else if (new_password.trim()==="") {
  setErrorsg("You forget entering New password");
}
else if (confirm_password.trim()==="") {
    setErrorsg("You forget entering Confrim password");
  }
  else if (confirm_password.trim()!==new_password.trim()) {
    setErrorsg(" New password Not  match");
  } else {
    axios
    .post("http://localhost:8000/ChangePwd", {
      newPwd: new_password,
      id: loggedInby.id,
      password: oldpaswword,
    })
    .then((response) => {
      console.log(response.data.message );
      if (response.data.message === "Invalid") {
        setToastmsg("Wrong password");
        setToastbg("rgb(255, 207, 207)");
        setToastcolor("red");
        setToaststate(true)
      } else if (response.data.message === "Updated") {
        setToastmsg("Password has changed successfuly");
        setToastbg("green")
        setToastcolor("white");
        setToaststate(true)
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
  
}

  }


  const onfocus=()=>{
    setErrorsg("")
  }
  return (
  <>
  <Toast toastbg={toastbg} toastmsg={toastmsg} toastcolor={toastcolor}toaststate={toaststate} />
  <div className="change-container">
        <div className="header">
          
          <h3>Change password</h3>
          <p style={{display: erromsg==""? "none":"flex"}}>{erromsg}</p>
        </div>
        <form className="form" id="loginform" method="post" onSubmit={(e)=>{
          Changepasswordform(e)
        }} >
          <div className="inputs">
            <input type="text" placeholder="Old password" name="oldpaswword"  form="loginform" onFocus={onfocus}/>
            <input type="password" placeholder="New Password" name="new_password" onFocus={onfocus} />
            <input type="password" placeholder="Confirm password" name="confirm_password" onFocus={onfocus} />
         
          </div>
          
          <input type="submit" value="Change"  className="login-btn"/>
        </form>
       </div>
       
  </>
      
 
  );
}

export default Changepassword;
