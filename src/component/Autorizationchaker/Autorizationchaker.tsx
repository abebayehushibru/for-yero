import axios from "axios";
import "./autorizationchaker.scss"
import { useState } from "react";
type Props={
  isAutorized:(isyes: boolean, info: any) => void
}
const  Autorizationchaker=(props:Props)=> {
  const [erromsg, setErrmsg] = useState("")

  const verify=(e:any)=>{
e.preventDefault();
if (e.target.autzid.value.trim()=="") {
  setErrmsg("please enter Autorization id ")
}
else if (e.target.autzcode.value.trim()=="") {
  setErrmsg("please enter Autorization code ")

}
else{
  axios
        .post("http://localhost:8000/representationAuthintication", {
          userId: e.target.autzid.value.trim(),
          code: e.target.autzcode.value.trim(),
        })
        .then((response) => {
          if (response.data.message === "Invalid") {
            setErrmsg("Wrong id or code");
           
          } else if (response.data.message === "valid") {
            props.isAutorized(true,response.data.info)
          } else {
            // If the request is not successful, the user is not authenticated
            setErrmsg(" please try again");
           
          }
        })
        .catch((error) => {
          // Handle the error
          console.log(error);
          console.log("error")
        });

  
}

  }
  return (
    <div className="autorizationchaker">
      <div className="conatiner">
        <h2>Autorization </h2>
        <form className="form" id="autorizationform" onSubmit={(e)=>verify(e)}>
        <div className="item">
           {erromsg?(<p>{erromsg}</p> ):""}</div>
          <div className="item">
            <label> Your Id </label>
            <input type="text" name="autzid" onFocus={()=>setErrmsg("")} />
          </div>
          <div className="item">
            <label> Autorization Code</label>
            <input type="text" name="autzcode"  onFocus={()=>setErrmsg("")}  />
          </div>
          
          

        </form>
    
            <input type="submit"value={"Verify"}  className ="btn"form="autorizationform"/>
         
         
      </div>

    </div>
  )
}

export default Autorizationchaker