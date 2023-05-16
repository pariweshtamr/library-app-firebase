import { Button, Table } from "react-bootstrap"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getBorrowedBooksAction } from "../../redux/books/bookAction"
import { toast } from "react-toastify"
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebaseConfig"
import { getTransactionsAction } from "../../redux/transactions/transactionAction"
import "./mybooks.css"

const MyBooks = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { borrowedBooks } = useSelector((state) => state.book)
  const { transactions } = useSelector((state) => state.transaction)
  const [shouldFetch, setShouldFetch] = useState(true)
  const [myBooks, setMybooks] = useState([])

  useEffect(() => {
    dispatch(getTransactionsAction())
    setShouldFetch(true)
    shouldFetch && dispatch(getBorrowedBooksAction(user.uid))
    setShouldFetch(false)
    setMybooks(borrowedBooks)
  }, [dispatch, user.uid, shouldFetch, borrowedBooks])

  const handleReturn = async (id) => {
    if (!id) return
    try {
      const bookRef = doc(db, "books", id)
      const bookSnap = await getDoc(bookRef)
      if (bookSnap.exists()) {
        const book = bookSnap.data()

        const t = transactions.filter(
          (transaction) =>
            transaction.borrowedBook.isbn === book.isbn &&
            transaction.borrowedBy.userId === user.uid &&
            !transaction.returnedDate
        )

        if (!t[0].id) {
          return toast.error(
            "Transaction not found! Please contact the library."
          )
        }

        // return book
        const transactionRef = doc(db, "transactions", t[0].id)
        await updateDoc(transactionRef, {
          returnedDate: new Date().toISOString(),
        })
        const transactionSnap = await getDoc(transactionRef)

        if (transactionSnap.exists()) {
          const transaction = transactionSnap.data()
          if (!transaction.returnedDate) {
            return toast.error(
              "Something went wrong. Please try returning the book later!"
            )
          }
          await updateDoc(bookRef, {
            borrowedBy: deleteField(),
          })
          toast.success("Book returned!")
        }

        dispatch(getBorrowedBooksAction(user.uid))
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <DashboardLayout>
      <div className="myBooks">
        <h2 className="mb-4">
          <u>Books Borrowed</u>
        </h2>
        <Table striped bordered hover className="mybooks-table">
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Book</th>
              <th>Title</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myBooks?.map((book, i) => (
              <tr key={book.id} className="text-center">
                <td>{i + 1}</td>
                <td style={{ width: "15%" }}>
                  <img
                    src={book.thumbnail}
                    alt="book-img"
                    className="book-img"
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>

                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleReturn(book.id)}
                  >
                    Return Book
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </DashboardLayout>
  )
}
export default MyBooks
