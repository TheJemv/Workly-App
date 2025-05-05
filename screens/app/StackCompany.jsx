import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScreenCompany from "./company"
import NativeStackOptions from "constants/NativeStackOptions";

import ScreenEdit from "./company/Edit.jsx";
import ScreenNewService from "./company/NewService"
import ScreenEditService from "./company/EditService"
import OptionScreen from "./company/Option";
import PaymentSubscription from "components/PaymentSubscription";
import PaywallPresent from "components/PaywallPresent";
import useGlobal from "core/globals";



const Stack = createNativeStackNavigator()
const StackCompany = () => {
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
   console.log('#Data', companyData)
   return (
      <Stack.Navigator initialRouteName="profile" screenOptions={NativeStackOptions}>
         <Stack.Screen initialParams={Options} name="edit" component={ScreenEdit} />
         <Stack.Screen name="profile" component={!companyData?.status ? PaywallPresent : ScreenCompany} />
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
   )
}

export default StackCompany