import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import AuthNavigator from "../stacks/AuthNavigator"
import AppTabs from "../stacks/AppTabs"
import { SafeAreaView, Text } from "react-native"
import SpinLoading from "components/SpinLoading"
import { Colors } from "lib"

const SwitchAuth = () => {
   const { user, loading } = useContext(AuthContext)
   return (
      loading ? (
         user ? <AppTabs /> : <AuthNavigator />
      ):(
         <SafeAreaView className="flex flex-col items-center justify-center" style={{flex:1}}>
            <SpinLoading size={62} color={Colors.principal.DEFAULT} />
            <Text style={{textAlign:"center",fontSize:20,fontWeight:700,paddingBottom:6,color:Colors.principal.DEFAULT}}>Work It</Text>
         </SafeAreaView>
      )
   )
}

export default SwitchAuth