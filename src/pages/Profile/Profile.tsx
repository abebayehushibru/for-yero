import { Link } from "react-router-dom"
import {loggedInby} from "../../component/Datas";
import "./profile.scss"
function Profile() {
  return (
 <div className="profile">
  <h2>
     Profile
  </h2>
  <div className="profileItems">
    <div className="items">
      <div className="item">
      <label htmlFor="">Full Name</label>
      <span>{loggedInby.fName}</span>
    </div>
    <div className="item">
      <label htmlFor=""> User Name</label>
      <span>{loggedInby.adminUserName}</span>
    </div>
    <div className="item">
      <label htmlFor=""> Du Id</label>
      <span>{loggedInby.adminId}</span>
    </div>
    <div className="item">
      <label htmlFor=""> Email</label>
      <span>{loggedInby.adminEmail}</span>
    </div>

     <Link to ="/Profile/edit"className="btn">
  Edit Profile
  </Link>
    </div>
    <div className="profile-img">
      <img src={loggedInby.img!==null?"http://localhost:8000/images/"+loggedInby.img:" /noavatar.png"}alt="" />
      <span>profile image</span>
    </div>
  </div>
 

 </div>
  )
}

export default Profile