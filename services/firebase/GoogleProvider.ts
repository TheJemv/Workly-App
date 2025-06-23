import auth, { GoogleAuthProvider } from "@react-native-firebase/auth";

export const GoogleProvider = (response) => {
   try {
      if (response?.type === "success") {
         const { id_token } = response.params;
         const credential = GoogleAuthProvider.credential(id_token);
         auth().signInWithCredential(credential);
      }
   } catch (e) {
      throw new Error(e.message);
   }
};

export const ParamsAuthRequest = {
   iosClientId:
      "81676435520-oir4a14ftju450kbrjgsbv25b9b8p1i4.apps.googleusercontent.com",
   androidClientId:
      "81676435520-37qved3rrustfne6oop8pml5qid6vab0.apps.googleusercontent.com",
};
