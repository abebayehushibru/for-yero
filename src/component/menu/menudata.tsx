import { loggedInby } from "../Datas";
let menudatas:any = [
 
];
const adminRole=loggedInby.adminRole!==null?loggedInby.adminRole:"not"
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
          icons: "fa-solid fa-cart-shopping",
          title: "Manage Colleges",
  
          submenus: [
            {
              id: 0,
              submenuTitle: "All Colleges",
              path: "/colleges",
            },
  
            {
              submenuTitle: "All Departments",
              id: 1,
              path: "/department",
            },
            
          ],
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
              submenuTitle: "Approval Incomming",
              id: 1,
              path: "/Incomming/Approval",
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
            {
              id: 1,
              submenuTitle: "Back to store",
              path: "/Stock/backtostore",
            },
            {
              id: 2,
              submenuTitle: "HandOver",
              path: "/Stock/handover",
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
              submenuTitle: "Approval Incomming",
              id: 1,
              path: "/Incomming/Approval",
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
            {
              id: 1,
              submenuTitle: "Back to store",
              path: "/Stock/backtostore",
            },
            {
              id: 2,
              submenuTitle: "HandOver",
              path: "/Stock/handover",
            },
          ],
        },
      ],
    },
  ];

}



export default menudatas;
