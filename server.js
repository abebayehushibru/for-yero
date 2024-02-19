const my_sql = require("mysql");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const { log } = require("console");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));
/*
 host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
*/

//Create a MySQL connection
const conn = my_sql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "duims",
});

const conn2 = my_sql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "duims",
});
const conn3 = my_sql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "duims",
});
// for encrypt password
async function hashPassword($password) {
  try {
    const hash = await bcrypt.hash($password, 10);
    return hash;
  } catch (err) {
    console.error(err);
    return null; // or throw your own error
  }
}
// for compare password
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    console.error(err);
    return false;
  }
}
// Define a route to handle login requests
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query the database to check if the username and password are valid
  const query = `SELECT a.id, a.adminpwd FROM admins a WHERE a.adminUserName	 = ?`;

  //const results = await connection.query(querym, [username, password]);
  conn.query(query, [username], (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.length > 0) {
      comparePassword(password, results[0].adminpwd).then((response) => {
        if (response) {
          const query = `SELECT a.id, a.adminId, a.fName, a.adminUserName, a.adminEmail, a.img, a.adminRole, a.forId FROM admins a WHERE a.id = ?`;

          //const results = await connection.query(querym, [username, password]);
          conn.query(query, [results[0].id], (err, result2) => {
            if (err) {
              return res.json("error : " + err);
            }

            // If the user is authenticated, return a success response
            else if (result2.length > 0) {
              console.log("results");
              console.log(result2);
              res.json({ message: "valid", results: result2 });
            } else {
              // If the user is not authenticated, return an error response
              res.json({ message: "Invalid" });
            }
          });
        } else {
          console.log(response);
          res.json({ message: "Invalid" });
        }
        // Use the hash directly
      });
    } else {
      res.json({ message: "Invalid" });
    }
  });
});
// Define a route to handle login requests
app.post("/forget", async (req, res) => {
  const data = [];
  const userInput = req.body.userInput;

  const operation = req.body.operation;
  let query = ``;
  console.log(userInput);
  console.log(operation);
  if (operation == "forget") {
    data.push(userInput);
    const role = req.body.with;
    console.log(role);
    if (role == "UserName") {
      query = `SELECT a.id ,a.fName, a.adminEmail FROM admins a WHERE a.adminUserName	=? `;
    } else {
      query = `SELECT a.id ,a.fName, a.adminEmail FROM admins a WHERE a.adminEmail	 = ? `;
    }
  } else {
    await hashPassword(userInput).then((hashedPassword) => {
      console.log("hasged" + hashedPassword);
      data.push(hashedPassword); // Use the hash directly
    });

    const id = req.body.id;

    query = `UPDATE admins SET adminpwd = ? WHERE id = ? `;
    data.push(id);
  }

  console.log(data);
  //const results = await connection.query(querym, [username, password]);
  conn.query(query, data, (err, results) => {
    console.log("results");
    if (err) {
      console.log(err);
      return res.json("error : " + err);
    } else if (results.length > 0) {
      res.json({ message: "valid", results: results });
    } else if (results.affectedRows > 0) {
      res.json({ message: "valid", results: results });
    } else {
      console.log("invalid");
      res.json({ message: "Invalid" });
    }
  });
});

// define rooute to  handle change password request
app.post("/ChangePwd", async (req, res) => {
  let newPwd = req.body.newPwd;
  await hashPassword(newPwd).then((hashedPassword) => {
    newPwd = hashedPassword;
  });
  const id = req.body.id;

  const password = req.body.password;

  // Query the database to check if the username and password are valid
  const query = `SELECT id,adminpwd FROM admins WHERE id = ? `;

  //const results = await connection.query(querym, [username, password]);
  conn.query(query, [id], (err, results) => {
    console.log(results.length);
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.length > 0) {
      comparePassword(password, results[0].adminpwd).then((response) => {
        if (response) {
          const query2 = `UPDATE admins SET adminpwd =?  WHERE id = ? `;
          conn.query(query2, [newPwd, id], (err, results2) => {
            console.log(results2);
            if (err) {
              return res.json("error : " + err);
            }

            // If return a success response
            else if (results2) {
              res.json({ message: "Updated" });
            } else {
              // If the error has occured , return an error response
              res.json({ message: "Not Updated" });
            }
          });
        }
      });
    } else {
      // If the user is not authenticated, return an error response
      res.json({ message: "Invalid" });
      console.log("invalid");
    }
  });
});

//, uploadTrip.single("file")

// Define the multer middleware
const uploadProfile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images/profile");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fieldSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const filetype = /jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF/;
    const mimeType = filetype.test(file.mimetype);
    const extname = filetype.test(path.extname(file.originalname));
    if (extname && mimeType) {
      return cb(null, true);
    }
    cb("Give proper file format upload");
  },
});
app.post("/UpdateProfile", uploadProfile.array("file", 1),async (req, res) => {
  let password = req.body.password;
  console.log(password);
 
  let query = `UPDATE admins SET adminId=?,fName=?,adminUserName=?,adminEmail=? WHERE id=? AND adminpwd=?`;
  
  const adminId = req.body.adminId;
  const fName = req.body.fName;
  const uName = req.body.adminUserName;
  const email = req.body.adminEmail;
  const id = req.body.id;
  const ImageHasSetted = req.body.ImageHasSetted;

  let file = null;
  

  const data = [];
  data.push(adminId);
  data.push(fName);
  data.push(uName);
  data.push(email);
  if (ImageHasSetted == "Setted") {
    file = "Profile/" + req.files[0].filename;
    data.push(file);
    query = `UPDATE admins SET adminId=?,fName=?,adminUserName=?,adminEmail=?,img=? WHERE id=? `;
  }
  data.push(Number(id));
 

  //Query the database to check if the username and password are valid

  const query3 = `SELECT id,adminpwd FROM admins WHERE id = ? `;

  //const results = await connection.query(querym, [username, password]);
  conn.query(query3, [id], (err, results) => {
    
    console.log(results[0]);
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.length > 0) {
      comparePassword(password, results[0].adminpwd).then((response) => {
        if (response) {
          conn.query(query, data, (err, results) => {
            if (err) {
              return res.json("error : " + err);
            }
        
            // If the user is authenticated, return a success response
            else if (results.affectedRows > 0) {
              console.log("up");
              res.json({ message: "Updated", newData: file });
            } else {
              console.log("down");
              // If the user is not authenticated, return an error response
              res.json({ message: "Not Updated" });
            }
          });
        }
        else {
          // If the user is not authenticated, return an error response
          res.json({ message: "Invalid" });
          console.log("invalid Pw2"+response);
        }
      });
    } 
  });
 

  console.log(data);
});

// Define the multer middleware

const uploadProductImg = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images/Produts");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  }),
  limits: { fieldSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const filetype = /jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF/;
    const mimeType = filetype.test(file.mimetype);
    const extname = filetype.test(path.extname(file.originalname));
    if (extname && mimeType) {
      return cb(null, true);
    }
    cb("Give proper file format upload");
  },
});
// const uploadDES = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {

//       cb(null, "images/destination");
//     },
//     filename: (req, file, cb) => {
//       console.log(req.body.option + "from file name");
//       cb(
//         null,
//         file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//       );
//     },
//   }),
//   limits: { fieldSize: "10000000" },
//   fileFilter: (req, file, cb) => {
//     const filetype = /jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF/;
//     const mimeType = filetype.test(file.mimetype);
//     const extname = filetype.test(path.extname(file.originalname));
//     if (extname && mimeType) {
//       return cb(null, true);
//     }
//     cb("Give proper file format upload");
//   },
// });
// app.post("/addTripData", uploadTrip.single("file"), (req, res) => {

//   let body = JSON.stringify(req.body, null, 2);

//   body = JSON.parse(body);

//   const datas = [];

