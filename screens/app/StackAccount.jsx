import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NativeStackOptions from "constants/NativeStackOptions"

import AccountScreen from "./account"
import ProfileScreen from "./account/Profile"
import PaymentScreen from "./account/Payment"

const Stack = createNativeStackNavigator()
const StackAccount = () => {
   return (
      <Stack.Navigator screenOptions={NativeStackOptions} >
         <Stack.Screen name="Cuenta" options={{
            headerShown: false,
         }} component={AccountScreen} />

         <Stack.Screen name="Perfil" component={ProfileScreen} />
         {/* <Stack.Screen name="Registrate" component={RegisterScreen} /> */}

         <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
   )
}

export default StackAccount