import { registerModel } from "./model/register";
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { getAuthErrorMessage } from "./Singin";

// ✅ Refleja exactamente tu config de Firebase
const validatePassword = (password: string): string | null => {
   if (password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
   if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula.';
   if (!/[a-z]/.test(password)) return 'La contraseña debe tener al menos una minúscula.';
   if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número.';
   return null;
};

const parseFirebasePasswordError = (message: string): string => {
   const missing: string[] = [];
   if (message.includes('MISSING_UPPERCASE')) missing.push('una mayúscula');
   if (message.includes('MISSING_LOWERCASE')) missing.push('una minúscula');
   if (message.includes('MISSING_NUMERIC')) missing.push('un número');
   if (message.includes('MISSING_SPECIAL')) missing.push('un carácter especial');
   if (message.includes('TOO_SHORT')) missing.push('mínimo 8 caracteres');
   if (missing.length === 0) return 'La contraseña no cumple los requisitos de seguridad.';
   return `La contraseña debe tener: ${missing.join(', ')}.`;
};

export const Register = async (user: registerModel) => {
   if (user.password !== user.confirmPassword) {
      throw new Error("Las contraseñas no coinciden.");
   }

   const passwordError = validatePassword(user.password);
   if (passwordError) {
      throw new Error(passwordError);
   }

   try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      return userCredential.user;
   } catch (e: any) {
      if (!e?.code) throw e;
      if (e.code === 'auth/password-does-not-meet-requirements') {
         throw new Error(parseFirebasePasswordError(e.message ?? ''));
      }
      throw new Error(getAuthErrorMessage(e.code));
   }
};