import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuUH8hDtC0bjxT0dGi_0yrKv0X6oU4Nv4",
  authDomain: "workitapp-92de2.firebaseapp.com",
  projectId: "workitapp-92de2",
  storageBucket: "workitapp-92de2.appspot.com",
  messagingSenderId: "642547837410",
  appId: "1:642547837410:web:fd90994c1af998e47d71bb"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})