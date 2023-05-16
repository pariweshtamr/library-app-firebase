import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./redux/user/userSlice"
import bookReducer from "./redux/books/bookSlice"
import transactionReducer from "./redux/transactions/transactionSlice"
export default configureStore({
  reducer: {
    user: userReducer,
    book: bookReducer,
    transaction: transactionReducer,
  },
})
