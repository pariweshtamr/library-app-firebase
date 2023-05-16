import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../config/firebaseConfig"
import { setUser } from "./userSlice"
import { toast } from "react-toastify"

export const getUserFromDbAction = (uid) => async (dispatch) => {
  try {
    const userRef = doc(db, "users", uid)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      const dbUser = docSnap.data()

      const userObj = {
        uid,
        ...dbUser,
      }
      if (userObj?.uid) {
        dispatch(setUser(userObj))
        return
      }
    }
    toast.error("Error, invalid login details!")
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    }
  }
}

export const signInAction = (auth, email, password) => async (dispatch) => {
  try {
    const userPending = signInWithEmailAndPassword(auth, email, password)

    toast.promise(userPending, {
      pending: "please wait",
    })

    const { user } = await userPending

    const { uid } = user

    dispatch(getUserFromDbAction(uid))
  } catch (error) {
    toast.error(error.message)
  }
}
