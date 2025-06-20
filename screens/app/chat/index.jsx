import {
   View,
   Text,
   Image,
   FlatList,
   KeyboardAvoidingView,
   Platform,
   TouchableOpacity,
} from "react-native";
import { ChatItem } from "components";
import { useEffect, useLayoutEffect, useState } from "react";
import { getMessages } from "@/services/api/getMessage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import useGlobal from "core/globals";

const ChatScreen = ({ navigation }) => {
   const { chats } = useGlobal();

   const bottomTab = useBottomTabBarHeight();
   const router = useNavigation();

   const [searchValue, setSearchValue] = useState("");
   const [loader, setLoader] = useState(false);

   const [fakeChats, setFakeChats] = useState([]);
   const [searchChat, setSearchChat] = useState([]);

   useEffect(() => {
      setLoader(true);
      getMessages()
         .then((data) => {
            setFakeChats(
               data.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
               )
            );
            setLoader(false);
         })
         .catch((e) => {
            setLoader(true);
            throw new Error(e);
         });
   }, []);

   useLayoutEffect(() => {
      router.setOptions({
         headerSearchBarOptions: {
            placeholder: "buscar...",
            onChangeText: (event) => {
               setSearchValue(event.nativeEvent.text);
            },
         },
         headerRight: () => (
            <TouchableOpacity
               style={{ borderRadius: 50, padding: 0 }}
               onPress={() => navigation.navigate("Edit")}
            >
               <FontAwesome
                  name="pencil-square-o"
                  size={22}
                  color={Colors.buttonColor}
               />
            </TouchableOpacity>
         ),
         headerTitle: "Chats",
      });
   }, [router]);

   useEffect(() => {
      setLoader(true);
      getMessages()
         .then((data) => {
            if (!data) return;
            const filtered = data.filter((message) =>
               message.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setSearchChat(filtered);
            setLoader(false);
         })
         .catch((e) => {
            setLoader(true);
            throw new Error("Error en la busqueda...", e);
         });
   }, [searchValue]);

   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : undefined}
         style={{ flex: 1 }}
         keyboardVerticalOffset={50}
      >
         {chats.length > 0 ? (
            <FlatList
               data={chats}
               renderItem={({ item }) => (
                  <ChatItem key={item.id} data={item} navigation={navigation} />
               )}
               keyExtractor={(item) => item.id}
               contentContainerStyle={{
                  paddingBottom: bottomTab,
               }}
            />
         ) : (
            <View className="items-center mt-10">
               <Image
                  source={require("assets/empty-chats.png")}
                  className="w-[180px] h-[180px] mb-6"
                  resizeMode="contain"
               />
               <Text className="text-base text-gray-500 mb-4">
                  No tienes historial de chats
               </Text>
               <TouchableOpacity
                  className="bg-slate-800 py-3 px-8 rounded-lg"
                  onPress={() => navigation.navigate("home")}
               >
                  <Text className="text-white font-bold">Ir al inicio</Text>
               </TouchableOpacity>
            </View>
         )}
      </KeyboardAvoidingView>
   );
};

export default ChatScreen;
