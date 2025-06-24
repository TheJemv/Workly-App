import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "context/AuthContext";
import {
   useContext,
   useEffect,
   useLayoutEffect,
   useState,
   useRef,
} from "react";
import {
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   View,
   Image,
   Text,
   Linking,
   Alert,
} from "react-native";
import getValue from "utils/getValue";
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs";
import BottomSheet, {
   BottomSheetView,
   BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import {
   fetchOnboardingCompany,
   updateCompany,
} from "services/api/company.api";
import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";
import useGlobal from "core/globals";
import { updateOpeningHours } from "services/api/company.api";

const dayNames = {
   monday: "Lunes",
   tuesday: "Martes",
   wednesday: "Miércoles",
   thursday: "Jueves",
   friday: "Viernes",
   saturday: "Sábado",
   sunday: "Domingo",
};

const MAX_FILE_SIZE = 10485760; // 10 MB en bytes
const ScreenEdit = () => {
   const navigation = useNavigation();
   const route = useRoute();

   const companyData = useGlobal((state) => state.company);
   const reloadCompany = useGlobal((state) => state.companyReload);

   const Options = route.params;
   const [loadingImage, setLoadingImage] = useState(false);
   const [linkOnboarding, setLinkOnboarding] = useState(null);
   const { token } = useContext(AuthContext);
   const [currentImage, setCurrentImage] = useState(
      companyData?.profile?.photo
   );
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [loadingOpeningHour, setLoadingOpeningHour] = useState(false);
   const [openingHour, setOpeningHour] = useState(null);

   const bottomSheetRef = useRef(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Editar",
      });
   }, [navigation]);

   useEffect(() => {
      const fetchOnboarding = async () => {
         const data = await fetchOnboardingCompany(token);
         setLinkOnboarding(data?.url);
      };

      fetchOnboarding();
   }, []);

   const handleImage = async () => {
      setLoadingImage(true);
      try {
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
         });

         if (!result.canceled) {
            const fileSize = await getFileSize(result.assets[0].uri);
            if (fileSize >= MAX_FILE_SIZE) {
               Alert.alert("Error", "La foto no puede ser mayor de 10MB");
               return;
            }

            const base64 = await RNFS.readFile(result.assets[0].uri, "base64");
            const data = await updateCompany(token, {
               photo: base64,
            });

            setCurrentImage(data?.profile?.photo);
            await reloadCompany();
         }
      } catch (error) {
         Alert.alert(error.message);
      } finally {
         setLoadingImage(false);
      }
   };

   const getFileSize = async (uri) => {
      try {
         const response = await fetch(uri);
         const blob = await response.blob();
         return blob.size;
      } catch (error) {
         console.error("Error al obtener el tamaño del archivo:", error);
         return 0; // Si ocurre un error, asumimos un tamaño de archivo de 0
      }
   };

   const getValueOnOption = (key, title) => {
      if (key === "public") {
         return getValue(companyData, key) ? "Publica" : "Privada";
      }

      return getValue(companyData, key) ? getValue(companyData, key) : title;
   };

   const formatHour = (hour) => {
      const [h, m] = hour.split(":").map(Number);
      const period = h >= 12 ? "p.m." : "a.m.";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
   };

   const mask = (value) => {
      value = value.replace(/:|[a-zA-Z]/g, "");
      let totalCharactersInValue = value.length;
      if (totalCharactersInValue === 3) {
         return value.substr(0, 1) + ":" + value.substr(1);
      }
      if (totalCharactersInValue === 4) {
         return value.substr(0, 2) + ":" + value.substr(2);
      }
      return value;
   };

   const handleSelectOpeningHour = (day, data) => {
      setOpeningHour({
         day,
         data,
      });
      bottomSheetRef.current?.snapToIndex(0);
      setModalIsOpen(true);
   };

   const handleUpdateOpeningHours = async () => {
      if (!openingHour) return;
      setLoadingOpeningHour(true);
      try {
         companyData.profile.openingHours[openingHour.day] = openingHour.data;
         await updateOpeningHours(
            token,
            companyData.profile.id,
            companyData.profile.openingHours
         );
         bottomSheetRef.current?.close();
         setModalIsOpen(false);
         await reloadCompany();
      } catch (error) {
         Alert.alert("Error", error.message);
      } finally {
         setLoadingOpeningHour(false);
      }
   };

   return (
      <>
         <SafeAreaView
            style={{
               flex: 1,
               opacity: modalIsOpen ? 0.3 : 1,
            }}
            pointerEvents={modalIsOpen ? "none" : "auto"}
         >
            <ScrollView style={{ flex: 1 }}>
               <View className="flex flex-col flex-1 mb-20">
                  <TouchableOpacity
                     onPress={handleImage}
                     className="flex flex-col items-center justify-center border-black/20 border-b py-4"
                     style={{ gap: 12 }}
                  >
                     <View className="w-[120] rounded-full overflow-hidden bg-gray-200 h-[120] flex flex-col items-center justify-center">
                        {loadingImage ? (
                           <SpinLoading
                              size={32}
                              color={Colors.principal.DEFAULT}
                           />
                        ) : (
                           <Image
                              style={{ width: "100%", height: "100%" }}
                              className="rounded-full"
                              source={{ uri: currentImage }}
                           />
                        )}
                     </View>
                     <Text>Cambiar foto</Text>
                  </TouchableOpacity>

                  {Object.entries(Options).map(([index, { title, key }]) => (
                     <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(title)}
                        className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b"
                        style={{ gap: 12 }}
                     >
                        <Text
                           className="text-dark"
                           style={{ fontWeight: 600, fontSize: 15 }}
                        >
                           {title}
                        </Text>
                        <Text
                           className={
                              getValue(companyData, key) !== ""
                                 ? "text-dark/90"
                                 : "text-text/60"
                           }
                           numberOfLines={1}
                        >
                           {getValueOnOption(key, title)}
                        </Text>
                     </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                     onPress={() =>
                        Linking.openURL(linkOnboarding && linkOnboarding)
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b"
                     style={{ gap: 12 }}
                  >
                     <Text
                        className="text-dark"
                        style={{ fontWeight: 600, fontSize: 15 }}
                     >
                        Onboarding
                     </Text>
                     <Text className={"text-dark/90"} numberOfLines={1}>
                        {companyData.completed ? "Completado" : "Incompleto"}
                     </Text>
                  </TouchableOpacity>

                  <View className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b bg-gray-100">
                     <Text className="text-dark text-base font-bold">
                        Horarios
                     </Text>
                  </View>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "monday",
                           companyData.profile.openingHours.monday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Lunes
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.monday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.monday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "tuesday",
                           companyData.profile.openingHours.tuesday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Martes
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.tuesday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.tuesday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "wednesday",
                           companyData.profile.openingHours.wednesday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Miércoles
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.wednesday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.wednesday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "thursday",
                           companyData.profile.openingHours.thursday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Jueves
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.thursday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.thursday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "friday",
                           companyData.profile.openingHours.friday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Viernes
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.friday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.friday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "saturday",
                           companyData.profile.openingHours.saturday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Sábado
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.saturday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.saturday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() =>
                        handleSelectOpeningHour(
                           "sunday",
                           companyData.profile.openingHours.sunday
                        )
                     }
                     className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b gap-3"
                  >
                     <Text className="text-dark text-sm font-semibold">
                        Domingo
                     </Text>
                     <Text className="text-text" numberOfLines={1}>
                        {formatHour(
                           companyData.profile.openingHours.sunday.opensAt
                        )}{" "}
                        -{" "}
                        {formatHour(
                           companyData.profile.openingHours.sunday.closesAt
                        )}
                     </Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </SafeAreaView>
         <BottomSheet
            ref={bottomSheetRef}
            snapPoints={["40%"]}
            enablePanDownToClose={true}
            onClose={() => {
               setModalIsOpen(false);
            }}
            index={-1}
         >
            <BottomSheetView>
               <View className="flex flex-col gap-4 px-4 py-2">
                  <Text className="text-lg font-bold mb-2">
                     Editar horario (
                     {openingHour?.day && dayNames[openingHour.day]})
                  </Text>
                  <View className="flex flex-row items-center gap-2">
                     <Text className="w-20 text-base">Abre a:</Text>
                     <BottomSheetTextInput
                        style={{
                           flex: 1,
                           borderWidth: 1,
                           borderColor: "#d1d5db",
                           paddingHorizontal: 12,
                           paddingVertical: 8,
                           fontSize: 16,
                        }}
                        keyboardType="number-pad"
                        placeholder="08:00"
                        value={openingHour?.data?.opensAt || ""}
                        onChangeText={(text) =>
                           setOpeningHour((prev) => ({
                              ...prev,
                              data: {
                                 ...prev.data,
                                 opensAt: mask(text),
                              },
                           }))
                        }
                        maxLength={5}
                     />
                  </View>
                  <View className="flex flex-row items-center gap-2">
                     <Text className="w-20 text-base">Cierra a:</Text>
                     <BottomSheetTextInput
                        style={{
                           flex: 1,
                           borderWidth: 1,
                           borderColor: "#d1d5db",
                           paddingHorizontal: 12,
                           paddingVertical: 8,
                           fontSize: 16,
                        }}
                        keyboardType="number-pad"
                        placeholder="08:00"
                        value={openingHour?.data?.closesAt || ""}
                        onChangeText={(text) =>
                           setOpeningHour((prev) => ({
                              ...prev,
                              data: {
                                 ...prev.data,
                                 closesAt: mask(text),
                              },
                           }))
                        }
                        maxLength={5}
                     />
                  </View>
                  <TouchableOpacity
                     className="bg-gray-800 rounded py-3 mt-4"
                     onPress={handleUpdateOpeningHours}
                     disabled={loadingOpeningHour}
                  >
                     <Text className="text-white text-center font-semibold text-base">
                        {loadingOpeningHour ? "Guardando..." : "Guardar"}
                     </Text>
                  </TouchableOpacity>
               </View>
            </BottomSheetView>
         </BottomSheet>
      </>
   );
};

export default ScreenEdit;
