import { Col, Row } from "react-bootstrap"
import BookRow from "./BookRow"
import "./bookTable.css"

const BookTable = ({ books }) => {
  return (
    <>
      <Row className="bookTable-head">
        <Col sm={2}>
          <strong>Thumbnail</strong>
        </Col>
        <Col>
          <strong>Details</strong>
        </Col>
      </Row>
      <hr className="hr" />
      {books && books?.map((book) => <BookRow key={book.id} book={book} />)}
    </>
  )
}
export default BookTable