//   datas[0] = body.Header;
//   datas[1] = body.english;
//   datas[2] = "trips/" + req.file.filename;
//   let query = `INSERT INTO Trip ( Header,description, img ) VALUES (?,?,?) `;

//   //Query the database to check if the username and password are valid

//   // const results = conn.query(query, datas);
//      conn.query(query,datas, (err, results) => {

//       if (err) {
//         return res.json("error : " + err)
//       }

//     // If the user is authenticated, return a success response
//     else if (results.affectedRows>0) {
//       res.json({ message: 'inserted' });
//     } else {
//       // If the user is not authenticated, return an error response
//       res.json({ message: 'not inserted' });
//     }
//     console.log(results.affectedRows);
//   })
// });
// app.post("/addDesData", uploadDES.array("file", 2), (req, res) => {
//   let body = JSON.stringify(req.body, null, 2);

//   body = JSON.parse(body);

//   const datas = [];

//   datas[0] = body.Header;
//   datas[1] = body.english;

//   datas[2] = "destination/" + req.files[0].filename;
//   datas[3] = req.body.amaharic;
//   datas[4] = req.body.gedeuffa;

//   datas[5] = "destination/" + req.files[1].filename;

//   let query = `INSERT INTO destination ( Header,english , img1,amaharic,gedeuffa,img2 ) VALUES (?,?,?,?,?,?) `;

//   //Query the database to check if the username and password are valid

//    //const results = conn.query(query, datas);
//      conn.query(query,datas, (err, results) => {

//       if (err) {
//         return res.json("error : " + err)
//       }

//     // If the user is authenticated, return a success response
//     else if (results.affectedRows>0) {
//       res.json({ message: 'inserted' });
//     } else {
//       // If the user is not authenticated, return an error response
//       res.json({ message: 'not inserted' });
//     }

//   })
// });

// app.post("/getData", (req, res) => {

//   let body = JSON.stringify(req.body, null, 2);
//   body = JSON.parse(body);
//   let query = ` select * from Trip  `;

//  if (body.from=="destination") {
//    query = ` select * from destination `;
//  }

//   //Query the database

//   conn.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
// else if (results.length>0) {

//   results.forEach(element => {
//     if (body.from=="destination") {
//       element.img1="http://localhost:5000/images/" +element.img1 ;
//       element.img2="http://localhost:5000/images/" +element.img2 ;
//     }
//   else {element.img="http://localhost:5000/images/" +element.img ;}

//   });

//   return res.json(results)

// }

//     // Handle the results of the query
//    // console.log(results);

//     // Close the database connection

//   });

// });

// define route to handle add unit request
app.post("/Add", uploadProductImg.array("file", 1), async (req, res) => {
  let data = [];
  const checkData = [];
  let queryForcheck = "";
  let query = "";
  const from = req.body.from;
  switch (from) {
    case "Unit": {
      const unitName = req.body.unitName;
      const unitSymbol = req.body.unitSymbol;
      data.push(unitName);
      data.push(unitSymbol);
      // Query the database
      query = `INSERT  INTO units (unitName, unitSymbol) VALUES (?,?)`;
      break;
    }
    case "Colleges": {
      const CollegeName = req.body.CollegeName;
      const campusId= req.body.campusId;
      data.push(CollegeName);
      data.push(campusId);
      // Query the database
      query = `INSERT  INTO 	colleges (CollegeName,campus_id) VALUES (?,?)`;
      break;
    }
    case "Campus": {
      const CampusName = req.body.CampusName;
      data.push(CampusName);

      // Query the database
      query = `INSERT  INTO 	Campus (campusName) VALUES (?)`;
      break;
    }
    case "Category": {
      const CategoryName = req.body.CategoryName;
      data.push(CategoryName);

      // Query the database
      query = `INSERT  INTO categories (CategoryName) VALUES (?)`;
      break;
    }
    case "Department": {
      const Dept_Name = req.body.Dept_Name;
      const collegeId = req.body.collegeId;
      data.push(Dept_Name);
      data.push(collegeId);

      // Query the database
      query = `INSERT  INTO departments (Dept_Name,collegeId) VALUES (?,?)`;
      break;
    }
    case "Inventory": {
      const img = req.files[0].filename
        ? "Produts/" + req.files[0].filename
        : "Produts/product.svg";
      const Product_name = req.body.Product_name;
      const Product_unit = req.body.Product_unit;
      const Product_catagory = req.body.Product_catagory;
      const IsFixed = req.body.IsFixed;
      const today = new Date();
      const year = today.getFullYear();
      const month = Number(today.getMonth()) + 1;
      const date = today.getDate();
      const todaydate = year + "-" + month + "-" + date;
      data.push(Product_name);
      data.push(Product_catagory);
      data.push(Product_unit);

      data.push(IsFixed);
      data.push(img);

      data.push(todaydate);
      //IsFixed

      // Query the database  INSERT INTO `inventory`(`id`, `Product_name`, `Category`, `Unit`, `Img`, `Date`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]')
      //INSERT INTO `purchases`(`id`, `purchase_No`, `Product_Name`, `Category`, `Date`, `status`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]')
      query = `INSERT  INTO inventory ( Product_name, Category, Unit,IsFixed, Img, Date) VALUES(?,?,?,?,?,?) `;
      break;
    }
    case "Purchase": {
      const Product_id = req.body.Product_id;
      const purchase_No = req.body.purchase_No;

      const Product_Quantity = req.body.Product_Quantity;
      const today = new Date();
      const year = today.getFullYear();
      const month = Number(today.getMonth()) + 1;
      const date = today.getDate();
      const todaydate = year + "-" + month + "-" + date;
      data.push(purchase_No);
      data.push(Product_id);

      data.push(Product_Quantity);
      data.push(todaydate);

      // Query the database  INSERT INTO `inventory`(`id`, `Product_name`, `Category`, `Unit`, `Img`, `Date`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]')
      query = `INSERT  INTO purchases ( purchase_No,Product_id, Product_Quantity, Date) VALUES(?,?,?,?)
      `;
      break;
    }
    case "Admin": {
      let pwd = req.body.pwd;
      await hashPassword(pwd).then((hashedPassword) => {
        pwd = hashedPassword; // Use the hash directly
      });

      const Fname = req.body.Fname;
      const duId = req.body.duId;
      const uName = req.body.uName;
      const email = req.body.email;

      const forId = req.body.forId ? req.body.forId : 0;
      const role = req.body.role;

      data.push(duId);
      data.push(Fname);
      data.push(uName);
      data.push(email);

      data.push(pwd);
      data.push(forId);
      data.push(role);
      console.log(data);
      queryForcheck =
        "SELECT adminUserName ,adminId From admins WHERE adminUserName=? OR adminId=? OR adminEmail=?";
      checkData.push(uName);
      checkData.push(duId);
      checkData.push(email);
      // Query the database
      query = `INSERT  INTO admins ( adminId,fName, adminUserName, adminEmail, adminpwd,forId,adminRole) VALUES(?,?,?,?,?,?,?) `;
      break;
    }
    case "Representation": {
      const Fname = req.body.Fname;
      const duId = req.body.duId;
      const code = req.body.code;

      data.push(Fname);
      data.push(duId);
      data.push(code);

      // Query the database
      query = `INSERT  INTO handoverrepresentations ( R_Name,R_Id, R_Code) VALUES(?,?,?) `;
      break;
    }

    default:
      break;
  }

  if (from == "Admin") {
    conn.query(queryForcheck, checkData, (err, results) => {
      if (err) {
        return res.json("error : " + err);
      }

      // If the user is authenticated, return a success response
      else if (results.length > 0) {
        res.json({ message: "Exist" });
      } else {
        conn2.query(query, data, (err, results) => {
          if (err) {
            return res.json("error : " + err);
          }

          // If the user is authenticated, return a success response
          else if (results.affectedRows > 0) {
            res.json({ message: "Inserted" });
            console.log(results.affectedRows);
          } else {
            // If the user is not authenticated, return an error response
            res.json({ message: "Not Inserted" });
          }
        });
      }
    });
  } else {
    conn.query(query, data, (err, results) => {
      if (err) {
        return res.json("error : " + err);
      }

      // If the user is authenticated, return a success response
      else if (results.affectedRows > 0) {
        res.json({ message: "Inserted" });
        console.log(results.affectedRows);
      } else {
        // If the user is not authenticated, return an error response
        res.json({ message: "Not Inserted" });
      }
    });
  }
});

