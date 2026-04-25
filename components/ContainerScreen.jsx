import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const ContainerScreen = ({ children }) => {
   return (
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
         {children}
      </SafeAreaView>
   )
}

export default ContainerScreen