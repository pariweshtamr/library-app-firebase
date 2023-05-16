import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: {},
}
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload
    },
    logoutSuccess: (state) => {
      state.user = {}
    },
  },
})

const { reducer, actions } = userSlice

export const { setUser, logoutSuccess } = actions

export default reducer
