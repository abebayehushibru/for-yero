import "./footer.scss"

function Footer() {
  return (
    <div className="footer">
      <span>HUPAS</span>
      <div className="socialMedia">
        <a href="/"> <i className="fab fa-facebook-f"></i></a>
        <a href="/"> <i className="fab fa-instagram"></i></a>
        <a href="/"><i className="fab fa-telegram-plane"></i>
</a>
        <a href="/"> <i className="fa-solid fa-globe"></i></a>
      </div >
      <div style={{display:"flex",flexDirection:"column",gap:"3px"}}><span style={{fontSize:"12px"}}> &copy; Haramaya University</span>
      <span>  Developed By <a href="https://sola.com" target="_blank" rel="noopener noreferrer" style={{fontWeight:"bolder"}}>SOLA</a> </span></div>
      
    </div>
  )
}

export default Footer