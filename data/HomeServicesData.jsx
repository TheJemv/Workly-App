// Icons
import Octicons from "@expo/vector-icons/Octicons"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Entypo from "@expo/vector-icons/Entypo"
import Ionicons from "@expo/vector-icons/Ionicons"


// Data
const HomeServicesData = [{                  // Row 1
   Icon: Ionicons,
   IconName: "star",
   handle: () => console.log("Leyes"),
   label: "populares"
}, {
   Icon: FontAwesome6,
   IconName: "hammer",
   handle: () => console.log("USER"),
   label: "oficios"
}, {
   Icon: FontAwesome,
   IconName: "heartbeat",
   handle: () => console.log("USER"),
   label: "medicina"
}, {                                         // Row 2
   Icon: FontAwesome5,
   IconName: "theater-masks",
   handle: () => console.log("USER"),
   label: "recreacion"
}, {
   Icon: FontAwesome5,
   IconName: "building",
   handle: () => console.log("USER"),
   label: "construccion"
}, {
   Icon: MaterialCommunityIcons,
   IconName: "finance",
   handle: () => console.log("USER"),
   label: "marketing"
}, {                                         // Row 3
   Icon: Octicons,
   IconName: "law",
   handle: () => console.log("Leyes"),
   label: "leyes"
}, {
   Icon: Entypo,
   IconName: "graduation-cap",
   handle: () => console.log("USER"),
   label: "educacion"
}, {
   Icon: FontAwesome6,
   IconName: "utensils",
   handle: () => console.log("USER"),
   label: "gastronomia"
}, {                                         // Row 4
   Icon: Entypo,
   IconName: "code",
   handle: () => console.log("USER"),
   label: "programacion"
}, {
   Icon: MaterialIcons,
   IconName: "attach-money",
   handle: () => console.log("USER"),
   label: "finanzas"
}, {
   Icon: FontAwesome6,
   IconName: "gas-pump",
   handle: () => console.log("USER"),
   label: "servicios"
}]


export default HomeServicesData