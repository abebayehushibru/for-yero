import Footer from "./component/footer/Footer";
import Menu from "./component/menu/Menu";
import Navbar from "./component/navbar/Navbar";
import Login from "./pages/Login/Login";
import Changepassword from "./pages/changepassword/Changepassword";
import Home from "./pages/home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Incomming from "./pages/incomming/Incomming.tsx";
import "./styles/global.scss";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Unit from "./pages/Unit/Unit";
import Category from "./pages/category/Category";
import Request from "./pages/Request/Request";
import ApprovalR from "./pages/Request/ApprovalR";
import MonthlyR from "./pages/Request/MonthlyR";
import MonthlyP from "./pages/incomming/MonthlyP.tsx";
import ApprovalP from "./pages/incomming/ApprovalP.tsx";
import Stock from "./pages/Stock/Stock";
import Addpage from "./pages/AddPage/Addpage";
import StockRetrival from "./pages/stockRetrival/StockRetrival";
import HandOver from "./pages/Handover/HandOver";
import Profile from "./pages/Profile/Profile";
import Admins from "./pages/Admins/Admins";
import Editprofile from "./pages/Editprofile/Editprofile";
import SingleRequest from "./pages/Request/SingleRequest.tsx";
import { loggedInby } from "./component/Datas.tsx";
import MainHome from "./pages/MainHome/MainHome.tsx";
import About from "./pages/About/About.tsx";
import SingleIncomming from "./pages/incomming/SingleIncomming.tsx";
import AddIncomming from "./pages/incomming/AddIncomming.tsx";
import Colleges from "./pages/Colleges/Colleges.tsx";
import Departments from "./pages/Departments/Departments.tsx";
import Representation from "./pages/Handover/Representation.tsx";
import SingleRetrived from "./pages/stockRetrival/SingleRetrived.tsx";
import Retirval from "./pages/stockRetrival/Retrival.tsx";
import ApprovalS from "./pages/stockRetrival/ApprovalS.tsx";

import AllHandover from "./pages/Handover/AllHandover.tsx";
import SingleHandover from "./pages/Handover/SingleHandover.tsx";
import Campus from "./pages/Campus/Campus.tsx";
import Forget from "./pages/Forget/Forget.tsx";
import ContactForm from "./pages/Contact/ContactForm.tsx";
import YourRequest from "./pages/Request/YourRequest.tsx";

