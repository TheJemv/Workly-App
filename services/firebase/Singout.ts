import auth from "@react-native-firebase/auth";

export const Singout = async () => {
   try {
      await auth()
         .signOut()
         .catch((e) => {
            throw new Error(e);
         });
   } catch (e) {
      throw new Error(e.message);
   }
};
