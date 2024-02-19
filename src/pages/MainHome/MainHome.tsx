import { Link } from 'react-router-dom'
import   './mainhome.scss'
import { loggedInby } from "../../component/Datas";

function MainHome() {
  return (
    <div className="mainHome">
        <div className="mainMenuContent">
            <div className="info">
                <h2>
                Haramaya University
                </h2>
                <span>Property Administration System</span>
                <p>
                This Property Administration System developed by Haramaya university  students of IS,it    is a comprehensive solution tailored for Haramaya University's unique requirements. This system aims to streamline and optimize the management of Haramaya University's inventory, providing an efficient and user-friendly interface for tracking and controlling assets. </p>

           {loggedInby?"":<Link to="/login" className='btn'>Log-In</Link>}     
            </div>
            <div className='image'>
                <img src=" /system.jpg" alt="" />
               Building the Basis for Development

            </div>
        </div>
   

    </div>
  )
}

export default MainHome