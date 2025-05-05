import { SafeAreaView, StatusBar } from "react-native"

const ContainerScreen = ({ children }) => {
   return (
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
         {children}
      </SafeAreaView>
   )
}

export default ContainerScreen