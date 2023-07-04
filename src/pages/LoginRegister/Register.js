import { Button, Container, Form, Spinner } from "react-bootstrap"
import DefaultLayout from "../../components/layout/DefaultLayout"
import "./login.css"
import { useState } from "react"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db } from "../../config/firebaseConfig"
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const initialState = {
  fName: "",
  lName: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
}

const Register = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initialState)
  const [reveal, setReveal] = useState(false)
  const [meter, setMeter] = useState(false)

  const atLeastOneUpperCase = /[A-Z]/g // capital letters from A - Z
  const atLeastOneLowerCase = /[a-z]/g // capital letters from a - z
  const atleastOneNumeric = /[0-9]/g // numbers from 0 - 9
  const atLeastOneSpecialChar = /[!@#$%^&*()_+?./-]/g // any of the special characters with the square brackets
  const sevenCharsOrMore = /.{7,}/g // seven or more characters

  const passwordTracker = {
    uppercase: form.password.match(atLeastOneUpperCase),
    lowercase: form.password.match(atLeastOneLowerCase),
    numeric: form.password.match(atleastOneNumeric),
    specialChar: form.password.match(atLeastOneSpecialChar),
    sevenOrMoreChars: form.password.match(sevenCharsOrMore),
  }

  const passwordStrength = Object.values(passwordTracker).filter(
    (value) => value
  ).length

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
      if (passwordStrength !== 5) {
        toast.error("Please provide a stronger password!")
        return
      }
      setLoading(true)
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        limit(1)
      )

      let existingUser = {}
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {
        existingUser = doc.data()
      })
      if (existingUser?.email) {
        toast.error("This email has already been registered. Please log in!")
        setLoading(false)
        return
      }

      // if same email does not exist then create user in firebase auth

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
                value={form.fName}
              />
              <Form.Control
                type="text"
                required
                placeholder="Last Name"
                name="lName"
                onChange={handleChange}
                value={form.lName}
              />
            </div>
            <Form.Control
              type="email"
              required
              placeholder="xyz@gmail.com"
              name="email"
              onChange={handleChange}
              value={form.email}
            />

            <Form.Select name="role" onChange={handleChange} value={form.role}>
              <option value="">-- Select user type --</option>
              <option value="admin" disabled={user?.role !== "admin"}>
                Admin
              </option>
              <option value="user">User</option>
            </Form.Select>

            <div className="pw-input">
              <Form.Control
                onKeyDown={() => setMeter(true)}
                type={reveal ? "text" : "password"}
                required
                placeholder="********"
                name="password"
                onChange={handleChange}
                value={form.password}
              />
              {!reveal ? (
                <i
                  className="fa-solid fa-eye show-pw"
                  onClick={() => setReveal(true)}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-eye-slash show-pw"
                  onClick={() => setReveal(false)}
                ></i>
              )}
            </div>
            {meter && (
              <>
                <div className="password-strength-text">
                  Password Strength:{" "}
                  {passwordStrength === 1
                    ? "Poor"
                    : passwordStrength === 2
                    ? "Fair"
                    : passwordStrength === 3
                    ? "Good"
                    : passwordStrength === 4
                    ? "Good"
                    : passwordStrength === 5
                    ? "Excellent"
                    : ""}
                </div>
                <div className="password-strength-meter"></div>

                <ul
                  className={
                    passwordStrength === 5 ? "d-none" : "password-rules"
                  }
                >
                  {passwordStrength < 5 && <b>Password must contain:</b>}
                  {!passwordTracker.uppercase && <li>atleast 1 uppercase</li>}
                  {!passwordTracker.lowercase && <li>atleast 1 lowercase</li>}

                  {!passwordTracker.specialChar && (
                    <li>atleast 1 special character </li>
                  )}

                  {!passwordTracker.numeric && <li> atleast 1 number</li>}

                  {!passwordTracker.sevenOrMoreChars && (
                    <li>seven character or more</li>
                  )}
                </ul>
              </>
            )}

            <Form.Control
              type="password"
              required
              placeholder="********"
              name="confirmPassword"
              onChange={handleChange}
              value={form.confirmPassword}
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
      <style jsx="true">
        {`
          .password-strength-meter {
            height: 0.3rem;
            background: lightgrey;
            border-radius: 3px;
            margin: 0.5rem 0;
          }

          .password-strength-meter::before {
            content: "";
            background-color: ${[
              "red",
              "yellow",
              "#03a2cc",
              "#03a2cc",
              "#0ce052",
            ][passwordStrength - 1] || ""};
            height: 100%;
            width: ${(passwordStrength / 5) * 100}%;
            display: block;
            border-radius: 3px;
            transition: width 0.2s;
          }
        `}
      </style>
    </DefaultLayout>
  )
}
export default Register
