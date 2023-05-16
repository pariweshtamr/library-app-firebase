import { Button, Col, Form, Spinner } from "react-bootstrap"
import DashboardLayout from "../../components/layout/DashboardLayout"
import bookImg from "../../assets/book.jpg"
import "./addBook.css"
import { useState } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../config/firebaseConfig"
import { toast } from "react-toastify"

const initialState = {
  title: "",
  author: "",
  isbn: "",
  thumbnail: "",
  year: "",
  summary: "",
}

const AddBook = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initialState)

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setForm({ ...form, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // add book data to firebase
    const docRef = await addDoc(collection(db, "books"), {
      ...form,
    })

    setLoading(false)
    if (!docRef.id) {
      toast.error("Unable to add book!")
    }
    toast.success("Book added successfully!")
    setForm(initialState)
  }
  return (
    <DashboardLayout>
      <div className="add">
        <div className="add-top">
          <h1>Add New Book</h1>
        </div>
        <div className="add-bottom">
          <Col md="7" className="d-none d-sm-block">
            <img src={bookImg} alt="book-img" style={{ width: "100%" }} />
          </Col>
          <Col md={5} sm={12} xs={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  placeholder="Book Title"
                  required
                  type="text"
                  name="title"
                  onChange={handleOnChange}
                  value={form.title}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  placeholder="Author Name "
                  required
                  type="text"
                  name="author"
                  onChange={handleOnChange}
                  value={form.author}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  placeholder="ISBN"
                  required
                  type="text"
                  name="isbn"
                  onChange={handleOnChange}
                  value={form.isbn}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Year Published</Form.Label>
                <Form.Control
                  placeholder="Year"
                  required
                  type="number"
                  name="year"
                  onChange={handleOnChange}
                  value={form.year}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Thumbnail</Form.Label>
                <Form.Control
                  placeholder="Image Address"
                  required
                  type="text"
                  name="thumbnail"
                  onChange={handleOnChange}
                  value={form.thumbnail}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Summary..."
                  type="text"
                  name="summary"
                  onChange={handleOnChange}
                  value={form.summary}
                />
              </Form.Group>

              <Button variant="dark" className="mt-4" type="submit">
                ADD BOOK{" "}
                <span>
                  {loading && <Spinner animation="border" variant="light" />}
                </span>
              </Button>
            </Form>
          </Col>
        </div>
      </div>
    </DashboardLayout>
  )
}
export default AddBook
