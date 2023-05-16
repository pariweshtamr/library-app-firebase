import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap"
import { db } from "../../config/firebaseConfig"
import { useDispatch, useSelector } from "react-redux"
import { getBooksAction } from "../../redux/books/bookAction"
import { toast } from "react-toastify"
import { useState } from "react"
import "./bookRow.css"

const BookRow = ({ book }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [bk, setBk] = useState({})
  const [form, setForm] = useState(book)

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book from the system?"
      )
    ) {
      try {
        await deleteDoc(doc(db, "books", id))
        dispatch(getBooksAction()) &&
          toast.success("Book deleted successfully!")
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const handleShow = (bookInfo) => {
    setShow(true)
    setBk(bookInfo)
  }

  const handleEdit = async () => {
    const bookRef = doc(db, "books", bk.id)

    // update book info
    await updateDoc(bookRef, {
      ...form,
    })

    setShow(false)
    toast.success("Book information updated successfully!")
  }

  const handleOnChange = async (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleBorrow = async (id) => {
    setLoading(true)
    try {
      if (id) {
        const bookRef = doc(db, "books", id)
        const bookSnap = await getDoc(bookRef)
        if (bookSnap.exists()) {
          const book = bookSnap.data()
          if (book?.borrowedBy === user?.uid) {
            setLoading(false)
            return toast.error("You have already borrowed this book!")
          }
          if (book?.borrowedBy) {
            setLoading(false)
            return toast.error(
              "This book has already been borrowed and will be available once it has been returned."
            )
          }

          //create transaction
          const transactionRef = await addDoc(collection(db, "transactions"), {
            borrowedBy: {
              userId: user?.uid,
              userFname: user?.fName,
              userLname: user?.lName,
            },
            borrowedBook: {
              isbn: book?.isbn,
              thumbnail: book.thumbnail,
              title: book.title,
              author: book.author,
              year: book.year,
            },
            borrowedDate: new Date().toISOString(),
          })

          if (transactionRef.id) {
            await updateDoc(bookRef, {
              borrowedBy: user.uid,
            })
            toast.success("Book borrowed successfully!")
          }
        }
      }
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="py-4 bookTable-body">
        <Col sm={2} className="img-col">
          <img src={book.thumbnail} alt="book-img" width="70%" />
        </Col>
        <Col className="d-flex flex-column justify-content-around">
          <h4 style={{ textDecoration: "underline" }}>
            Title: <span>{book?.title}</span>
          </h4>

          <h5>
            Author: <span>{book?.author}</span>
          </h5>
          <p>
            Summary: <span>{book?.summary}</span>
          </p>

          <div className="btns-group">
            <Button variant="warning" onClick={() => handleBorrow(book.id)}>
              {loading ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Borrow"
              )}
            </Button>
            {user?.role === "admin" && (
              <>
                <Button variant="primary" onClick={() => handleShow(book)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(book.id)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>
      <hr />
    </>
  )
}
export default BookRow
