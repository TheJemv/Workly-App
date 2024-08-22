import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { SafeAreaView, View } from "react-native"

const ContainerScreen = ({ children }) => {
   const bottomTab = useBottomTabBarHeight()
   return (
      <SafeAreaView style={{ flex: 1 }}>
         {children}
      </SafeAreaView>
   )
}

export default ContainerScreen