import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScreenCompany from "./company"
import NativeStackOptions from "constants/NativeStackOptions";

import ScreenEdit from "./company/Edit.jsx";
import ScreenNewService from "./company/NewService"
import ScreenEditService from "./company/EditService"
import OptionScreen from "./company/Option";



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

   return (
      <Stack.Navigator screenOptions={NativeStackOptions}>
         <Stack.Screen name="profile" component={ScreenCompany} />
         <Stack.Screen initialParams={Options} name="edit" component={ScreenEdit} />
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