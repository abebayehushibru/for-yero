import { GridRowsProp } from '@mui/x-data-grid';
import './topbox.scss'
import { useState, useEffect } from "react";
import axios from 'axios';


//
function TopBox() {
    const initialRows: GridRowsProp= [];

 
      const [data, setData] = useState(initialRows);
    
    
    useEffect(() => {
        axios
        .post("http://localhost:8000/AllData",{
          from:"TopBox"
        })
        .then((response) => {
          
          setData(response.data.allData)});
      }, []);


  return (
    <div className='topBox'>
        <h1>Top Product</h1>
        <div className="list">
            {data.map((item)=>{
              
                return <div className="listItems" >
                    <div className="product">
                        <img src={"http://localhost:8000/images/"+item.Img||" /noavatar.png"}alt="" />
                        <div className="productText">
                            <span>{item.Product_name}</span>
                            <span>{item.Category}</span>
                        </div>

                    </div>
                    <span className="amount">
                       {item.Totalstock}
                    </span>
                </div>
            })}
        </div>
    </div>
  )
}

export default TopBox