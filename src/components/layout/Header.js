import { signOut } from "firebase/auth"
import { Container, Nav, Navbar } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { auth } from "../../config/firebaseConfig"
import { toast } from "react-toastify"
import { logoutSuccess } from "../../redux/user/userSlice"
import logo from "../../assets/logo.png"
import "./header.css"

const Header = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutSuccess())
        toast.success("logout successfully")
      })
      .catch((error) => toast.error(error.message))
  }

  return (
    <Navbar bg="light" expand="lg" style={{ height: "max-content" }}>
      <Container className="px-5">
        <Link to={user.uid ? "/books" : "/"} className="logo-container">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex gap-4">
            {user?.uid ? (
              <>
                <div>Welcome {user.fName}!</div>

                <Link to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  Register
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
export default Header
