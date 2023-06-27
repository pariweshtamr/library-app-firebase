import { NavLink, useLocation } from "react-router-dom"
import "./sidebar.css"
import { useSelector } from "react-redux"
const Sidebar = () => {
  const { user } = useSelector((state) => state.user)
  const { pathname } = useLocation()
  return (
    <aside className="sidebar">
      <div className="top">
        <i className="fa-solid fa-user profile-img"></i>
      </div>
      <div className="bottom">
        <ul>
          <div className="title">MAIN</div>
          <NavLink to="/books">
            <li className={pathname === "/books" ? "active" : ""}>
              <i className="fa-solid fa-book"></i>
              <span>All Books</span>
            </li>
          </NavLink>
          <NavLink to="/mybooks">
            <li className={pathname === "/mybooks" ? "active" : ""}>
              <i className="fa-solid fa-book-open"></i> <span>My Books</span>
            </li>
          </NavLink>

          {user?.role === "admin" && (
            <>
              <NavLink to="/books/add">
                <li className={pathname === "/books/add" ? "active" : ""}>
                  <i className="fa-solid fa-book"></i>
                  <span>Add Book</span>
                </li>
              </NavLink>
              <NavLink to="/transactions">
                <li className={pathname === "/transactions" ? "active" : ""}>
                  <i className="fa-solid fa-book-open-reader"></i>
                  <span>Transactions</span>
                </li>
              </NavLink>
              <NavLink to="/register">
                <li className={pathname === "/register" ? "active" : ""}>
                  <i className="fa-solid fa-book-open-reader"></i>
                  <span>Register Admin</span>
                </li>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </aside>
  )
}
export default Sidebar
