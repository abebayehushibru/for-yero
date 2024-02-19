import  './about.scss'

function About() {
  return (
    <div className='about'>
       
        <div className="information">
        <div className="text">
        <h2>About </h2>
            <span>Welcom to Haramaya university IMs</span>

            <p>
            We are proud to introduce an innovative and efficient Property Administration System created by  talented IS students  This system is tailor-made to meet the unique needs of Haramaya University, providing a comprehensive solution for managing and tracking property seamlessly.
            </p>
<label>
About the Developers
</label>
<p>
They are passionate and dedicated students pursuing their studies in IS at Haramaya University. As part of final project , they took on the challenge for developing a robust Property Administration System specifically designed for Haramaya University. Their commitment to excellence, coupled with their technical expertise, has resulted in a system that addresses the complex requirements of inventory management with precision and reliability.  </p>
        </div>

        <div className="image">
            <img src="/hmu.jpg" alt="" />
        </div>
        </div>
    </div>
  )
}

export default About