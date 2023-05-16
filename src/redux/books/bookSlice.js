import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  books: [],
  borrowedBooks: [],
  response: {},
}

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    requestSuccess: (state, { payload }) => {
      state.response = payload
    },
    getBooksSuccess: (state, { payload }) => {
      state.books = payload
    },
    getBorrowedBooksSuccess: (state, { payload }) => {
      state.borrowedBooks = payload
    },
  },
})

const { reducer, actions } = bookSlice

export const { requestSuccess, getBooksSuccess, getBorrowedBooksSuccess } =
  actions

export default reducer
