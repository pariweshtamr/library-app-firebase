import { Button, Container, Form, Spinner } from "react-bootstrap"
import DefaultLayout from "../../components/layout/DefaultLayout"
import "./login.css"
import { useEffect, useState } from "react"
import { auth } from "../../config/firebaseConfig"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signInAction } from "../../redux/user/userAction"

const Login = () => {
  const dispatch = useDispatch()
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    user?.uid && navigate("/books")
  }, [user?.uid, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = form

    try {
      setLoading(true)
      dispatch(signInAction(auth, email, password))
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <DefaultLayout>
      <Container className="container">
        <Form className="form" onSubmit={handleSubmit}>
          <h3>Welcome to the Library System</h3>

          <div className="inputs">
            <Form.Control
              type="email"
              required
              placeholder="xyz@gmail.com"
              name="email"
              onChange={handleChange}
            />
            <Form.Control
              type="password"
              required
              placeholder="********"
              name="password"
              onChange={handleChange}
            />
          </div>

          <Button variant="dark" type="submit">
            {loading ? <Spinner animation="border" variant="light" /> : "Login"}
          </Button>
          <p className="text-secondary">
            Don't have an account? <Link to="/register">Register Now</Link>
          </p>
        </Form>
      </Container>
    </DefaultLayout>
  )
}
export default Login
