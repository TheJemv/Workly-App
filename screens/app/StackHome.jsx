import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NativeStackOptions from "@/constants/NativeStackOptions";

import { HomeServicesData } from "data";

// import HomeScreen from "./home"
import ServicesScreenCategory from "./home/ServicesCategory";
import ServiceHire from "./home/ServiceHire";
import { ProfileCompanyScreen } from "./profile-company";

const Stack = createNativeStackNavigator();
const StackHome = () => {
   return (
      <Stack.Navigator
         initialRouteName="home"
         screenOptions={NativeStackOptions}
      >
         <Stack.Screen
            name="home"
            component={ProfileCompanyScreen}
            options={{
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="service"
            component={ServiceHire}
            options={{
               headerTitle: "Contratar Servicio",
            }}
         />

         <Stack.Group>
            {HomeServicesData.map((data) => (
               <Stack.Screen
                  name={`${data.label}screen`}
                  i
                  initialParams={data}
                  component={ServicesScreenCategory}
                  options={{
                     headerTitle:
                        data.label.charAt(0).toUpperCase() +
                        data.label.slice(1),
                  }}
                  key={data.label}
               />
            ))}
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default StackHome;
