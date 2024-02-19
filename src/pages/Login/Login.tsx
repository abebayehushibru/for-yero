import { Link ,useHref} from "react-router-dom";
import { useState } from "react";

import "./login.scss";
import axios from "axios";
//temp users data
const Users=[
  {
  id:"ugr/171809/12",
  pwd:"1122",
 
  },
  {
    id:"ugr/171810/12",
    pwd:"1122"
    },
    {
      id:"ugr/171210/12",
      pwd:"1122"
      },
]
function Login(props:any) {
  const [erromsg, setErrorsg] = useState("");
  const [erromsgbg, setErrormsgbg] = useState("rgb(255, 255, 112)");
  const [erromsgcolor, setErrormsgcolor] = useState("black");
 
  const [role, setRole] = useState("Admin");
  const LoginForm = (e: any) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const password = e.target.password.value;

    if (userName.trim() === "") {
      setErrorsg(`You forget entering ${role=="Admin"?"User Name":"Id Number"}`);
    } else if (password.trim() === "") {
      setErrorsg("You forget entering password");
    } else {
     if (role=="user") {
let authorized=false;
for (let index = 0; index < Users.length; index++) {
  const element = Users[index];
  if (element.id==userName && element.pwd==password) {
      
    authorized=true;
    break;
  }
  
}

      if (authorized) {
      
        localStorage.setItem("userData",JSON.stringify([{adminRole:"user",forId:userName}]))
        console.log(localStorage.getItem("userData"));
          window.location.href="/"
      }
      else{
        setErrorsg("Wrong Id Number or Password");
        setErrormsgbg("rgb(255, 207, 207)");
        setErrormsgcolor("red");
      }
      
     }
     else{
      axios
      .post("http://localhost:8000/login", {
        username: userName,
        password: password,
      })
      .then((response) => {
        if (response.data.message === "Invalid") {
          setErrorsg("Wrong username or password");
          setErrormsgbg("rgb(255, 207, 207)");
          setErrormsgcolor("red");
        } else if (response.data.message === "valid") {
          setErrorsg("");
         console.log(useHref);
          
          localStorage.setItem("userData",JSON.stringify(response.data.results))
          window.location.href="/"
          props.selogin(false)
        } else {
          // If the request is not successful, the user is not authenticated
          setErrorsg(" please try again");
          setErrormsgbg("rgb(255, 207, 207)");
          setErrormsgcolor("red");
        }
      })
      .catch((error) => {
        // Handle the error
        console.log(error);
        console.log("error")
      });
     }
 }
 
  };


  const onfocus = () => {
    setErrorsg("");
  };


  return (
    <div className="login">
      <div className="login-container">
        <div className="logo-header">
          <div className="logo">
            <img src=" /hmu.jpg" alt="" />
            <span>HUPAS</span>
          </div>
          <h3>Sign-In</h3>
          <p
            style={{
              display: erromsg == "" ? "none" : "flex",
              backgroundColor: erromsgbg,
              color: erromsgcolor,
            }}
          >
            {erromsg}
          </p>
        </div>
        <div className="roleDiv">

          <span>Log-In as</span>
          <select name="role" id="" onChange={(e)=>{
            setRole(e.target.value)
          
          }}>
            <option value="Admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <form
          className="form"
          id="loginform"
          method="post"
          onSubmit={(e) => {
            LoginForm(e);
          }}
        >
          <div className="inputs">
            <input
              type="text"
              placeholder={role=="Admin"?"User Name":"Id Number"}
              name="username"
              form="loginform"
              onFocus={onfocus}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onFocus={onfocus}
            />
          </div>

          <input type="submit" value="Log In" className="login-btn" />
        </form>

        <div className="forget">
          <i className="fa-solid fa-lock"></i>
          <Link to={"/forget"}> Forget your password ?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
