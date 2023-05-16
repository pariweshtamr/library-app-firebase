import { Route, Routes } from "react-router-dom"
import "./App.css"
import HomePage from "./pages/Home/HomePage"
import Login from "./pages/LoginRegister/Login"
import Register from "./pages/LoginRegister/Register"
import Books from "./pages/Books/Books"
import AddBook from "./pages/AddBook/AddBook"
import { ToastContainer } from "react-toastify"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./config/firebaseConfig"
import { useDispatch } from "react-redux"
import { PrivateRoute } from "./components/privateRoute/PrivateRoute"
import { getUserFromDbAction } from "./redux/user/userAction"
import MyBooks from "./pages/MyBooks/MyBooks"
import Transactions from "./pages/Transactions/Transactions"

function App() {
  const dispatch = useDispatch()
  onAuthStateChanged(auth, (user) => {
    dispatch(getUserFromDbAction(user?.uid))
  })

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/add"
          element={
            <PrivateRoute>
              <AddBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/mybooks"
          element={
            <PrivateRoute>
              <MyBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