// define route to handle add request
app.post("/specialAdd", uploadProductImg.array("file", 1), async (req, res) => {
  let data = [];
  let query = "";
  /// const from = req.body.from;
  const Fname = req.body.Fname;
  const duId = req.body.duId;
  let dept = 0;
  let campus = 0;
  let college = 0;

  const email = req.body.email; //here
  const reason = req.body.reason;
  const from = req.body.from;
  // to add items
  const rows = JSON.parse(req.body.rows);
  const today = new Date();
  const year = today.getFullYear();
  const month = Number(today.getMonth()) + 1;
  const date = today.getDate();
  const todaydate = year + "-" + month + "-" + date;
  //here
  console.log(data);
  if (from != "user") {
    const forId = req.body.forId;
    let searchquery;
    if (from == "collegeAdmin") {
      college = forId;
      searchquery = `SELECT DISTINCT campus_id FROM colleges  WHERE id=${forId} LIMIT 1; `;
      query =
        "INSERT INTO requestedby( UserDuId, FullName,Email,Dept_Id, collegeid, campus_id,collegeStatus,visePresidentStatus, Reason, Date,FromWhere,whereRrq) VALUES (?,?,?,?,?,?,'Approved','pending',?,?,?,'vice President')";
    } else if (from == "deptAdmin") {
      dept = Number(forId);
      
      searchquery =
        `SELECT DISTINCT collegeId, campus_id FROM departments join colleges on colleges.id= departments.collegeId WHERE departments.id=${forId} LIMIT 1`;
      query =
        "INSERT INTO requestedby( UserDuId, FullName,Email, Dept_Id, collegeid, campus_id,Deptstatus,collegeStatus, Reason, Date,FromWhere,whereRrq) VALUES (?,?,?,?,?,?,'Approved','pending',?,?,?,'college') ";
    }
    conn3.query(searchquery, data, (err, results) => {
      if (err) {
        return res.json("error : " + err);
      }

      // If the user is authenticated, return a success response
      else if (results.length > 0) {
        if (from == "deptAdmin") {
          college = results[0].collegeId;
        }
        campus = results[0].campus_id;
        console.log(campus);
        data.push(duId);
        data.push(Fname);
        data.push(email); 
        data.push(dept);
        data.push(college);
        data.push(campus);
        data.push(reason);
        data.push(todaydate);
        data.push(from);
      
        console.log(data);
        conn.query(query, data, (err, results) => {
          if (err) {
            return res.json("error : " + err);
          }
      
          // If the user is authenticated, return a success response
          else if (results.affectedRows > 0) {
            //INSERT INTO requests( RequestedById, Product_Name, Qty, unitPrice, Condtion) VALUES (?,?,?,?,?)
            const RequestedById = results.insertId;
      console.log(RequestedById);
           

            query2 =
              "INSERT INTO requests( RequestedById, Product_id, Qty, unitPrice, Condtion,ItemStatus) VALUES (?,?,?,?,?,?)";
            rows.forEach((row) => {
              let items = [];
              const Product_id = Number(row.Inventory_id);
              const Qt = Number(row.Qt);
              const ifcondtion = row.ifcondtion;
              const status = row.status;
              const unitPrice = Number(row.unitPrice);
      
              items.push(RequestedById);
      
              items.push(Product_id);
      
              items.push(Qt);
              items.push(unitPrice);
              items.push(ifcondtion);
              items.push(status);
              conn2.query(query2, items, (err2, results2) => {
                if (err2) {
                  return res.json("error : " + err);
                } else if (results2.affectedRows > 0) {
                  console.log(results2.insertId);
                  //Added
                }
              });
            });
      console.log("gg");
            res.json({ message: "Inserted" });
          } else {
            // If the user is not authenticated, return an error response
            res.json({ message: "Not Inserted" });
          }
        });
      }
    });
  } else {
    dept =Number( req.body.dept);
    college = Number(req.body.college);
    campus = Number(req.body.campus);


    if (college == 0) {
      query =
        "INSERT INTO requestedby( UserDuId, FullName,Email,Dept_Id, collegeid, campus_id, Reason, Date,FromWhere,visePresidentStatus,whereRrq) VALUES (?,?,?,?,?,?,?,?,?,'pending','Vise peresident')";
    } else if (dept == 0) {
      query =
        "INSERT INTO requestedby( UserDuId, FullName,Email, Dept_Id, collegeid, campus_id, Reason, Date,FromWhere,collegeStatus,whereRrq) VALUES (?,?,?,?,?,?,?,?,?,'pending','College')";
    } else {
      query =
        "INSERT INTO requestedby( UserDuId, FullName,Email, Dept_Id, collegeid, campus_id, Reason, Date,FromWhere,Deptstatus,whereRrq) VALUES (?,?,?,?,?,?,?,?,?,'pending','Dept')";
    }
    data.push(duId);
    data.push(Fname);
    data.push(email); 
    data.push(dept);
    data.push(college);
    data.push(campus);
    data.push(reason);
    data.push(todaydate);
    data.push(from);
   
    console.log(data);
    conn.query(query, data, (err, results) => {
      if (err) {
        return res.json("error : " + err);
      }
  
      // If the user is authenticated, return a success response
      else if (results.affectedRows > 0) {
        //INSERT INTO requests( RequestedById, Product_Name, Qty, unitPrice, Condtion) VALUES (?,?,?,?,?)
        const RequestedById = results.insertId;
  
        //
        query2 =
          "INSERT INTO requests( RequestedById, Product_id, Qty, unitPrice, Condtion,ItemStatus) VALUES (?,?,?,?,?,?)";
        rows.forEach((row) => {
          let items = [];
          const Product_id = Number(row.Inventory_id);
          const Qt = Number(row.Qt);
          const ifcondtion = row.ifcondtion;
          const status = row.status;
          const unitPrice = Number(row.unitPrice);
  
          items.push(RequestedById);
  
          items.push(Product_id);
  
          items.push(Qt);
          items.push(unitPrice);
          items.push(ifcondtion);
          items.push(status);
          conn2.query(query2, items, (err2, results2) => {
            if (err2) {
              return res.json("error : " + err);
            } else if (results2.affectedRows > 0) {
              console.log(results2.insertId);
              //Added
            }
          });
        });
  
        res.json({ message: "Inserted" });
      } else {
        // If the user is not authenticated, return an error response
        res.json({ message: "Not Inserted" });
      }
    });
  }

});

