import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { loginModel } from "./model/login";

export const Singin = async (user: loginModel) => {
   try {
      await signInWithEmailAndPassword(auth, user.email, user.password)
         .then(() => {})
         .catch((e) => {
            console.log(e);
            throw new Error(e);
         });
   } catch (e) {
      throw new Error(e.message);
   }
};
