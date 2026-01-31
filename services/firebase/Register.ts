import { registerModel } from "./model/register";
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";

export const Register = async (user: registerModel) => {
   try {
      if (user.password !== user.confirmPassword) {
         throw new Error("Las contraseñas no coinciden!");
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
         auth,
         user.email,
         user.password
      );

      return userCredential.user;
   } catch (e) {
      console.error("Error en registro:", e);
      throw new Error(e.message);
   }
};