// define route to handle incomming
app.post("/specialAddforIncoming",
  uploadProductImg.array("file", 1),
  async (req, res) => {
    let data = [];
    let query = "";
    /// const from = req.body.from;
    const recipientId = Number(req.body.recipientId);
    const DonerOrg = req.body.DonerOrg;
    const DonerName = req.body.DonerName;
    const DonerId = req.body.DonerId;
    const vat = req.body.vat;
    // to add items
    console.log(recipientId);
    const rows = JSON.parse(req.body.rows);
    const today = new Date();
    const year = today.getFullYear();
    const month = Number(today.getMonth()) + 1;
    const date = today.getDate();
    const todaydate = year + "-" + month + "-" + date;

    conn.query(
      "SELECT fName,adminId FROM admins Where id=" + recipientId + " LIMIT 1",
      (err2, results) => {
        console.log(results[0].fName);
        if (err2) {
          return res.json("error : " + err);
        } else if (results.length > 0) {
          data.push(recipientId);
          data.push(results[0].fName);
          data.push(results[0].adminId);
          data.push(DonerOrg);
          data.push(DonerName);
          data.push(DonerId);
          data.push(vat);
          data.push(todaydate);

          query = `INSERT INTO incomingby( RecipientId, RecipientName, RecipientDuId, DonorOrg, DonorName, DonorId, Vat, Date) VALUES (?,?,?,?,?,?,?,?)`;
          conn2.query(query, data, (err, results) => {
            if (err) {
              return res.json("error : " + err);
            }

            // If the user is authenticated, return a success response
            else if (results.affectedRows > 0) {
              //INSERT INTO requests( RequestedById, Product_Name, Qty, unitPrice, Condtion) VALUES (?,?,?,?,?)
              const incomingById = results.insertId;

              let query2 =
                "INSERT INTO incomingitems ( incomingById, pro_id, Qty, unitPrice) VALUES (?,?,?,?)";
              rows.forEach((row, index) => {
                let items = [];
                const Product_id = Number(row.Inventory_Id);
                const Qt = Number(row.Qt);
                const unitPrice = Number(row.unitPrice);

                items.push(incomingById);

                items.push(Product_id);

                items.push(Qt);
                items.push(unitPrice);
                console.log(query2);
                conn3.query(query2, items, (err2, results2) => {
                  if (err2) {
                    return res.json("error : " + err);
                  } else if (results2.affectedRows > 0) {
                    if (index == rows.length - 1) {
                      res.json({ message: "Inserted" });
                    }
                    console.log(results2);
                  }
                });
              });
            } else {
              // If the user is not authenticated, return an error response
              res.json({ message: "Not Inserted" });
            }
          });
        }
      }
    );
    //INSERT INTO `requests`( `RequestedById`, `Product_Name`, `Qty`, `unitPrice`, `Condtion`) VALUES (
  }
);
//SELECT id, OldRequesterName, OldRequesteId, NewRequesteName, NewRequesteId, RepId, RepName, Date FROM handoverdby WHERE 1;
// define route to handle request and  hanover
app.post("/handoverAdd", async (req, res) => {
  let data = [];
  let query = "";
  const oldUser = req.body.oldUser;
  const newUser = req.body.newUser;
  const info = req.body.info;

  const today = new Date();
  const year = today.getFullYear();
  const month = Number(today.getMonth()) + 1;
  const date = today.getDate();
  const todaydate = year + "-" + month + "-" + date;

  data.push(oldUser.name);
  data.push(oldUser.id);
  data.push(oldUser.Address);
  data.push(oldUser.Dept);
  data.push(oldUser.Bureau);

  data.push(newUser.name);
  data.push(newUser.id);
  data.push(newUser.Address);
  data.push(newUser.Dept);
  data.push(newUser.Bureau);
  data.push(info.R_Id);
  data.push(info.R_Name);

  data.push(todaydate);

  console.log(req.body.info);
  console.log(req.body.rows);
  const rows = JSON.parse(req.body.rows);

  console.log(rows);

  query = `INSERT INTO handoverdby(OldRequesterName, OldRequesteId, OldRequesteAddress, OldRequesteDeptId, OldRequesteBureau, NewRequesteName, NewRequesteId, NewRequesteAddress, NewtRequesteDeptId, NewRequesteBureau, RepId,RepName, Date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  conn2.query(query, data, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    } else if (results.affectedRows > 0) {
      const HandOveredId = results.insertId;

      let query2 =
        "INSERT INTO handoverditems (HandOveredId,pro_id, Qty,OldReqId,status) VALUES (?,?,?,?,?)";
      rows.forEach((row, index) => {
        let items = [];
        const Product_id = Number(row.Inventory_Id);
        const Qt = Number(row.Qt);

        const old_r_no = Number(row.old_r_no);
        const status = row.current_status;
        items.push(HandOveredId);

        items.push(Product_id);

        items.push(Qt);

        items.push(old_r_no);
        items.push(status);
        console.log(items);

        conn3.query(query2, items, (err2, results2) => {
          if (err2) {
            return res.json("error : " + err);
          } else if (results2.affectedRows > 0) {
            if (index == rows.length - 1) {
              res.json({ message: "Inserted" });
            }
            console.log(results2);
          }
        });
      });
    }
  });
});

// define route to handle request and  hanover
app.post("/backtoStore", async (req, res) => {
  let data = [];
  let query = "";
  /// const from = req.body.from;
  const userid = req.body.userid;
  const Controller1Id = req.body.ControllerFirstId;
  const Controller2Id = req.body.ControllerSecondeId;
  const GaragecheckerId = req.body.GaragecheckerId;
  // to add items

  const rows = JSON.parse(req.body.rows);

  const today = new Date();
  const year = today.getFullYear();
  const month = Number(today.getMonth()) + 1;
  const date = today.getDate();
  const todaydate = year + "-" + month + "-" + date;
  conn2.query(
    "SELECT Fullname FROM requestedby Where UserDuId='" + userid + "' LIMIT 1",
    (err2, results) => {
      if (err2) {
        return res.json("error : " + err);
      } else if (results.length > 0) {
        console.log(results[0].Fullname);
        data.push(results[0].Fullname);
        data.push(userid);
           data.push(Number(GaragecheckerId));
        data.push(Number(Controller1Id));

        data.push(Number(Controller2Id));
     
        data.push(todaydate);
        console.log(data);
        // //INSERT INTO `requests`( `RequestedById`, `Product_Name`, `Qty`, `unitPrice`, `Condtion`) VALUES (
        query =
          "INSERT INTO backtostore( Fname, R_id, onGarageId, FirstControllerId, SecondControllerId, Date) VALUES (?,?,?,?,?,?)";

        conn.query(query, data, (err, results) => {
          if (err) {
            return res.json("error : " + err);
          } else if (results.affectedRows > 0) {
            const backtostorefor = results.insertId;

            //
            const query2 =
              "INSERT INTO retriveditems( backtostorefor, pro_id, Qty, CurrentStatus) VALUES (?,?,?,?)";
            rows.forEach((row) => {
              let items = [];
              const Product_id = Number(row.Inventory_id);
              const Qt = Number(row.Qt);

              const current_status = row.current_status;

              items.push(backtostorefor);

              items.push(Product_id);

              items.push(Qt);
              items.push(current_status);

              conn2.query(query2, items, (err2, results2) => {
                if (err2) {
                  return res.json("error : " + err);
                } else if (results2.affectedRows > 0) {
                  //Added
                }
              });
            });

            res.json({ message: "Inserted" });
          } else {
            // If the user is not authenticated, return an error response
            res.json({ message: "Not Inserted" });
          }
        });
      }
    }
  );
});
// define route to handle all unit request
app.post("/AllData", async (req, res) => {
  let query = "";
  const from = req.body.from;
  switch (from) {
    case "TopBox": {
      query = `SELECT (st.inQty-st.outQty)AS Totalstock ,inv.Product_name, inv.Category,inv.Img FROM stores st,inventory inv  WHERE  st.pro_id = inv.id ORDER BY Totalstock DESC LIMIT 7  `;

      break;
    }

    case "piechart": {
      query = `SELECT  c.CategoryName as name , SUM(s.inQty - s.outQty ) AS value FROM categories c JOIN inventory inv ON c.CategoryName = inv.Category JOIN stores s ON inv.id=s.pro_id  GROUP BY c.CategoryName  ORDER BY value DESC`;
      break;
    }
    case "Unit": {
      query = `SELECT  * FROM units  `;

      break;
    }
    case "Admins": {
      const role = req.body.role;
      console.log(role);
      if (role == "collegeAdmin") {
        const forId = req.body.forId;
        query = `SELECT a.id, a.adminId, a.fName, a.adminUserName, a.adminEmail, a.img, a.adminRole, a.forId,d.Dept_Name FROM admins a, departments d WHERE a.adminRole= "deptAdmin" and d.collegeId=${forId} and  d.id=a.forId ORDER BY  a.id DESC`;
      } else if (role == "vicePresident") {
        const forId = req.body.forId;
        query = `SELECT a.id, a.adminId, a.fName, a.adminUserName, a.adminEmail, a.img, a.adminRole, a.forId,c.CollegeName FROM admins a, colleges c WHERE a.adminRole= "collegeAdmin" and c.campus_id=${forId} and c.id = a.forId ORDER BY a.id DESC;`;
      } else {
        query = `SELECT a.id, a.adminId, a.fName, a.adminUserName, a.adminEmail, a.img, a.adminRole, a.forId FROM admins a WHERE a.adminRole != "collegeAdmin" AND a.adminRole != "deptAdmin" ORDER BY  a.id DESC `;
      }
      break;
    }
    case "recipients": {
      query = `SELECT id, fName FROM admins WHERE adminRole='Recipient' `;
      break;
    }

    case "Category": {
      query = `SELECT  CategoryName FROM categories ORDER BY id DESC `;
      break;
    }
    case "Colleges": {
      query = `SELECT  CollegeName,id FROM colleges ORDER BY id DESC `;
      break;
    }
    case "Departments": {
      query = `SELECT  colleges.CollegeName, departments.collegeId,departments.id ,departments.Dept_Name FROM departments,colleges   WHERE departments.collegeId=colleges.id ORDER by departments.id DESC;`;
      break;
    }
    case "Representation": {
      query = `SELECT * FROM handoverrepresentations  ORDER BY id DESC`;
      break;
    }
    //SELECT `id`, `R_Name`, `R_Id`, `R_Code` FROM `handoverrepresentations` WHERE 1
    case "Inventory": {
      query = `SELECT  * FROM  inventory ORDER BY id DESC`;
      break;
    }
    case "Campus": {
      query = `SELECT  * FROM  Campus ORDER BY id DESC`;
      break;
    }
    case "AllColleges": {
      query = `SELECT  id,CollegeName,campus_id FROM  colleges ORDER BY id DESC`;
      break;
    }
    case "Purchase": {
      const selectTo = req.body.selectTo;
      console.log(selectTo);
      query =
        `SELECT Product_name,id FROM  inventory WHERE Category= '` +
        selectTo +
        "' ORDER BY id DESC";
      break;
    }
    case "ALLPurchase": {
      query = `SELECT purchases.id,purchases.purchase_No, purchases.Product_id,  purchases.Date, purchases.status, purchases.Product_Quantity  ,inventory.Product_name,inventory.Category FROM  purchases,inventory WHERE purchases.Product_id = inventory.id`;
      break;
    }
    case "ALLPendingPurchase": {
      query = `SELECT purchases.id,purchases.purchase_No, purchases.Product_id,  purchases.Date, purchases.status, purchases.Product_Quantity  ,inventory.Product_name,inventory.Category FROM  purchases,inventory WHERE purchases.Product_id = inventory.id AND status="pending "`;
      break;
    }
    case "ALLMonthlyPurchase": {
      const to = req.body.to;
      const start = req.body.start;
      query =
        `SELECT * FROM  purchases WHERE Date >= '` +
        start +
        `' AND Date <= '` +
        to +
        `'`;
      break;
    }
    case "allIncomming": {
      const adminRole = req.body.adminRole;
      if (adminRole == "SuperAdmin" || adminRole == "admin") {
        query = `SELECT id, RecipientId, RecipientName, RecipientDuId, DonorOrg, DonorName, DonorId, Vat, RecipientStatus As status, Date FROM incomingby WHERE 1`;
      } else {
        const recipientId = Number(req.body.id);
        query = `SELECT id, RecipientId, RecipientName, RecipientDuId, DonorOrg, DonorName, DonorId, Vat, RecipientStatus As status, Date FROM incomingby WHERE RecipientId=${recipientId}`;
      }
      break;
    }

    case "Retirval": {
      const adminRole = req.body.adminRole;
      const id = req.body.id;
      if (adminRole == "SuperAdmin") {
        query = `SELECT id, Fname AS fullName, R_id,  SuperAdminSatus AS status, Date FROM backtostore WHERE FirstControllerStatus="Approved" AND SecondControllerStatus="Approved" OR onGarageStatus="finished" ORDER BY id DESC`;
      } else if (adminRole == "controller") {
        query = `SELECT id, Fname AS fullName, R_id, onGarageId, 
     CASE WHEN FirstControllerId=${id} THEN FirstControllerStatus
        WHEN SecondControllerId=${id} THEN SecondControllerStatus END AS status, 
        Date FROM backtostore WHERE ${id} IN(FirstControllerId,SecondControllerId)
         AND onGarageStatus="Approved" OR onGarageStatus="finished" ORDER BY id DESC`;
      } else if (adminRole == "garage") {
        query = `SELECT id, Fname AS fullName, R_id,  onGarageStatus AS status, Date FROM backtostore WHERE onGarageId =${id} ORDER BY id DESC `;
      } else {
        query = `SELECT id, Fname AS fullName, R_id,  onGarageStatus AS status, Date FROM backtostore WHERE 1 ORDER BY id DESC`;
      }
      break;
    }
    case "RequestProduct": {
      const selectCat = req.body.selectCat;
      const IsFixed = req.body.IsFixed;
      const status = req.body.status;
      console.log(IsFixed + " ===" + selectCat);
      if (status == "New") {
        query =
          `SELECT DISTINCT i.Product_name,i.id ,iItems.unitPrice FROM  inventory i ,incomingitems iItems WHERE i.id =iItems.pro_id AND Category = '` +
          selectCat +
          `' AND 	IsFixed = '` +
          IsFixed +
          `'`;
      } else {
        query =
          `SELECT i.Product_name,i.id ,iItems.unitPrice FROM  inventory i ,incomingitems iItems WHERE i.id =iItems.pro_id AND Category = '` +
          selectCat +
          `' AND 	IsFixed = '` +
          IsFixed +
          `'`;
      }

      break;
    }
    case "RetriveProduct": {
      const selectCat = req.body.selectCat;
      const IsFixed = req.body.IsFixed;
      const Id = req.body.Id;

      query =
        ` SELECT p.id,p.Product_name FROM inventory p,requestedby , requests r WHERE r.Product_id=p.id AND requestedby.id=r.RequestedById AND requestedby.UserDuId=  '` +
        Id +
        `' AND p.Category= '` +
        selectCat +
        `' AND p.IsFixed='` +
        IsFixed +
        `'`;

      break;
    }
    case "AllRequest": {
      const adminRole = req.body.adminRole;
      console.log(adminRole);
      if (adminRole == "deptAdmin") {
        const Dept_Id = req.body.forId;

        query = `SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.Deptstatus AS status,CASE WHEN FromWhere ="user" THEN "Dept Member" ELSE "you" END as reqfrom, t1.Dept_Id, COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById where t1.Dept_Id = ${Dept_Id}  GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;`;
      } else if (adminRole == "SuperAdmin") {
        query = `SELECT t1.id, t1.fullName, t1.Email,t1.Date,t1.superAdminStatus	 AS status,"Finance" as reqfrom ,t1.Dept_Id, COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById where t1.financeStatus = "Approved"  GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;`;
      } else if (adminRole == "Handover") {
        query = `SELECT id ,UserDuId FROM requestedby WHERE 1`;
      } else if (adminRole == "collegeAdmin") {
        const user_Id = req.body.forId;

        query = `SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.collegeStatus As status, t1.Dept_Id,CASE WHEN t1.FromWhere ="collegeAdmin"  THEN "you"  ELSE d.Dept_Name END AS reqfrom ,COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById LEFT JOIN departments d ON t1.Dept_Id = d.id  where  (t1.collegeId=${user_Id} OR d.collegeId=${user_Id}) and( t1.collegeStatus="Approved" OR  t1.collegeStatus="pending" OR  t1.collegeStatus="Finished") GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;`;
      } else if (adminRole == "vicePresident") {
        const user_Id = req.body.forId;
        query = `SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.visePresidentStatus As status,CASE WHEN t1.FromWhere ="user" THEN "Campus member" ELSE t1.FromWhere END AS reqfrom ,COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById where t1.campus_id=${user_Id} and ( t1.visePresidentStatus="Approved" OR t1.visePresidentStatus="pending") GROUP BY t1.id,t1.Date ORDER by t1.id DESC; `;
      } else if (adminRole == "Finance") {
        query = `SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.financeStatus As status, t1.Dept_Id,d.collegeId,cm.campusName as reqfrom,COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById LEFT JOIN departments d ON t1.Dept_Id = d.id LEFT JOIN colleges c ON d.collegeId= c.id LEFT JOIN campus cm ON c.campus_id = cm.id where  t1.visePresidentStatus="Approved" GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;`;
      } else if (adminRole == "admin") {
        query = `SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.AdminStatus As status, t1.Dept_Id,d.collegeId,c.campus_id ,COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty,"Boss" as reqfrom FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById LEFT JOIN departments d ON t1.Dept_Id = d.id LEFT JOIN colleges c ON d.collegeId = c.id where  t1.superAdminStatus="Approved" GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;
      `;
      } else {
        const user_Id = req.body.forId;
        console.log(user_Id);
        query = `SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.ReqStatus AS status, "You" as reqfrom ,t1.Dept_Id, COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById where t1.UserDuId = "${user_Id}" GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;`;
      }
      //SELECT t1.id, t1.fullName,t1.Email, t1.Date,t1.AdminStatus As status, t1.Dept_Id,d.collegeId,c.campus_id ,COUNT(t2.id) AS totalCount,SUM(t2.Qty) AS totalQty FROM requestedby t1 LEFT JOIN requests t2 ON t1.id = t2.RequestedById LEFT JOIN departments d ON t1.Dept_Id = d.id LEFT JOIN colleges c ON d.collegeId = c.id where t1.superAdminStatus = "Approved" OR t1.Deptstatus = "Finished" And d.collegeId=2 GROUP BY t1.id, t1.fullName, t1.Dept_Id ORDER by t1.id DESC;
      break;
    }
    case "AllStock": {
      query = `SELECT  st.id,st.inQty, st.outQty , pro.Product_name ,pro.Category,pro.Unit FROM stores st, inventory pro  WHERE st.pro_id = pro.id;`;
      break;
    }
    case "requests": {
      query = `SELECT req.id,req.RequestedById,req.Product_id,p.Product_name FROM requests req,inventory p Where req.Product_id=p.id;`;
      break;
    }

    case "handover": {
      query = `SELECT id, OldRequesterName, OldRequesteId, NewRequesteName, NewRequesteId, RepId, RepName, Date FROM handoverdby WHERE 1 ORDER BY id DESC;`;
      break;
    }

    default:
      break;
  }
  // Query the database

  //const results = await connection.query(querym, [username, password]);
  conn.query(query, (err, results) => {
    console.log(results);
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.length > 0) {
      res.json({ allData: results });
    } else {
      // If the user is not authenticated, return an error response
      res.json({ allData: [] });
    }
  });
});
//get data with id
app.post("/IdData/:id", async (req, res) => {
  //let datas
  let data = [];

  //get data id

  const id = req.params.id;
  const adminRole = req.body.adminRole;
  console.log(req.body);
  let query = "";

  if (adminRole == "deptAdmin") {
    query = `SELECT r.fullName,r.Email,  r.Date , r.Deptstatus	 As status, r.UserDuId,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name,CASE WHEN r.FromWhere ="deptAdmin" THEN "you" ELSE " " END as reqfrom,	r.whereRrq ,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;
  } else if (adminRole == "SuperAdmin") {
    query = `SELECT r.fullName, r.Email, r.Date, r.superAdminStatus	 As status, r.UserDuId,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name,r.FromWhere as reqfrom,r.whereRrq ,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;
  } else if (adminRole == "collegeAdmin") {
    query = `SELECT r.fullName,r.Email,  r.Date, r.collegeStatus	 As status, r.UserDuId,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name,CASE WHEN r.FromWhere ="collegeAdmin" THEN "you" ELSE "" END as reqfrom ,r.whereRrq ,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;
  } else if (adminRole == "vicePresident") {
    query = `SELECT r.fullName, r.Email, r.Date, r.visePresidentStatus As status, r.UserDuId, r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name,CASE WHEN r.collegeid =0 THEN "you college" ELSE c.CollegeName END as reqfrom ,r.whereRrq ,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id = 89 and r.Dept_Id=d.id and c.id=r.collegeid;` 
  } else if (adminRole == "admin") {
  } else if (adminRole == "Finance") {
    query = `SELECT r.fullName, r.Email, r.Date, r.financeStatus	 As status, r.UserDuId,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name," " as reqfrom,r.whereRrq,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;
  } else if (adminRole == "admin") {
    query = `SELECT r.fullName, r.Email, r.Date, r.AdminStatus	 As status, r.UserDuId,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name ," " as reqfrom ,r.whereRrq,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;
  } else {
    query = `SELECT r.fullName,r.Email,  r.Date, r.ReqStatus	 As status,r.whereRrq ,r.UserDuId,   r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name,"you" as reqfrom ,r.whereRrq,r.ReqStatus FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;
  }

  // let query = `SELECT r.fullName,  r.Date, r.status, r.UserDuId, r.status,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;

  // Query the database

  conn.query(query, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }
    if (results.length > 0) {
      console.log(results);
      data[0] = results;
    }
  });

  let query2 = `SELECT req.id,req.Product_id,req.Qty,req.unitPrice,req.ItemStatus,pro.Product_name ,(st.inQty-st.outQty) AS current_stock FROM requests req,inventory pro,stores st WHERE req.RequestedById = ${id} AND req.Product_id=pro.id AND req.Product_id=st.pro_id `;

  // Query the database

  conn.query(query2, (err, results2) => {
    if (err) {
      return res.json("error : " + err);
    } else if (results2.length > 0) {
      data[1] = results2;
      res.json({ allData: data });
    }
  });
});

