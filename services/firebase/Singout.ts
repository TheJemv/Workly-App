import { getAuth, signOut } from "@react-native-firebase/auth";

export const Singout = async () => {
   try {
      const auth = getAuth();
      await signOut(auth);
   } catch (e) {
      console.error("Error al cerrar sesión:", e);
      throw e;
   }
};