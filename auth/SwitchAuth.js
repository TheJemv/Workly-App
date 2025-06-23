import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AuthNavigator from "../stacks/AuthNavigator";
import AppTabs from "../stacks/AppTabs";
import { SafeAreaView, StatusBar, Text } from "react-native";
import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";
import useGlobal from "core/globals";
import { EmailPhoneVerified } from "components/EmailPhoneVerified";

const SwitchAuth = () => {
   const { user, loading } = useContext(AuthContext);
   const { customer, token } = useGlobal();

   return loading ? (
      user && token ? (
         user.emailVerified || user.phoneNumber ? (
            customer ? (
               <AppTabs />
            ) : (
               <SafeAreaView
                  className="flex flex-col items-center justify-center"
                  style={{ flex: 1, marginTop: StatusBar.currentHeight }}
               >
                  <SpinLoading size={62} color={Colors.principal.DEFAULT} />
                  <Text
                     style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        paddingBottom: 6,
                        color: Colors.principal.DEFAULT,
                     }}
                  >
                     Work It
                  </Text>
               </SafeAreaView>
            )
         ) : (
            <EmailPhoneVerified />
         )
      ) : (
         <AuthNavigator />
      )
   ) : (
      <SafeAreaView
         className="flex flex-col items-center justify-center"
         style={{ flex: 1, marginTop: StatusBar.currentHeight }}
      >
         <SpinLoading size={62} color={Colors.principal.DEFAULT} />
         <Text
            style={{
               textAlign: "center",
               fontSize: 20,
               fontWeight: 700,
               paddingBottom: 6,
               color: Colors.principal.DEFAULT,
            }}
         >
            Work It
         </Text>
      </SafeAreaView>
   );
};

export default SwitchAuth;