//get data with id
app.post("/getIncommingData/:id", async (req, res) => {
  //let datas
  let data = [];

  //get data id

  const id = req.params.id;
  const adminRole = req.body.adminRole;

  let query = "";
  if (adminRole == "Recipient") {
    const recipientId = Number(req.body.id);
    query = `SELECT  RecipientId, RecipientName, RecipientDuId, DonorOrg, DonorName, DonorId, Vat, RecipientStatus As status, Date FROM incomingby WHERE RecipientId=${recipientId} And id =${id}`;
  } else {
    query = `SELECT  RecipientId, RecipientName, RecipientDuId, DonorOrg, DonorName, DonorId, Vat, Date FROM incomingby WHERE   id =${id}`;
  }

  // let query = `SELECT r.fullName,  r.Date, r.status, r.UserDuId, r.status,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;

  // Query the database

  conn.query(query, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }
    if (results.length > 0) {
      data[0] = results;
      let query2 = `SELECT DISTINCT itms.id,itms.pro_id,p.Product_name,itms.Qty,itms.unitPrice FROM incomingitems itms,inventory p,incomingby inby WHERE itms.incomingById = ${id} AND itms.pro_id=p.id  `;

      // Query the database

      conn.query(query2, (err, results2) => {
        if (err) {
          return res.json("error : " + err);
        } else if (results2.length > 0) {
          data[1] = results2;
          console.log(data);
          res.json({ allData: data });
        }
      });
    }
  });
});

