import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { mainRoutes } from "@/constants/routes";
import {
   StackHome,
   StackChat,
   StackAccount,
   StackCompany,
   StackOrders,
} from "screens/app";
import { Colors } from "lib";
import { Animated, StyleSheet, Platform } from "react-native";
import { TabItem } from "@/components";
import { BlurView } from "expo-blur";

// Icons
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Tabs = createBottomTabNavigator();
const AppTabs = () => {
   const AppTabsData = [
      {
         name: "StackHome",
         Component: StackHome,

         IconComponent: Ionicons,
         icon: "home",

         FocusIconComponent: Ionicons,
         focusIcon: "home",
      },
      {
         name: "StackOrders",
         Component: StackOrders,

         IconComponent: Ionicons,
         icon: "bag",

         FocusIconComponent: Ionicons,
         focusIcon: "bag",
      },
      {
         name: "StackChat",
         Component: StackChat,

         IconComponent: Ionicons,
         icon: "chatbubble",

         FocusIconComponent: Ionicons,
         focusIcon: "chatbubble",
      },
      {
         name: "StackCompany",
         Component: StackCompany,

         IconComponent: Ionicons,
         icon: "prism",

         FocusIconComponent: Ionicons,
         focusIcon: "prism",
      },
      {
         name: "StackAccount",
         Component: StackAccount,

         IconComponent: Ionicons,
         icon: "settings",

         FocusIconComponent: Ionicons,
         focusIcon: "settings",
      },
   ];

   return (
      <Animated.View style={{ flex: 1 }}>
         <Tabs.Navigator
            initialRouteName={mainRoutes.Home}
            sceneContainerStyle={{
               backgroundColor: Colors.transparent,
            }}
            screenOptions={() => {
               const navigation = useNavigation();
               return {
                  tabBarLabel: () => null,
                  headerShown: false,
                  tabBarBackground: () => (
                     <BlurView
                        intensity={Platform.OS === 'android' ? 80 : 40}
                        style={{
                           backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                           ...StyleSheet.absoluteFillObject,
                           height: 80,
                        }}
                        tint="light"
                     />
                  ),
                  tabBarStyle: [
                     {
                        position: "absolute",
                        // display: navigation?.getCurrentRoute()?.name === "UserChat" ? "none": "flex",
                        height: navigation?.getCurrentRoute()?.name === "UserChat" ? 0 : 80,
                        opacity: navigation?.getCurrentRoute()?.name === "UserChat" ? 0 : 1,
                     },
                  ],
               };
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
                           iconName={data.icon}
                           focusName={data.focusIcon}
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
   );
};

export default AppTabs;
