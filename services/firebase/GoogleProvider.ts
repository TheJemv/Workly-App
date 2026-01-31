import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";

export const GoogleProvider = async (response) => {
   try {
      if (response?.type === "success") {
         const { id_token } = response.params;

         // Crear credencial de Google
         const credential = GoogleAuthProvider.credential(id_token);

         // Autenticar con Firebase
         const auth = getAuth();
         const userCredential = await signInWithCredential(auth, credential);

         return userCredential.user;
      }

      throw new Error("Autenticación con Google cancelada");
   } catch (e) {
      console.error("Error en Google Sign-In:", e);
      throw new Error(e.message);
   }
};

export const ParamsAuthRequest = {
   iosClientId: "81676435520-oir4a14ftju450kbrjgsbv25b9b8p1i4.apps.googleusercontent.com",
   androidClientId: "81676435520-37qved3rrustfne6oop8pml5qid6vab0.apps.googleusercontent.com"
};