import { Button, Form } from "react-bootstrap"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { Link } from "react-router-dom"
import BookTable from "../../components/books/BookTable"
import { useCallback, useEffect, useState } from "react"
import "./books.css"
import { useDispatch, useSelector } from "react-redux"
import { getBooksAction } from "../../redux/books/bookAction"

const Books = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { books } = useSelector((state) => state.book)
  const [shouldFetch, setShouldFetch] = useState(true)
  const [filteredBooks, setFilteredBooks] = useState([])

  const fetchBooks = useCallback(async () => {
    setShouldFetch(true)
    shouldFetch && dispatch(getBooksAction())
    setFilteredBooks(books)
    setShouldFetch(false)
  }, [dispatch, books, shouldFetch])
  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleSearch = (e) => {
    setFilteredBooks(
      books.filter((book) =>
        book.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }
  return (
    <DashboardLayout>
      <div className="books-container">
        <h2>Books</h2>
        <div className="books-top">
          <Form.Group>
            <input
              type="text"
              placeholder="Search book title..."
              className="form-control"
              onChange={handleSearch}
            />
          </Form.Group>

          {user?.role === "admin" && (
            <Link to="/books/add">
              <Button variant="primary">+ Add New Book</Button>
            </Link>
          )}
        </div>
        <hr />

        <BookTable books={filteredBooks} />
      </div>
    </DashboardLayout>
  )
}
export default Books
