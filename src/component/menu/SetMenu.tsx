import { Link } from "react-router-dom";
import {useState} from "react";

function SetMenu({item,menu}) {
  const [iscliked,setClicked] =useState(false)
  return (
    <>
     <li key={`${item.id}${menu.id}`}>
                        <span className="title" style={{color:iscliked?"rgb(31, 162, 255)":""}} onClick={()=>{setClicked(!iscliked)}}>
                          <span>
                            {" "}
                            <i className={menu.icons}></i>{menu.title}
                          </span>{" "}
                          <i className={!iscliked?"fa-solid fa-angle-right fa-rotate-90":"fa-solid fa-angle-right fa-rotate-270"}></i>{" "}
                        </span>
                        <ul style={{height:!iscliked?"0px":"auto"}}>

                          {
                            menu.submenus.map((submenu)=>{
                              return <>
                              <li key={`${item.id}${menu.id}${submenu.id}`}>
                              <Link to={submenu.path}>
                                <span>{submenu.submenuTitle}</span>
                              </Link>
                            </li></>
                            })
                          }
                          
                          
                        </ul>
                      </li></>
  )
}

export default SetMenu