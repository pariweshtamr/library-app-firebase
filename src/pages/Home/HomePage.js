import { Carousel } from "react-bootstrap"
import DefaultLayout from "../../components/layout/DefaultLayout"
import l1 from "../../assets/l1.jpg"
import l2 from "../../assets/l2.jpg"
import l3 from "../../assets/l3.jpg"
import "./home.css"

const HomePage = () => {
  return (
    <DefaultLayout>
      <div className="home">
        <Carousel>
          <Carousel.Item className="h-100">
            <img className="d-block c-img" src={l1} alt="First slide" />
            <Carousel.Caption>
              <div className="carousel-text">
                <h1>Welcome to Library Management System</h1>
                <p>
                  The unique library offers the latest tech and personal
                  development books
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block c-img" src={l2} alt="Second slide" />

            <Carousel.Caption>
              <div className="carousel-text">
                <h1>Welcome to Library Management System</h1>
                <p>
                  The unique library offers the latest tech and personal
                  development books
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block c-img" src={l3} alt="Third slide" />

            <Carousel.Caption>
              <div className="carousel-text">
                <h1>Welcome to Library Management System</h1>
                <p>
                  The unique library offers the latest tech and personal
                  development books
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </DefaultLayout>
  )
}
export default HomePage