function App() {
  //
 // localStorage.removeItem("userData");


  const allAdmin = () => {
    if (loggedInby != null && loggedInby.adminRole != "user") {
      return (
        <>
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentConatiner">
            <Outlet />
          </div>
        </>
      );
    } else {
      return  <div className="notLogged"> <Outlet /></div>
      ;
    }
  };

  const Layout = () => {
    return (
      <>
        <div className="main">
          <Navbar />

          <div className="container">{allAdmin()}</div>

          <Footer />
        </div>
      </>
    );
  };
  const superAdmin = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/Admin",
          element: <Admins />,
        },
        {
          path: "/Inventory",
          element: <Inventory />,
        },
       
        {
          path: "/catagory",
          element: <Category />,
        },
        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/incomming",
          element: <Incomming />,
        },
        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/Campus",
          element: <Campus />,
        },
        {
          path: "/department",
          element: <Departments />,
        },

        {
          path: "/Incomming/Approval",
          element: <ApprovalP />,
        },
        {
          path: "/Incomming/Monthly",
          element: <MonthlyP />,
        },
        {
          path: "Approve/Incomming/:id",
          element: <SingleIncomming />,
        },
        {
          path: "/Incomming/add",
          element: <AddIncomming />,
        },
        {
          path: "/requests",
          element: <Request />,
        },

        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/Requests/Approval",
          element: <ApprovalR />,
        },
        {
          path: "/Request/Monthly",
          element: <MonthlyR />,
        },
        {
          path: "/Stock",
          element: <Stock />,
        },
        {
          path: "/Stock/backtostore",
          element: <StockRetrival />,
        },
        {
          path: "/Stock/handover",
          element: <AllHandover />,
        },
        {
          path: "/Stock/Handover/view/:id",
          element: <SingleHandover />,
        },
        {
          path: "/Retrival/Approval/:id",
          element: <SingleRetrived />,
        },
        {
          path: "/Retrival/Approval",
          element: <ApprovalS />,
        },

        {
          path: "/handover/Reperesentation",
          element: <Representation />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "/Admins",
          element: <Admins />,
        },
        ,
        {
          path: "/retrivalrecords",
          element: <Retirval />,
        },
        {
          path: "/Retrival/Approval/:id",
          element: <SingleRetrived />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <Home />,
        },
      ],
    },
    
  ]);
  const admin = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/Inventory",
          element: <Inventory />,
        },
        {
          path: "/Unit",
          element: <Unit />,
        },
        {
          path: "/catagory",
          element: <Category />,
        },
        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/incomming",
          element: <Incomming />,
        },
        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/colleges",
          element: <Colleges />,
        },
        {
          path: "/department",
          element: <Departments />,
        },

        {
          path: "/Incomming/Approval",
          element: <ApprovalP />,
        },
        {
          path: "/Incomming/Monthly",
          element: <MonthlyP />,
        },
        {
          path: "Approve/Incomming/:id",
          element: <SingleIncomming />,
        },
        {
          path: "/Incomming/add",
          element: <AddIncomming />,
        },
        {
          path: "/requests",
          element: <Request />,
        },
        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/Requests/Approval",
          element: <ApprovalR />,
        },
        {
          path: "/Request/Monthly",
          element: <MonthlyR />,
        },

        {
          path: "/Stock",
          element: <Stock />,
        },
        {
          path: "/Retrival/Approval/:id",
          element: <SingleRetrived />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <Home />,
        },
      ],
    },
    
  ]);
  const DeptAdmin = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/requests",
          element: <Request />,
        },
        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/Requests/Approval",
          element: <ApprovalR />,
        },
        {
          path: "/Request/Monthly",
          element: <MonthlyR />,
        },
        {
          path: "/requests/my",
          element: <YourRequest />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "/request/add",
          element: <Addpage />,
        },
      ],
    },
    {
      path: "*",
      element: <MainHome />,
    },
    
  ]);
  const collegeAdmin = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/departments",
          element: <Departments />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/Admins",
          element: <Admins />,
        },

        {
          path: "/requests",
          element: <Request />,
        },
        {
          path: "/requests/my",
          element: <YourRequest />,
        },
        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/Requests/Approval",
          element: <ApprovalR />,
        },
        {
          path: "/Request/Monthly",
          element: <MonthlyR />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "/request/add",
          element: <Addpage />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
    
    
  ]);
  const vicePresident = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/colleges",
          element: <Colleges />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },
        {
          path: "/Admins",
          element: <Admins />,
        },

        {
          path: "/requests",
          element: <Request />,
        },
        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/Requests/Approval",
          element: <ApprovalR />,
        },
        {
          path: "/Request/Monthly",
          element: <MonthlyR />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
    
  ]);
  const Finance = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/requests",
          element: <Request />,
        },
        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/Requests/Approval",
          element: <ApprovalR />,
        },
        {
          path: "/Request/Monthly",
          element: <MonthlyR />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
    
  ]);
  const Recipient = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/Incomming",
          element: <Incomming />,
        },
        {
          path: "/Incomming/Approval",
          element: <ApprovalP />,
        },
        {
          path: "/Incomming/Monthly",
          element: <MonthlyP />,
        },
        {
          path: "Approve/Incomming/:id",
          element: <SingleIncomming />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
    
  ]);
  const Retrival = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        ,
        {
          path: "/retrivalrecords",
          element: <Retirval />,
        },
        {
          path: "/Retrival/Approval",
          element: <ApprovalS />,
        },
        {
          path: "/Incomming/Monthly",
          element: <MonthlyP />,
        },

        {
          path: "/Retrival/Approval/:id",
          element: <SingleRetrived />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
    
    
  ]);
  const UsedAssetAdmin:any= createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        {
          path: "/changepwd",
          element: <Changepassword />,
        },

        ,
        {
          path: "/retrivalrecords",
          element: <Retirval />,
        },

        {
          path: "/Retrival/Add",
          element: <StockRetrival />,
        },
        {
          path: "/Profile",
          element: <Profile />,
        },
        {
          path: "/Profile/edit",
          element: <Editprofile />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
   
  ]);
  const user = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },
        {
          path: "/stock/handover",
          element: <HandOver />,
        },
        {
          path: "/request/add",
          element: <Addpage />,
        },
        {
          path: "/request",
          element: <Request />,
        },
        {
          path: "Approve/request/:id",
          element: <SingleRequest />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <ContactForm />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
  ]);
  //not logged in
  let router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainHome />,
        },
        {
          path: "/stock/handover",
          element: <HandOver />,
        },
        
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/contact",
          element: <ContactForm />,
        },
        {
          path: "/forget",
          element: <Forget />,
        },
        {
          path: "*",
          element: <MainHome />,
        },
      ],
    },
    
  ]);
  //  router.middleware = [redirectIfNotLoggedIn];
  console.log(loggedInby);
  
  if (loggedInby != null) {
    switch (loggedInby.adminRole) {
      case "SuperAdmin":
        router = superAdmin;
        break;
      case "garage":
        router = Retrival;
        break;
      case "controller":
        router = Retrival;
        break;
      case "admin":
        router = admin;
        break;
      case "Recipient":
        router = Recipient;
        break;
      case "usedAssetadmin":
        router = UsedAssetAdmin;
        break;
      case "deptAdmin":
        router = DeptAdmin;
        break;
      case "collegeAdmin":
        router = collegeAdmin;
        break;
      case "vicePresident":
        router = vicePresident;
        break;
      case "user":
        router = user;
        break;
      case "Finance":
        router = Finance;
        break;
      default:
        break;
    }
  }

  return (
    <>
      <RouterProvider router={router} /> 
    </>
  );
}

export default App;
