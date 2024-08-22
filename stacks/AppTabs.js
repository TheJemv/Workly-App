import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { mainRoutes } from "@/constants/routes";
import { StackHome, StackChat, StackAccount, StackCompany } from "screens/app";
import { Colors } from "@/lib";
import { Animated, StyleSheet } from "react-native";
import { TabItem } from "@/components";
import { BlurView } from "expo-blur"

// Icons
import Ionicons from "@expo/vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native";

const Tabs = createBottomTabNavigator()
const AppTabs = () => {
   const AppTabsData = [{
      name: "StackHome",
      Component: StackHome,

      IconComponent: Ionicons,
      icon: "home",

      FocusIconComponent: Ionicons,
      focusIcon: "home",
   }, {
      name: "StackOrders",
      Component: StackChat,

      IconComponent: Ionicons,
      icon: "bag",

      FocusIconComponent: Ionicons,
      focusIcon: "bag",
   }, {
      name: "StackChat",
      Component: StackChat,

      IconComponent: Ionicons,
      icon: "chatbubble",

      FocusIconComponent: Ionicons,
      focusIcon: "chatbubble",
   }, {
      name: "StackCompany",
      Component: StackCompany,

      IconComponent: Ionicons,
      icon: "prism",

      FocusIconComponent: Ionicons,
      focusIcon: "prism",
   }, {
      name: "StackAccount",
      Component: StackAccount,

      IconComponent: Ionicons,
      icon: "settings",

      FocusIconComponent: Ionicons,
      focusIcon: "settings",
   }]

   return (
      <Animated.View style={{flex: 1}}>
         <Tabs.Navigator
            initialRouteName={mainRoutes.Home}
            sceneContainerStyle={{
               backgroundColor: Colors.transparent,
            }}

            screenOptions={() => {
               const navigation = useNavigation()
               return {
                  tabBarLabel: () => null,
                  headerShown: false,
                  tabBarBackground: () => (
                     <BlurView
                        intensity={40}
                        style={{
                           overflow: "hidden",
                           backgroundColor: "transparent",
                           ...StyleSheet.absoluteFillObject,
                        }}
                     />
                  ),
                  tabBarStyle: [
                     {
                        position: "absolute",
                        display: navigation?.getCurrentRoute()?.name === "UserChat" ? "none" : "flex",
                     },
                  ],
               }
            }}
         >
            {AppTabsData.map((data, index) => (
               <Tabs.Screen
                  key={index + 1}
                  name={data.name}
                  component={data.Component}
                  options={{
                     tabBarIcon: ({ focused }) => (
                        <TabItem
                           iconName={data.icon} focusName={data.focusIcon}
                           icon={data.IconComponent}
                           focusIcon={data.FocusIconComponent}
                           focused={focused}
                        />
                     ),
                  }}
               />
            ))}
         </Tabs.Navigator>
      </Animated.View>
   )
}


export default AppTabs