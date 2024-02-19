import "./toast.scss"

type Props={
  toastmsg:string,
  toastbg:string,
  toastcolor:string,
  toaststate:boolean,

}
function Toast(props:Props) {

    let timer=Date();
    
   

  return (
    <div className="toast" key={`${timer}`} style={{display:props.toaststate?"flex":"none",opacity:props.toaststate?1:0,backgroundColor:props.toastbg,color:props.toastcolor}} >
<span>
   {props.toastmsg}
</span>

    </div>
  )
}

export default Toast