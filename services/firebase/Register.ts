import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebase"
import { registerModel } from "./model/register"

export const Register = async (user: registerModel) => {
   try {
      if (user.password !== user.confirmPassword) throw new Error("Las contraseñas no coinciden!")
      await createUserWithEmailAndPassword(auth, user.email, user.password).then(() => {
      }).catch((e) => {
         throw new Error(e)
      })
   } catch(e) { 
      throw new Error(e.message)
   }
}