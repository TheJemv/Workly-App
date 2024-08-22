import { signOut } from "firebase/auth"
import { auth } from "../../config/firebase"

export const Singout = async () => {
   try {
      await signOut(auth).catch((e) => {
         throw new Error(e)
      })
   } catch(e) { 
      throw new Error(e.message)
   }
}