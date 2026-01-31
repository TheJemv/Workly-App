import { loginModel } from "./model/login";
import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";

export const Singin = async (user: loginModel) => {
   try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, user.email, user.password);
   } catch (e) {
      console.error("Error en login:", e);
      throw e;
   }
};