//get data with id
app.post("/getHandoverData/:id", async (req, res) => {
  //let datas
  let data = [];

  //get data id

  const id = req.params.id;

  let query = `SELECT * FROM handoverdby WHERE id=${id}`;

  // let query = `SELECT r.fullName,  r.Date, r.status, r.UserDuId, r.status,  r.Dept_Id, r.reason, c.CollegeName ,d.Dept_Name FROM requestedby r , colleges c, departments d WHERE r.id =${id} and r.Dept_Id=d.id and c.id=d.collegeId`;

  // Query the database

  conn.query(query, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }
    if (results.length > 0) {
      data.push (results[0]);
      let query2 = `SELECT itms.id,itms.pro_id,p.Product_name,itms.Qty,itms.OldReqId,itms.status FROM handoverditems itms,inventory p  WHERE itms.HandOveredId=${id} AND itms.pro_id=p.id  `;
      console.log(results[0]);
      // Query the database

      conn2.query(query2, (err, results2) => {
        console.log(results2+"helo");
        if (err) {
          return res.json("error : " + err);
        } else if (results2.length > 0) {
          data.push (results2);
          res.json({ allData: data });
        }
      });
    }
  });

  console.log(data);
});

//get data with id of backtostore
app.get("/backTostoreIdData/:id", async (req, res) => {
  //let datas
  let data = [];

  //get data id

  const id = req.params.id;
  // const adminRole = req.body.adminRole;

  let query = `SELECT id, Fname, R_id, onGarageId, onGarageStatus, FirstControllerId, FirstControllerStatus, SecondControllerId, SecondControllerStatus, SuperAdminSatus, Date FROM backtostore WHERE id=${id}`;

  conn.query(query, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }
    if (results.length > 0) {
      data[0] = results[0];

      const admins = [
        results[0].onGarageId,
        results[0].FirstControllerId,
        results[0].SecondControllerId,
        1,
      ];
      const adminsData = [];
      admins.forEach((id) => {
        const qu = `SELECT adminId,fName FROM admins WHERE id=${id}`;
        conn2.query(qu, (err, result) => {
          if (result.length > 0) {
            console.log(result);
            adminsData.push(result[0]);
            data[0] = { ...data[0], adminsData: adminsData };
          }
        });
      });
      let query2 = `SELECT r.id,r.Qty,r.CurrentStatus,p.Product_name FROM retriveditems r, inventory p WHERE p.id=r.pro_id And r.backtostorefor=${id}`;
      // Query the database
      
      conn2.query(query2, (err, results2) => {
        if (err) {
          return res.json("error : " + err);
        } else if (results2.length > 0) {
          data[1] = results2;
          console.log(data);
          console.log("hello2");``
          console.log(data[1]);
          res.json({ allData: data });
          
        }
        
      });
    }
  });
});
// get report data
app.post("/ReportTotaldata", async (req, res) => {
  const from = req.body.from;

  // to count all or sum of requested data table data
  const query = `SELECT COUNT(id) as total FROM ${from}`;
  conn.query(query, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.length > 0) {
      res.json({ allData: results[0].total });
    } else {
      // If the user is not authenticated, return an error response
      console.log("results");
      res.json({ allData: 0 });
    }
  });
});
app.post("/ReportdataInMONTH", async (req, res) => {
  let query = "";
  let data = [];
  const from = req.body.from;

  let monthData = [0, 0, 0, 0, 0];

  // to select data for first 6 month
  const today = new Date();
  let year = Number(today.getFullYear());
  let currentMonth = Number(today.getMonth() + 1);

  // all months we have are current month- 5
  monthData.map((element, index) => {
    let toyear = year;

    let toMonth = currentMonth + 1;
    if (currentMonth < 1) {
      year = year - 1;
      currentMonth = 12;
      toMonth = 1;
    }
    let forMonth = currentMonth;
    if (currentMonth < 10) {
      forMonth = "0" + currentMonth;
    }

    if (toMonth > 12) {
      toyear = year + 1;
      toMonth = 1;
    }
    if (toMonth < 10) {
      toMonth = "0" + toMonth;
    }

    query = `SELECT COUNT(id) AS Dt FROM ${from} where  Date >"${year}-${forMonth}-0" AND Date < "${toyear}-${toMonth}-0";`;
    currentMonth = currentMonth - 1;
    // const element = array[index];
    conn2.query(query, (err, results) => {
      if (results.length > 0) {
        monthData[index] = {
          Dt: results[0].Dt,
        };
        console.log(
          index + " " + from + " : " + results[0].Dt + " : for " + forMonth
        );
        if (index == 4) {
          res.json({ allData: monthData.reverse() });
        }
      } else {
        monthData[index] = {
          Dt: 0,
        };
      }
    });
  });
});

