import { createNativeStackNavigator } from "@react-navigation/native-stack"
import NativeStackOptions from "constants/NativeStackOptions"

// Screens
import ChatScreen from "./chat"
import NewChatScreen from "./chat/NewChat"
import UserChatScreen from "./chat/UserChat"

const Stack = createNativeStackNavigator()
const StackChat = () => {
   return (
      <Stack.Navigator screenOptions={NativeStackOptions} >
         <Stack.Screen name="Chat" component={ChatScreen} />
         <Stack.Screen name="Edit" component={NewChatScreen}
            options={{
               presentation: "modal"
            }}
         />
         <Stack.Screen
            name="UserChat"
            component={UserChatScreen}
         />
      </Stack.Navigator>
   )
}

export default StackChat