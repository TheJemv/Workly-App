import SpinLoading from "components/SpinLoading";
import useGlobal from "core/globals";
import { useEffect, useState } from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { fetchOnboardingCompany } from "services/api/company.api";

const ComponentOnboardingButton = () => {
   const token = useGlobal((state) => state.token);
   const [loading, setLoading] = useState(false);

   const handleOpenLink = async () => {
      try {
         setLoading(true);
         const data = await fetchOnboardingCompany(token);
         if (!data.url) {
            throw new Error("No se encontro el URL.");
         }

         Linking.openURL(data?.url);
      } catch (error) {
         Alert.alert("Error", error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <View className="mt-8">
         <TouchableOpacity
            onPress={handleOpenLink}
            className="items-center justify-center bg-primary border-0 py-3 mt-auto rounded-lg border-transparent"
         >
            {!loading ? (
               <Text className="text-white font-bold text-[16px]">
                  Onboarding
               </Text>
            ) : (
               <SpinLoading color="#fff" size={20} />
            )}
         </TouchableOpacity>
      </View>
   );
};

export default ComponentOnboardingButton;
