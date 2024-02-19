import { Link } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./forget.scss";
import axios from "axios";
import randomInt from "random-int";
function Forget() {
  const [erromsg, setErrorsg] = useState("");
  const [erromsgbg, setErrormsgbg] = useState("rgb(255, 255, 112)");
  const [erromsgcolor, setErrormsgcolor] = useState("black");
  const [Id, setId] = useState();
  const [operation, setOperation] = useState("forget");
  const [code, setCode]: any = useState();

  const [emailArray, setEmailArray] = useState([]);
  const [visibility, setvisibility]: any = useState("visible");
  const [role, setWith] = useState("Email");

  const ForgetIt = (e: any) => {
    e.preventDefault();
    const userInput = e.target.userInput.value;
 
    if (operation == "forget" || operation == "new") {
      if (userInput.trim() === "") {
        setErrorsg(
          `You forget entering ${
            operation == "forget"
              ? role !== "Email"
                ? "User Name"
                : "Email"
              : "new password"
          }`
        );
        setErrormsgbg("rgb(255, 207, 207)");
        setErrormsgcolor("red");
      } else if (operation == "new") {
        const userInput2 = e.target.userInput2.value;
        if (userInput2.trim() === "") {
          setErrorsg(`You forget confirming  password`);
          setErrormsgbg("rgb(255, 207, 207)");
          setErrormsgcolor("red");
        } else if (userInput2.trim() !== userInput.trim()) {
          setErrorsg(`password not match`);
          setErrormsgbg("rgb(255, 207, 207)");
          setErrormsgcolor("red");
        } else {
          axios
            .post("http://localhost:8000/forget", {
              userInput: userInput,
              operation: operation,
              id: Id,
            })
            .then((response) => {
              if (response.data.message === "Invalid") {
                setErrorsg(` Something went Wrong`);
                setErrormsgbg("rgb(255, 207, 207)");
                setErrormsgcolor("red");
              } else if (response.data.message === "valid") {
                setErrorsg(`Changed Successfuly`);
                setErrormsgbg("green");
                setErrormsgcolor("white");
                setOperation("forget");
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
              console.log("error");
            });
        }
      } else {
        axios
          .post("http://localhost:8000/forget", {
            userInput: userInput,
            with: role,
            operation: operation,
          })
          .then((response) => {
            if (response.data.message === "Invalid") {
              setErrorsg(` ${role} Not found `);
              setErrormsgbg("rgb(255, 207, 207)");
              setErrormsgcolor("red");
            } else if (response.data.message === "valid") {
              setId(response.data.results[0].id);

              setEmailArray(response.data.results[0].adminEmail.split(""));
              const randomNumber = randomInt(1000, 9999);
              setCode(randomNumber);
              setOperation("Confirm");
              const formData: any = {
                to_name: response.data.results[0].fName,
                message: randomNumber,
                sent_to: response.data.results[0].adminEmail,
              };
              console.log(formData);

              try {
                emailjs
                  .send(
                    "service_0me9iwe",
                    "template_ryrlfqk",

                    formData,
                    "eRDdUmb22jaobL4_x"
                  )
                  .then(
                    () => {
                      setOperation("Confirm");
                      setvisibility("visible");
                    },
                    (error) => {
                      console.log(error);

                      setErrorsg("Conufirmation has not sent");
                      setErrormsgbg("rgb(255, 207, 207)");
                      setvisibility("visible");
                      setErrormsgcolor("red");
                      setOperation(operation);
                   
                    }
                  );
              } catch (error) {
                console.log(error);
                setErrorsg("An error has occurred. Please try again later.");
                setErrormsgbg("rgb(255, 207, 207)");
                setErrormsgcolor("red");
              }
            } else {
              // If the request is not successful, the user is not authenticated
              setErrorsg(" please try again 2");
              setErrormsgbg("rgb(255, 207, 207)");
              setErrormsgcolor("red");
            }
          })
          .catch((error) => {
            // Handle the error
            console.log(error);
            console.log("error");
          });
      }
    } else {
      if (userInput.trim() == "") {
        setErrorsg(
          `Please  enter confirmation code `
        );
        setErrormsgbg("rgb(255, 207, 207)");
        setErrormsgcolor("red");
      }
     else if (userInput.trim() == code) {
        setOperation("new");
      }
      else{
        setErrorsg(
          `Wrong confirmation code `
        );
        setErrormsgbg("rgb(255, 207, 207)");
        setErrormsgcolor("red");
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
          <h3>
            {operation == "forget"
              ? " Forget Password"
              : operation == "new"
              ? " New Password"
              : "Verify "}
          </h3>
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
          <span> {operation == "forget" ? " Forget with" : ""}</span>
          {operation == "Confirm" ? (
            <span>
              we have sent verification code at {code} <br />
              {emailArray.map((letter: string, index: number) => {
                if (index > emailArray.length - 11 || index < 3) {
                  return letter;
                } else {
                  return "*";
                }
              })}
            </span>
          ) : (
            ""
          )}
          {operation == "forget" ? (
            <select
              name="with"
              id=""
              onChange={(e) => {
                setWith(e.target.value);
              }}
            >
              <option value="Email">Email</option>
              <option value="UserName">User Name</option>
            </select>
          ) : (
            ""
          )}
        </div>
        <form
          className="form"
          id="loginform"
          method="post"
          onSubmit={(e) => {
            ForgetIt(e);
          }}
        >
          <div className="inputs">
            {operation == "Confirm" ? (
              <>
                <input
                  type="text"
                  placeholder={"Enter verification code"}
                  name="userInput"
                  form="loginform"
                  onFocus={onfocus}
                />
              </>
            ) : (
              ""
            )}
            {operation == "forget" ? (
              <input
                type="text"
                placeholder={
                  role == "Email" ? "Enter Email" : "Enter User Name"
                }
                name="userInput"
                form="loginform"
                onFocus={onfocus}
              />
            ) : (
              ""
            )}
            {operation == "new" ? (
              <>
                <input
                  type="text"
                  placeholder="New  password"
                  name="userInput"
                  form="loginform"
                  onFocus={onfocus}
                />
                <input
                  type="text"
                  placeholder="Confirm  password"
                  name="userInput2"
                  form="loginform"
                  onFocus={onfocus}
                />
              </>
            ) : (
              ""
            )}
          </div>

          <input
            type="submit"
            value={
              operation == "forget"
                ? "Forget"
                : operation == "new"
                ? "Update"
                : "Confirm"
            }
            className="login-btn"
            style={{ visibility: visibility }}
          />
        </form>

        <div className="forget">
          <Link to={"/login"}> Back To Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Forget;
