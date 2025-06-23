import auth from "@react-native-firebase/auth";
import { loginModel } from "./model/login";

export const Singin = async (user: loginModel) => {
   try {
      await auth()
         .signInWithEmailAndPassword(user.email, user.password)
         .then(() => {})
         .catch((e) => {
            console.log(e);
            throw new Error(e);
         });
   } catch (e) {
      throw new Error(e.message);
   }
};
