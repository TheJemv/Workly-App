import { getAuth, signOut } from "@react-native-firebase/auth";
import apiClient from "services/api/apiClient";
import { getExpoPushToken } from "services/auth/notifications";

export const Singout = async () => {
   try {
      const pushToken = await getExpoPushToken(); // 👈 mismo token que se guardó
      if (pushToken) {
         await apiClient.delete("/notifications/token", {
            data: { token: pushToken }
         });
      }
      await signOut(getAuth());
   } catch (e) {
      console.error("Error al cerrar sesión:", e);
      throw e;
   }
};