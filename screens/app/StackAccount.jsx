import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NativeStackOptions from "constants/NativeStackOptions";

import AccountScreen from "./account";
import ProfileScreen from "./account/Profile";
import PaymentScreen from "./account/Payment";
import { InvoiceDataScreen } from "./account/invoice-data";
import { CreateInvoiceScreen } from "./account/invoice-data/create-invoice-data";
import { EditInvoiceScreen } from "./account/invoice-data/edit-invoice-data";
import { SupportScreen } from "./account/support";

const Stack = createNativeStackNavigator();
const StackAccount = () => {
   return (
      <Stack.Navigator screenOptions={NativeStackOptions}>
         <Stack.Screen
            name="Cuenta"
            options={{
               headerShown: false,
            }}
            component={AccountScreen}
         />

         <Stack.Screen name="Perfil" component={ProfileScreen} />
         {/* <Stack.Screen name="Registrate" component={RegisterScreen} /> */}

         <Stack.Screen name="Payment" component={PaymentScreen} />

         <Stack.Screen
            name="InvoiceData"
            component={InvoiceDataScreen}
         />
         <Stack.Screen
            name="CreateInvoice"
            component={CreateInvoiceScreen}
         />
         <Stack.Screen
            name="EditInvoice"
            component={EditInvoiceScreen}
         />
         <Stack.Screen
            name="Support"
            component={SupportScreen}
         />
      </Stack.Navigator>
   );
};

export default StackAccount;
