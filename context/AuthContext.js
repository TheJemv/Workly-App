import React, { createContext, useEffect, useState, useRef } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { customer as getCustomer } from "services/auth/customer";
import { getCompany } from "services/api/company.api";
import useGlobal from "core/globals";

const RETRY_DELAY = 3000;

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
   const { init, socketConnect } = useGlobal();

   const [user, setUser] = useState(null);
   const [token, setToken] = useState(null);
   const [customer, setCustomer] = useState(null);
   const [isCompany, setIsCompany] = useState(false);
   const [companyData, setCompanyData] = useState({});
   const [statusSubscription, setStatusSubscription] = useState(false);
   const [loading, setLoading] = useState(false);
   const [chatsUser, setChatsUser] = useState([]);

   const isFetchingDataRef = useRef(false);
   const isRetryingRef = useRef(false);
   const retryTimeoutRef = useRef(null);



   const resetState = () => {
      setUser(null);
      setToken(null);
      setCustomer(null);
      setIsCompany(false);
      setStatusSubscription(false);
   };


   const fetchData = async (user) => {
      setLoading(false)
      if (!user || isFetchingDataRef.current) {
         resetState();
         return;
      }

      isFetchingDataRef.current = true;
      try {
         const token = await user.getIdToken(true).then((token) => {
            setToken(token);
            return token
         }).catch(() => {
            throw new Error("Error para obtener el token.");
         });


         // const { accountType, statusSubscription } = await user.getIdTokenResult().claims;

         // console.log(accountType, statusSubscription)

         setUser(user);
         await getCustomer(token).then((user) => {
            setCustomer(user);
         }).catch(() => {
            throw new Error("Error al cargar el customer");
         });

         // if (accountType === "account") {
         //    await getCompany(token).then((data) => {
         //       setIsCompany(true);
         //       setCompanyData(data);
         //       setStatusSubscription(statusSubscription === "active");
         //    }).catch(async () => {
         //       setIsCompany(false);
         //       setCompanyData({});
         //       setStatusSubscription(false);
         //       await signOut(auth)
         //       throw new Error("Error al cargar la empresa");
         //    });
         // } else {
         //    setIsCompany(false);
         //    setCompanyData({});
         //    setStatusSubscription(false);
         // }

         await init();
         await socketConnect();

         setLoading(true);
         isRetryingRef.current = false;
      } catch (error) {
         if (!isRetryingRef.current) {
            isRetryingRef.current = true;
            retryTimeoutRef.current = setTimeout(() => {
               isRetryingRef.current = false;
               fetchData(user);
            }, RETRY_DELAY);
         }
      } finally {
         isFetchingDataRef.current = false;
      }
   };




   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
         setLoading(false);
         if (user) {
            await fetchData(user);
         } else {
            resetState();
            setLoading(true);
         }
      });

      return () => {
         unsubscribe();
         clearTimeout(retryTimeoutRef.current);
      };
   }, []);


   const reloadCompany = async () => {
      if (isCompany) {
         const companyData = await getCompany(token);
         setCompanyData(companyData);
      }
   };



   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            customer,
            isCompany,
            statusSubscription,
            companyData,
            loading,
            chatsUser,
            reloadCompany,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};