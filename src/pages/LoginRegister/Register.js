import { Button, Container, Form, Spinner } from "react-bootstrap"
import DefaultLayout from "../../components/layout/DefaultLayout"
import "./login.css"
import { useState } from "react"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db } from "../../config/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { fName, lName, email, password, confirmPassword } = form

      if (password !== confirmPassword) {
        return toast.error("Password do not match!")
      }

      // create user in firebase auth
      setLoading(true)
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      if (user?.uid) {
        updateProfile(user, {
          displayName: fName,
        })

        // store in firestore db
        const obj = {
          email,
          fName,
          lName,
          role: form.role,
        }

        await setDoc(doc(db, "users", user.uid), obj)
        setLoading(false)
        toast.success("Registration successful! redirecting to dashboard...")
        setTimeout(() => {
          navigate("/books")
        }, 2000)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <DefaultLayout>
      <Container className="container">
        <Form className="form" onSubmit={handleSubmit}>
          <h3>Join our Library</h3>

          <Form.Text className="text-center">
            Anyone can create admin or user account for experiment purpose.
          </Form.Text>

          <div className="inputs">
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                required
                placeholder="First Name"
                name="fName"
                onChange={handleChange}
              />
              <Form.Control
                type="text"
                required
                placeholder="Last Name"
                name="lName"
                onChange={handleChange}
              />
            </div>
            <Form.Control
              type="email"
              required
              placeholder="xyz@gmail.com"
              name="email"
              onChange={handleChange}
            />

            <Form.Select name="role" onChange={handleChange}>
              <option value="">-- Select user type --</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Form.Select>

            <Form.Control
              type="password"
              required
              placeholder="********"
              name="password"
              onChange={handleChange}
            />
            <Form.Control
              type="password"
              required
              placeholder="********"
              name="confirmPassword"
              onChange={handleChange}
            />
          </div>

          <Button variant="dark" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Register"
            )}
          </Button>
          <p className="text-secondary">
            Already have an account? <Link to="/register">Login Now</Link>
          </p>
        </Form>
      </Container>
    </DefaultLayout>
  )
}
export default Register
