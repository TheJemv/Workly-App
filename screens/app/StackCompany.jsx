import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScreenCompany from "./company"
import NativeStackOptions from "constants/NativeStackOptions";

import ScreenEdit from "./company/Edit.jsx";
import ScreenNewService from "./company/NewService"
import ScreenEditService from "./company/EditService"
import OptionScreen from "./company/Option";
import PaywallPresent from "components/PaywallPresent";
import useGlobal from "core/globals";
import { getSubscriptionStatus } from "services/api/revenue-cat.api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContext";
import SpinLoading from "components/SpinLoading";



const Stack = createNativeStackNavigator()
const StackCompany = () => {
   const [subscription, setSubscription] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   const {user} = useContext(AuthContext)

   const Options = [{
      title: "Nombre",
      key: "name"
   }, {
      title: 'Descripcion',
      key: "description"
   }, {
      title: 'Facebook',
      key: "facebook"
   }, {
      title: 'Instagram',
      key: "instagram"
   }, {
      title: 'Linkedin',
      key: "linkedin"
   }, {
      title: 'Telefono',
      key: "phone"
   }, {
      title: 'Privacidad',
      key: "public"
   }]

   const companyData = useGlobal((state) => state.company)
   useEffect(() => {
      const controller = new AbortController()
      const fetchData = async () => {
         try {
            await getSubscriptionStatus(user.uid).then((data) => {
               setSubscription(data)
               console.log(new Date(subscription?.subscriber?.entitlements?.company?.expires_date) > new Date())
            })
         } catch (err) {
            setError("")
         } finally {
            setLoading(false)
         }
      }

      fetchData()
      return () => {
         controller.abort()
      }
   }, [])


   return (
      !loading ? (
         <Stack.Navigator initialRouteName="profile" screenOptions={NativeStackOptions}>
            <Stack.Screen initialParams={Options} name="edit" component={ScreenEdit} />
            <Stack.Screen name="profile" component={new Date(subscription?.subscriber?.entitlements?.company?.expires_date) > new Date() ? ScreenCompany : PaywallPresent } />
            <Stack.Screen name="newservice" component={ScreenNewService} />
            <Stack.Screen name="editservice" component={ScreenEditService} />

            <Stack.Group screenOptions={{
               headerBackTitleVisible: false
            }}>
               {Options.map((data, index) => (
                  <Stack.Screen component={OptionScreen} initialParams={data} name={data.title} key={index} />
               ))}
            </Stack.Group>
         </Stack.Navigator>
      ):(
         <SpinLoading size={48} />
      )
   )
}

export default StackCompany