//  report store data for first five month
app.post("/ReportStoredata", async (req, res) => {
  let query = "";
  let data = [];

  let monthData = [0, 0, 0, 0, 0];

  // to select data for first 6 month
  const today = new Date();
  let year = Number(today.getFullYear());
  let currentMonth = Number(today.getMonth());

  // all months we have are current month- 5
  monthData.forEach((element, index) => {
    let monthrequest = 0;
    let monthpurchase = 0;
    currentMonth = Number(currentMonth) - Number(index);
    if (currentMonth < 0) {
      year = year - 1;
      currentMonth = 11;
    }
    if (currentMonth < 10) {
      currentMonth = "0" + currentMonth;
    }
    query = `SELECT SUM(req.Qty) As Dt FROM requestedby rby,requests req WHERE req.RequestedById=rby.id AND rby.Date <"${year}-${
      currentMonth + 1
    }-00" AND rby.status="Approved";`;
    conn.query(query, (err, results) => {
      if (err) {
        return res.json("error : " + err);
      } else if (results.length > 0) {
        monthrequest = results[0].Dt;
      } else {
        monthrequest = 0;
      }
    });

    query = `SELECT SUM(Product_Quantity) AS Dt FROM purchases WHERE Date <"${year}-${
      currentMonth + 1
    }-00" AND status="Approved";`;
    conn.query(query, (err, results) => {
      if (err) {
        return res.json("error : " + err);
      } else if (results.length > 0) {
        monthpurchase = results[0].Dt;
      } else {
        monthpurchase = 10;
      }
      monthData[index] = {
        Dt: monthpurchase - monthrequest,
      };
      if (index + 1 == monthData.length) {
        res.json({ allData: monthData.reverse() });
      }
    });
  });
});
// delete items from database
app.post("/Delete", async (req, res) => {
  let data = [];
  let query = "";
  const from = req.body.from;
  switch (from) {
    case "Unit": {
      const unitName = req.body.unitName;
      const unitSymbol = req.body.unitSymbol;
      data.push(unitName);
      data.push(unitSymbol);
      // Query the database
      query = `DELETE  FROM units WHERE unitName=? AND  unitSymbol =?`;
      break;
    }
    case "Category": {
      const CategoryName = req.body.CategoryName;
      data.push(CategoryName);

      // Query the database
      query = `DELETE  FROM categories WHERE CategoryName= ?`;
      break;
    }
    case "Colleges": {
      const id = req.body.id;
      data.push(id);

      // Query the database
      query = `DELETE  FROM colleges WHERE id= ?`;
      break;
    }
    case "Departments": {
      const id = req.body.id;
      data.push(id);

      // Query the database
      query = `DELETE  FROM departments WHERE id= ?`;
      break;
    }
    case "Inventory": {
      const id = req.body.id;
      data.push(id);

      // Query the database  INSERT INTO `inventory`(`id`, `Product_name`, `Category`, `Unit`, `Img`, `Date`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]')

      query = `DELETE  FROM inventory WHERE id= ?`;
      break;
    }
    case "Admins": {
      const id = req.body.id;
      data.push(id);

      // Query the database  INSERT INTO `inventory`(`id`, `Product_name`, `Category`, `Unit`, `Img`, `Date`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]')

      query = `DELETE  FROM admins WHERE id= ?`;
      break;
    }

    case "Representation": {
      const id = req.body.id;
      data.push(id);

      // Query the database
      query = `DELETE  FROM handoverrepresentations WHERE id= ?`;
      break;
    }
    case "Purchase": {
      const id = req.body.id;
      data.push(id);

      // Query the database  INSERT INTO `inventory`(`id`, `Product_name`, `Category`, `Unit`, `Img`, `Date`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]')

      query = `DELETE  FROM purchases WHERE id= ?`;
      break;
    }
    case "requestedby": {
      const id = req.body.id;
      console.log(id);
      data.push(id);

      query = `DELETE  FROM requestedby WHERE id= ?`;
      HandleRequestDelete(id);
      break;
    }

    default:
      break;
  }

  conn.query(query, data, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.affectedRows > 0) {
      res.json({ message: "Deleted" });
    } else {
      // If the user is not authenticated, return an error response
      res.json({ message: "error" });
    }
  });
});

