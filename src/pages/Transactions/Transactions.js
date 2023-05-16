import { useDispatch, useSelector } from "react-redux"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { useEffect, useState } from "react"
import { getTransactionsAction } from "../../redux/transactions/transactionAction"
import { Table } from "react-bootstrap"
import "./transactions.css"

const Transactions = () => {
  const dispatch = useDispatch()
  const [shouldFetch, setShouldFetch] = useState(true)
  const { transactions } = useSelector((state) => state.transaction)

  useEffect(() => {
    setShouldFetch(true)
    shouldFetch && dispatch(getTransactionsAction())
    setShouldFetch(false)
  }, [dispatch, shouldFetch])

  const sortedTransactions =
    transactions &&
    [...transactions].sort((a, b) => {
      let titleA = a.borrowedBook.title.toLowerCase()
      let titleB = b.borrowedBook.title.toLowerCase()
      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    })

  return (
    <DashboardLayout>
      <div className="transactions">
        <h2 className="mb-4">
          <u>Transactions</u>
        </h2>
        {!sortedTransactions ? (
          <h1>No transactions found!</h1>
        ) : (
          <Table striped bordered hover style={{ width: "100%" }}>
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Book</th>
                <th>Title</th>
                <th>Author</th>
                <th>Borrowed By</th>
                <th>Borrowed Date</th>
                <th>Returned Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions?.map((transaction, i) => (
                <tr key={transaction.id} className="text-center">
                  <td>{i + 1}</td>
                  <td style={{ width: "15%" }}>
                    <img
                      src={transaction?.borrowedBook?.thumbnail}
                      alt="book-img"
                      className="book-img"
                    />
                  </td>
                  <td>{transaction?.borrowedBook?.title}</td>
                  <td>{transaction?.borrowedBook?.author}</td>
                  <td>{`${transaction?.borrowedBy?.userFname} ${transaction?.borrowedBy?.userLname}`}</td>
                  <td>
                    {new Date(transaction?.borrowedDate).toLocaleDateString()}
                  </td>

                  <td
                    className={
                      transaction?.returnedDate ? "text-success" : "text-danger"
                    }
                  >
                    {transaction?.returnedDate
                      ? new Date(transaction?.returnedDate).toLocaleDateString()
                      : "Not yet returned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  )
}
export default Transactions
