import { collection, getDocs } from "firebase/firestore"
import { getTransactionsSuccess } from "./transactionSlice"
import { db } from "../../config/firebaseConfig"

export const getTransactionsAction = () => async (dispatch) => {
  try {
    let transactions = []
    const querySnapshot = await getDocs(collection(db, "transactions"))

    querySnapshot.forEach((doc) => {
      const { id } = doc
      const data = { ...doc.data(), id }
      transactions.push(data)
    })

    if (!transactions.length) {
      return dispatch(getTransactionsSuccess())
    }
    dispatch(getTransactionsSuccess(transactions))
  } catch (error) {
    return error.message
  }
}
