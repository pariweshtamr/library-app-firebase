import { collection, getDocs, query, where } from "firebase/firestore"
import { getBooksSuccess, getBorrowedBooksSuccess } from "./bookSlice"
import { db } from "../../config/firebaseConfig"

export const getBooksAction = () => async (dispatch) => {
  try {
    let bks = []
    const querySnapshot = await getDocs(collection(db, "books"))

    querySnapshot.forEach((doc) => {
      const { id } = doc
      const data = { ...doc.data(), id }
      bks.push(data)
    })

    if (!bks.length) {
      return dispatch(getBooksSuccess())
    }
    dispatch(getBooksSuccess(bks))
  } catch (error) {
    return error.message
  }
}

export const getBorrowedBooksAction = (uid) => async (dispatch) => {
  try {
    let borrowedBks = []

    const q = query(collection(db, "books"), where("borrowedBy", "==", uid))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      const { id } = doc
      const data = { ...doc.data(), id }
      borrowedBks.push(data)
    })
    if (!borrowedBks.length) {
      return dispatch(getBorrowedBooksSuccess())
    }
    dispatch(getBorrowedBooksSuccess(borrowedBks))
  } catch (error) {
    return error.message
  }
}
