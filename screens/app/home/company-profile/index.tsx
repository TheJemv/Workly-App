import {
   SafeAreaView,
   View,
   Text,
   StatusBar,
   Image,
   FlatList,
   Alert,
   ScrollView,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { TimesOpen } from "components/times-open";
import { CardService, handleCall, handleOpenLink } from "./components";
import { useEffect, useLayoutEffect, useState } from "react";
import { getByIdCompany } from "services/api/company.api";
import { Company as CompanyType } from "@/types/Company";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ButtonIconLink } from "./components/button-link";
import { Colors } from "lib";

type Props = { route: any };
const ProfileCompanyScreen = ({ route }: Props): JSX.Element => {
   const navigation = useNavigation();
   const [loading, setLoading] = useState<boolean>(false);
   const [company, setCompany] = useState<CompanyType | null>(null);

   const dataMedia: string[] = [
      "instagram",
      "facebook",
      "phone",
      "linkedin",
   ];

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            await getByIdCompany(route.params.id).then((data) => {
               setCompany(data.company);
               console.log("Company Data:", data.company);
            });
         } catch (error) {
            Alert.alert("Error", "Error al obtener la empresa");
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Workly",
      });
   }, [navigation, company]);

   return loading || !company ? (
      <View className="flex pb-[70px] h-full flex-col items-center justify-center">
         <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
      </View>
   ) : (
      <SafeAreaView
         className="flex-1"
         style={{
            marginTop: StatusBar.currentHeight,
         }}
      >
         <ScrollView
            className="flex-1 px-3 mb-0 space-y-5"
            style={{ marginBottom: useBottomTabBarHeight() - 34 }}
         >
            <View className="flex flex-col space-y-3">
               <View className="flex flex-row items-center space-x-3 w-full">
                  <View className="w-14 h-14 rounded-full bg-light/25">
                     <Image
                        className="w-full h-full rounded-full"
                        source={{
                           uri: company.profile.photo,
                        }}
                     />
                  </View>

                  <View className="flex flex-col space-y-1">
                     <View className="flex flex-row justify-between">
                        <Text className="text-base text-dark font-semibold">
                           {company.profile.name}
                        </Text>
                     </View>
                  </View>
               </View>

               <Text
                  className="text-base text-text font-medium"
                  numberOfLines={3}
               >
                  {company.profile.description}
               </Text>

               <View className="flex flex-col gap-0">
                  <View className="flex flex-row justify-center items-center space-x-6 pb-2">
                     {Object.entries(company.profile.contact).map(
                        ([key, value]) => {
                           if (dataMedia.includes(key) && value) {
                              return (
                                 <View key={key}>
                                    <ButtonIconLink
                                       icon={key as "facebook" | "linkedin" | "phone" | "instagram"}
                                       onPress={() =>
                                          key === "phone"
                                             ? handleCall(value as string)
                                             : handleOpenLink(value as string)
                                       }
                                    />
                                 </View>
                              )
                           }
                        }
                     )}
                  </View>

                  <TimesOpen businessHours={company.businessHours} />
               </View>
            </View>

            {/* Servicios que ofrece la empresa */}
            <FlatList
               data={company.services}
               contentContainerStyle={{
                  gap: 8,
                  paddingBottom: 16,
               }}
               ListHeaderComponent={() => (
                  <Text className="text-base text-dark font-semibold">
                     Servicios de la Empresa
                  </Text>
               )}
               renderItem={({ item }) => <CardService item={item} />}
               scrollEnabled={false}
            />
         </ScrollView>
      </SafeAreaView>
   );
};

export default ProfileCompanyScreen;