app.post("/representationAuthintication", async (req, res) => {
  const userId = req.body.userId;
  const Code = req.body.code;
  const query = `SELECT id ,  R_Name ,  R_Id FROM handoverrepresentations WHERE R_Id=? AND R_Code=?`;
  //const results = await connection.query(querym, [username, password]);
  conn.query(query, [userId, Code], (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.length > 0) {
      res.json({ message: "valid", info: results[0] });
    } else {
      // If the user is not authenticated, return an error response
      res.json({ message: "Invalid" });
    }
  });
});

// manipulate request table with function when request deleted
function HandleRequestDelete(requestedbyid) {
  let query = `DELETE FROM requests WHERE RequestedById=${requestedbyid}`;

  conn.query(query, (err, results) => {
    if (err) {
      console.log("error : " + err);
    }
  });
}

//to Update items on
app.post("/Approve", async (req, res) => {
  let data = [];
  let query = "";
  const from = req.body.from;
  const adminRole = req.body.adminRole;
  const id = req.body.id;
  data.push(id);
  if (from == "incomingby" && adminRole == "Recipient") {
    console.log(data);
    query = `UPDATE ${from}  SET 	RecipientStatus="Approved" WHERE id= ?`;
  } else if (from == "requestedby") {
    const adminRole = req.body.adminRole;
    const operation = req.body.operation;
    console.log(req.body.adminRole);

    if (operation == "Approve") {
      if (adminRole == "deptAdmin") {
        query = `UPDATE ${from}  SET Deptstatus="Approved" ,collegeStatus="pending",whereRrq="college" WHERE id= ?`;
      } else if (adminRole == "collegeAdmin") {
        query = `UPDATE ${from}  SET collegeStatus="Approved" ,visePresidentStatus="pending",whereRrq ="vice President" WHERE id= ?`;
      } else if (adminRole == "vicePresident") {
        query = `UPDATE ${from}  SET visePresidentStatus="Approved" ,	financeStatus="pending" ,whereRrq="Finance" WHERE id= ?`;
      } else if (adminRole == "Finance") {
        query = `UPDATE ${from}  SET financeStatus="Approved",superAdminStatus="pending",whereRrq="inventory manager" WHERE id= ?`;
      } else if (adminRole == "SuperAdmin") {
        query = `UPDATE ${from}  SET superAdminStatus="Approved" ,AdminStatus="pending",whereRrq="You Can" WHERE id= ?`;
      } else {
        query = `UPDATE ${from}  SET AdminStatus="Approved", ReqStatus="Finished",whereRrq="Done" WHERE id= ?`;
      }
    } else {
      if (adminRole == "deptAdmin") {
        query = `UPDATE ${from}  SET Deptstatus="Finished", ReqStatus="Finished"  WHERE id= ?`;
      } else if (adminRole == "collegeAdmin") {
        query = `UPDATE ${from}  SET collegeStatus="Finished", ReqStatus="Finished" WHERE id= ?`;
      }
    }
  } else if (from == "Backtostore") {
    const adminRole = req.body.adminRole;
    const adminId = req.body.adminId;

    if (adminRole == "garage") {
      query = `UPDATE ${from}  SET onGarageStatus="Approved" ,FirstControllerStatus="pending" ,SecondControllerStatus="pending" WHERE onGarageId=${adminId} AND id= ?`;
    } else if (adminRole == "controller") {
      query = `UPDATE backtostore SET   FirstControllerStatus= CASE WHEN FirstControllerId=${adminId} THEN "Approved"  ELSE FirstControllerStatus END,
      SecondControllerStatus= CASE WHEN SecondControllerId=${adminId}  THEN "Approved" ELSE SecondControllerStatus END,
      SuperAdminSatus =CASE WHEN FirstControllerId=${adminId}   AND SecondControllerStatus="Approved" THEN "pending"
      WHEN SecondControllerId=${adminId}   AND FirstControllerStatus="Approved" THEN "pending" END
      WHERE id=?`;
    } else {
      query = `UPDATE ${from}  SET onGarageStatus="Finished",FirstControllerStatus="Finished", SecondControllerStatus="Finished",SuperAdminSatus="Finished" WHERE id= ?`;
    }
  } else {
    query = `UPDATE ${from}  SET status="Approved"  WHERE id= ?`;
  }

  conn.query(query, data, (err, results) => {
    if (err) {
      return res.json("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.affectedRows > 0) {
      if (from == "requestedby" && req.body.adminRole != "admin") {
        res.json({ message: "Approved" });
      } else if (from == "Backtostore") {
        if (req.body.adminRole == "SuperAdmin") {
          const approveProducts = req.body.approveProducts;
          approveProducts.forEach((item) => {
            HandleStore(
              [parseInt(item.Qty), parseInt(item.pro_id), parseInt(item.Qty)],
              "outminus"
            );
          });
        }

        res.json({ message: "Approved" });
      } else {
        const approveProducts = req.body.approveProducts;
        approveProducts.forEach((item) => {
          HandleStore(
            [parseInt(item.Qty), parseInt(item.pro_id), parseInt(item.Qty)],
            from == "incomingby" ? "in" : "out"
          );
        });
        res.json({ message: "Approved" });
      }
    } else {
      // If the user is not authenticated, return an error response
      res.json({ message: "error" });
    }
  });
});

// manipulate store table with function when request or purchase
function HandleStore(data, op) {
  let query = "";
  if (op == "in") {
    query = `INSERT INTO stores(inQty, pro_id) VALUES(?, ?)
    ON DUPLICATE KEY UPDATE inQty = inQty + ?`;
  } else if (op == "outminus") {
    query = `INSERT INTO stores(outQty, pro_id) VALUES(?, ?)
    ON DUPLICATE KEY UPDATE outQty = outQty - ?`;
  } else {
    query = `INSERT INTO stores(outQty, pro_id) VALUES(?, ?)
    ON DUPLICATE KEY UPDATE outQty = outQty - ?`;
  }

  conn.query(query, data, (err, results) => {
    if (err) {
      console.log("error : " + err);
    }

    // If the user is authenticated, return a success response
    else if (results.affectedRows > 0) {
      console.log(results.affectedRows);
    } else {
      // If the user is not authenticated, return an error response
      console.log("error");
      return false;
    }
  });
}

// Start the server
app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
