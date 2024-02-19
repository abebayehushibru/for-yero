import Barchart from "../../component/Barchart/Barchart";
import TopBox from "../../component/TopBox/TopBox";
import ChartBox from "../../component/chartBox/ChartBox";
import PieChartBox from "../../component/pieChartbox/PieChartBox";
import "./home.scss";
function Home() {
  return (
    <div className="home">
      <div className="box box1"> <TopBox/></div>
      <div className="box box2"><ChartBox title={"All Inventory"} id={"inve"} table="inventory" api={"Reportdatase"} to={"Inventory"}/></div>
      <div className="box box3"><ChartBox title={"All Incomming"}  id={"pur"} table="incomingby"  api={"Reportdata"} to={"incomming"}/></div>
      <div className="box box4"> <PieChartBox/></div>
      <div className="box box5"> <ChartBox  title={"All Request"}  id={"invo"} table="requestedby" api={"Reportdata"} to={"Request"}/></div>
      <div className="box box6"> <Barchart/></div>
      
      
    </div>
  )
}

export default Home