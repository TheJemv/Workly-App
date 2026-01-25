import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScreenCompany from "./company";
import NativeStackOptions from "constants/NativeStackOptions";

import ScreenEdit from "./company/Edit.jsx";
import ScreenNewService from "./company/NewService";
import ScreenEditService from "./company/EditService";
import OptionScreen from "./company/Option";

import PaywallPresent from "components/PaywallPresent";
import useGlobal from "core/globals";
import { ScreenModal } from "./company/screens/Onboarding/screens";

import { ScheduleEdit, OnboardingScreen } from "./company/screens";

const Stack = createNativeStackNavigator();
const StackCompany = () => {
   const Options = [
      {
         title: "Nombre",
         key: "name",
      },
      {
         title: "Descripcion",
         key: "description",
      },
      {
         title: "Facebook",
         key: "facebook",
      },
      {
         title: "Instagram",
         key: "instagram",
      },
      {
         title: "Linkedin",
         key: "linkedin",
      },
      {
         title: "Telefono",
         key: "phone",
      },
      {
         title: "Privacidad",
         key: "public",
      },
   ];

   const companyData = useGlobal((state) => state.company);
   return (
      <Stack.Navigator
         initialRouteName="profile"
         screenOptions={NativeStackOptions}
      >
         <Stack.Screen
            initialParams={Options}
            name="edit"
            component={ScreenEdit}
         />
         <Stack.Screen
            name="profile"
            component={!companyData ? PaywallPresent : ScreenCompany}
         />
         <Stack.Screen name="newservice" component={ScreenNewService} />
         <Stack.Screen name="editservice" component={ScreenEditService} />

         <Stack.Group
            screenOptions={{
               headerBackTitleVisible: false,
            }}
         >
            {Options.map((data, index) => (
               <Stack.Screen
                  component={OptionScreen}
                  initialParams={data}
                  name={data.title}
                  key={index}
                  options={{
                     headerTitle: data.title
                  }}
               />
            ))}

            <Stack.Screen
               component={OnboardingScreen}
               name="OnboardingScreen"
            />

            <Stack.Screen
               name="ScheduleEdit"
               component={ScheduleEdit}
               options={{
                  headerTitle: "Horarios de Atención",
                  headerShown: true,
               }}
            />

            <Stack.Screen
               name="InformationVerify"
               component={ScreenModal}
               options={{
                  presentation: "modal",
                  headerShown: false,
               }}
            />
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default StackCompany;
