import { Link } from "react-router-dom";
import "./menu.scss";
//import {menudatas} from "./menudata";
import SetMenu from "./SetMenu";
import { loggedInby } from "../Datas";

let menudatas:any = [
 
];
const adminRole=loggedInby!==null?loggedInby.adminRole:"not"
if (adminRole=="deptAdmin") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Request",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Request",
              path: "/Requests",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Request",
              path: "/Requests/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Request",
              path: "/Request/Monthly",
            },
            {
              id: 3,
              submenuTitle: "Your requests",
              path: "/requests/my",
            },
            {
              id: 3,
              submenuTitle: "Add request",
              path: "/Request/add",
            },
          ],
        }]}
      
      ]
} 
else if (adminRole=="collegeAdmin") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Request",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Request",
              path: "/Requests",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Request",
              path: "/Requests/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Request",
              path: "/Request/Monthly",
            },
            {
              id: 3,
              submenuTitle: "Your requests",
              path: "/requests/my",
            },
            {
              id: 3,
              submenuTitle: "Add request",
              path: "/Request/add",
            },
          ],
        }, {
          id: 7,
          icons: "fas fa-university",
          title: "Manage Department",
  
          submenus: [
           
            {
              submenuTitle: "All Departments",
              id: 1,
              path: "/departments",
            },
            
          ],
        },]}
      
      ]
} 
else if (adminRole=="vicePresident") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Request",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Request",
              path: "/Requests",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Request",
              path: "/Requests/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Request",
              path: "/Request/Monthly",
            },
          ],
        }, {
          id: 7,
          icons: "fas fa-university",
          title: "Manage College",
  
          submenus: [
           
            {
              submenuTitle: "All College",
              id: 1,
              path: "/colleges",
            },
            
          ],
        },]}
      
      ]
} 
else if (adminRole=="Finance") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Request",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Request",
              path: "/Requests",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Request",
              path: "/Requests/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Request",
              path: "/Request/Monthly",
            },
          ],
        },]}
      
      ]
} 
else if (adminRole=="garage"||adminRole=="controller") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Retival",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Records",
              path: "/retrivalrecords",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Retrival",
              path: "/Retrival/Approval",
            },
           
          ],
        }]}
      
      ]
} 
else if (adminRole=="usedAssetadmin") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Retival",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Records",
              path: "/retrivalrecords",
            },
  
            {
              id: 1,
              submenuTitle: "Add Retrival",
              path: "/Retrival/Add",
            },
           
          ],
        }]}
      
      ]
} 
else if (adminRole=="Recipient") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Incomming",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Incomming",
              path: "/incomming",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Incomming",
              path: "/Incomming/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Incomming",
              path: "/Incomming/Monthly",
            },
          ],
        }]}
      
      ]
} 

 else if(adminRole=="SuperAdmin") {
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
        {
          id: 7,
          icons: "fas fa-university",
          title: "Manage Campus",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Campus",
              path: "/Campus",
            },
  
          
            
          ],
        },
      
        {
          id: 3,
          icons: "fa-brands fa-product-hunt",
          title: "Manage Inventory",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Inventory",
              path: "/Inventory",
            },
          ],
        },
       
        {
          id: 4,
          icons: "fa-solid fa-cart-shopping",
          title: "Manage Incomming",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Incomming",
              path: "/Incomming",
            },
  
           
            {
              id: 2,
              submenuTitle: "Monthly Incomming",
              path: "/Incomming/Monthly",
            },
          ],
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Request",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Request",
              path: "/Requests",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Request",
              path: "/Requests/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Request",
              path: "/Request/Monthly",
            },
          ],
        },
        {
          id: 7,
          icons: "fa-solid ",
          title: "Manage HandOver",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Records ",
              path: "/Stock/handover",
            },
  
            {
              submenuTitle: "Representation ",
              id: 1,
              path: "/handover/Reperesentation",
            },
            
          ],
        },
        {
          id: 8,
          icons: "fa-solid ",
          title: "Manage Retirval",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Records ",
              path: "/retrivalrecords",
            },
  
            {
              submenuTitle: "Approval of Retrival",
              id: 1,
              path: "/Retrival/Approval",
            },
            
          ],
        },
      ],
    },
    {
      mainTitle: "Stock",
      id: 2,
      menus: [
        {
          id: 0,
          icons: "fa-solid fa-store",
          title: "Manage Stocks",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "Stock Report",
              path: "/Stock",
            },
            
          ],
        },
      ],
    },
  ];} 
else if (adminRole=="admin")  {
 
  menudatas = [
    {
      mainTitle: "main",
      id: 0,
      menus: [
        {
          id: 0,
          icons: "",
  
          title: "Home",
          path: "/",
        },
      
        {
          id: 1,
          icons: "fa-solid fa-weight-scale",
          title: "Manage Unit",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Unit",
              path: "/unit",
            },
          ],
        },
        {
          id: 2,
          icons: "fa-solid fa-list",
          title: "Manage Category",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Category",
              path: "/catagory",
            },
          ],
        },
        {
          id: 3,
          icons: "fa-brands fa-product-hunt",
          title: "Manage Inventory",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Inventory",
              path: "/Inventory",
            },
          ],
        },
       
        {
          id: 4,
          icons: "fa-solid fa-cart-shopping",
          title: "Manage Incomming",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Incomming",
              path: "/Incomming",
            },
  
         
            {
              id: 2,
              submenuTitle: "Monthly Incomming",
              path: "/Incomming/Monthly",
            },
          ],
        },
        {
          id: 5,
          icons: "fa-solid fa-file-invoice",
  
          title: "Manage Request",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Request",
              path: "/Requests",
            },
  
            {
              id: 1,
              submenuTitle: "Approval Request",
              path: "/Requests/Approval",
            },
            {
              id: 2,
              submenuTitle: "Monthly Request",
              path: "/Request/Monthly",
            },
          ],
        },
      ],
    },
    {
      mainTitle: "Stock",
      id: 2,
      menus: [
        {
          id: 0,
          icons: "fa-solid fa-store",
          title: "Manage Stocks",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "Stock Report",
              path: "/Stock",
            },
           
            
          ],
        },
      ],
    },
  ];

}
function Menu() {
  console.log(menudatas);
  return menudatas&& <div className="menu">
  
 { menudatas.map((item:any) => {
    return (
      <>
          <div className="item" key={item.id}>
            <span className="main-title">{item.mainTitle}</span>
            <ul>
              {" "}
              {item.menus.map((menu:any) => {
                if (menu.title == "Home") {
                  return (
                    <>
                      <li key={`${item.id}home`}>
                        <Link to="/">
                          {" "}
                          <span className="title">
                            <span>
                              {" "}
                              <i className="fa-solid fa-house"></i>Home
                            </span>{" "}
                          </span>
                        </Link>
                      </li>
                    </>
                  );
                } else
                  return (
                    <>
                     <SetMenu item={item} menu={menu}></SetMenu>
                    </>
                  );
              })}
            </ul>
          </div>
          
       
      </>
    );
  })}
   </div>
}

export default Menu;
