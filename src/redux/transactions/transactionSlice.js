import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  error: {},
  response: {},
  transactions: [],
}

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    getTransactionsSuccess: (state, { payload }) => {
      state.isLoading = false
      state.transactions = payload
      state.error = {}
    },
    requestFailed: (state, { payload }) => {
      state.isLoading = false
      state.error = payload
    },
  },
})

const { actions, reducer } = transactionSlice

export const { getTransactionsSuccess, requestFailed } = actions

export default reducer
