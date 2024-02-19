import { Link } from "react-router-dom";
import "./navbar.scss";
import { useState } from "react";
import { loggedInby } from "../Datas.tsx";

function Navbar(props: any) {
  const allAdmin = () => {
    if (loggedInby.adminRole === "SuperAdmin"||loggedInby.adminRole === "vicePresident"||loggedInby.adminRole === "collegeAdmin") {
      return (
        <li>
          <Link
            to="/Admins"
            onClick={() => {
              setClick(false);
            }}
          >
            All Admins
          </Link>
        </li>
      );
    }
  };

  const [clicked, setClick] = useState(false);
  const [listmenu ,setlistmenu] = useState(false);
  const [activemenu ,setActivemenu] = useState("Home");
  const [Viewmenu ,setViewmenu] = useState(false);
  
  window.onclick = (e) => {
    if (e.target === document.querySelector(".setting")) {
      setClick(false);
      console.log(e.target);
    }
  };
  if (loggedInby == null) {
    return (
      <>
      <div className="NavContainer">
        <div className="headerimage">
          <img src="/banner.jpg" alt="" />
        </div>
      <div className="navbar">
        <a href="/" className="logo">
          <img src=" /hmu.jpg" alt="" />
          <span>HUPAS</span>
        </a>
        <div className="menuIcon" onClick={()=>setViewmenu(!Viewmenu)} >
        <i
              className={Viewmenu ? "fa fa-times" : "fa-solid fa-bars"}
            ></i>
        </div>
        <div className={Viewmenu?"menus menuActive":"menus"}>
          <div>
            <Link  className ={ activemenu=="Home"?"active": "" } onClick={()=> {
              setActivemenu('Home');
              setViewmenu(false)
            }}
              to="/">Home</Link>
          </div>
          <div>
            <Link to="About" className ={ activemenu=="About"?"active": "" } onClick={()=> {
              setActivemenu('About');
              setViewmenu(false);
            }} >About</Link>
          </div> <div>
            <Link to="contact" className ={ activemenu=="contact"?"active": "" } onClick={()=> {
              setActivemenu('contact');
              setViewmenu(false);
            }} >Contact </Link>
          </div>
          <div className="services">
            <span><span className ={ activemenu=="services"?"active": "" } onClick={()=> {
              setActivemenu('services')
              setlistmenu(!listmenu)
            }}  >Services <i className={!listmenu?"fa-solid fa-angle-right fa-rotate-90":"fa-solid fa-angle-right fa-rotate-270"}></i>{" "}
                     </span>  </span>
            <div className={listmenu?"listMenu":""}>
              <ul>
                <li>
                  <Link
                    to="/stock/handover"
                    onClick={() => {
                      setlistmenu(false);
                      setViewmenu(false);
                    }}
                  >
                     Handover
                  </Link>
                </li>

               

              </ul>
            </div>
          </div>
          <div>
            <Link to="login" className ={ activemenu=="login"?"active": "" } onClick={()=> {
              setActivemenu('login');
              setViewmenu(false);
            }} >Log-In</Link>
          </div>
          
        </div>
       
      </div>
      </div>
      
      </>
     
    );
  } 
  else if  (loggedInby.adminRole == "user") {
    return (
      <div className="navbar">
         <a href="/" className="logo">
          <img src=" /hmu.jpg" alt="" />
          <span>HUPAS</span>
        </a>
        <div className="menuIcon" onClick={()=>setViewmenu(!Viewmenu)} >
        <i
              className={Viewmenu ? "fa fa-times" : "fa-solid fa-bars"}
            ></i>
        </div>
        <div className={Viewmenu?"menus menuActive":"menus"}>
          <div>
            <Link  className ={ activemenu=="Home"?"active": "" } onClick={()=> {
              setActivemenu('Home');
              setViewmenu(false)
            }}
              to="/">Home</Link>
          </div>
          <div>
            <Link to="About" className ={ activemenu=="About"?"active": "" } onClick={()=> {
              setActivemenu('About');
              setViewmenu(false);
            }} >About</Link>
          </div>
          <div>
            <Link to="contact" className ={ activemenu=="contact"?"active": "" } onClick={()=> {
              setActivemenu('contact');
              setViewmenu(false);
            }} >Contact </Link>
          </div>
          <div className="services">
            <span><span className ={ activemenu=="services"?"active": "" } onClick={()=> {
              setActivemenu('services')
              setlistmenu(!listmenu)
            }}  >Services <i className={!listmenu?"fa-solid fa-angle-right fa-rotate-90":"fa-solid fa-angle-right fa-rotate-270"}></i>{" "}
                     </span>  </span>
            <div className={listmenu?"listMenu":""}>
              <ul>
                <li>
                  <Link
                    to="/stock/handover"
                    onClick={() => {
                      setlistmenu(false);
                      setViewmenu(false);
                    }}
                  >
                     Handover
                  </Link>
                </li>
                <li>
                  <Link
                    to="/request"
                    onClick={() => {
                      setlistmenu(false);
                      setViewmenu(false);
                    }}
                  >
                    All request
                  </Link>
                </li>

                <li>
                  <Link
                    to="/request/add"
                    onClick={() => {
                      setlistmenu(false);
                      setViewmenu(false);
                    }}
                  >
                    Add request
                  </Link>
                </li>

              </ul>
            </div>
          </div>
          <div>
          <Link
                    to="/"
                    onClick={() => {
                      localStorage.removeItem("userData");
                      setClick(false);
                      props.selogin(false);
                    }}
                  >
                    LogOut
                  </Link>
          </div>
        </div>
       
      </div>
    );
  }
  else {
    return (
      <div className="navbar">
        <div className="logo">
          <img src=" /hmu.jpg" alt="" />
          <span>HUPAS</span>
        </div>
        <div className="icons">
          <div className="user">
            <img
              src={
                loggedInby.img !== null
                  ? "http://localhost:8000/images/" + loggedInby.img
                  : " /noavatar.png"
              }
              alt=""
            />
            <span>
              {loggedInby.adminUserName ? loggedInby.adminUserName : null}
            </span>
          </div>
          <div className="setting">
            <img
              src={!clicked ? " /setting.svg" : " /circle-xmark-regular.svg"}
              alt=""
              onClick={() => {
                setClick(!clicked);
              }}
            />

            <div style={{ display: clicked ? "flex" : "none" }}>
              <h4>
                <img src=" /setting-black.svg" alt="" />
                setting
              </h4>
              <ul>
                <li>
                  <Link
                    to="/Profile"
                    onClick={() => {
                      setClick(false);
                     
                    }}
                  >
                    {" "}
                    Profile
                  </Link>
                </li>
                {allAdmin()}

                <li>
                  <Link
                    to="/changepwd"
                    onClick={() => {
                      setClick(false);
                    }}
                  >
                    Change Password
                  </Link>
                </li>

                <li>
                  <Link
                    to="/login"
                    onClick={() => {
                      localStorage.removeItem("userData");
                      setClick(false);
                      props.selogin(false);
                    }}
                  >
                    Log-out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
