import { loginModel } from "./model/login";
import { getAuth, signInWithEmailAndPassword } from "@react-native-firebase/auth";

const firebaseAuthErrors: Record<string, string> = {
   "auth/invalid-email": "El correo electrónico no es válido.",
   "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
   "auth/user-not-found": "No existe una cuenta con este correo.",
   "auth/wrong-password": "Contraseña incorrecta.",
   "auth/invalid-credential": "Correo o contraseña incorrectos.",
   "auth/too-many-requests": "Demasiados intentos fallidos. Intenta más tarde.",
   "auth/network-request-failed": "Sin conexión a internet. Verifica tu red.",
   "auth/email-already-in-use": "Este correo ya está registrado.",
   "auth/weak-password": "La contraseña debe tener al menos 8 caracteres.",
   "auth/operation-not-allowed": "Este método de inicio de sesión no está habilitado.",
};

export const getAuthErrorMessage = (code: string): string =>
   firebaseAuthErrors[code] ?? "Ocurrió un error inesperado. Intenta de nuevo.";

export const Singin = async (user: loginModel) => {
   try {
      const auth = getAuth();

      // 1) Login Firebase
      await signInWithEmailAndPassword(auth, user.email, user.password);
   } catch (e: any) {
      const message = getAuthErrorMessage(e?.code ?? "");
      throw new Error(message);
   }
};