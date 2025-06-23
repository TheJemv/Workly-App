import {
   useCallback,
   useContext,
   useEffect,
   useLayoutEffect,
   useRef,
   useState,
} from "react";
import {
   Alert,
   View,
   Text,
   SafeAreaView,
   InputAccessoryView,
   FlatList,
   TextInput,
   TouchableOpacity,
   Image,
   Platform,
   Pressable,
} from "react-native";

import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import useGlobal from "core/globals";
import { AuthContext } from "context/AuthContext";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import IonIcons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "lib";
import { useNavigation } from "@react-navigation/native";

function MessageHeader({
   friend = {
      photo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpixnio.com%2Ffree-images%2F2017%2F09%2F26%2F2017-09-26-07-22-55.jpg&f=1&nofb=1&ipt=4923b00e5b975ad061af58fac6903a8ca00e37790e7b205af1da4a278231d6b8&ipo=images",
      name: "Kira",
   },
   onOpenProfile,
}) {
   return (
      <TouchableOpacity
         style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
         }}
         onPress={onOpenProfile}
      >
         <Image
            source={{ uri: friend.photo }}
            style={{
               width: 30,
               height: 30,
               borderRadius: 20,
            }}
         />
         <Text
            style={{
               color: "#202020",
               marginLeft: 10,
               fontSize: 16,
               fontWeight: "bold",
            }}
         >
            {friend.name}
         </Text>
      </TouchableOpacity>
   );
}

function MessageBubbleFriend({ text = "", typing = false, positions }) {
   return (
      <View
         style={{
            flexDirection: "row",
            padding: 1,
            paddingLeft: 16,
         }}
      >
         {/* <Thumbnail
				url={friend.thumbnail}
				size={42}
			/> */}

         <View
            style={{
               backgroundColor: "#d0d2db",
               borderRadius: 20,
               maxWidth: "75%",
               paddingHorizontal: 16,
               paddingVertical: 12,
               justifyContent: "center",
               marginLeft: 8,
               minHeight: 42,

               borderBottomLeftRadius: positions.last ? 20 : 4,
               borderTopLeftRadius: positions.next ? 20 : 4,
            }}
         >
            {typing ? (
               <View style={{ flexDirection: "row" }}>
                  <MessageTypingAnimation offset={0} />
                  <MessageTypingAnimation offset={1} />
                  <MessageTypingAnimation offset={2} />
               </View>
            ) : (
               <Text
                  style={{
                     color: "#202020",
                     fontSize: 16,
                     lineHeight: 18,
                  }}
               >
                  {text}
               </Text>
            )}
         </View>
         <View style={{ flex: 1 }} />
      </View>
   );
}

function MessageLoadingBubble({ item }) {
   return (
      <View
         style={{
            flexDirection: "row",
            padding: 1,
            paddingLeft: 16,
         }}
      >
         <View style={{ flex: 1 }} />
         <View
            style={{
               backgroundColor: "#d0d2db",
               borderRadius: 20,
               maxWidth: "75%",
               paddingHorizontal: 16,
               paddingVertical: 12,
               justifyContent: "center",
               marginLeft: 8,
               minHeight: 42,
            }}
         >
            {/* <View style={{ flexDirection: 'row' }}>
					<MessageTypingAnimation offset={0} />
					<MessageTypingAnimation offset={1} />
					<MessageTypingAnimation offset={2} />
				</View> */}
         </View>
      </View>
   );
}

function MessageBubbleMe({ text, positions }) {
   return (
      <View
         style={{
            flexDirection: "row",
            padding: 1,
            paddingRight: 12,
         }}
      >
         <View style={{ flex: 1 }} />
         <View
            style={{
               backgroundColor: "#303040",
               borderRadius: 20,
               maxWidth: "75%",
               paddingHorizontal: 16,
               paddingVertical: 12,
               justifyContent: "center",
               marginRight: 8,
               minHeight: 42,
               borderBottomRightRadius: positions.last ? 4 : 20,
               borderTopRightRadius: positions.next ? 4 : 20,
            }}
         >
            <Text
               style={{
                  color: "white",
                  fontSize: 16,
                  lineHeight: 18,
               }}
            >
               {text}
            </Text>
         </View>
      </View>
   );
}

function MessageBubble({ message, chats }) {
   const { customer } = useContext(AuthContext);
   const index = chats.findIndex((chat) => chat.id === message.id);
   const positions = {
      last:
         chats[index - 1]?.customer?.customerId ===
         customer.customer?.customerId,
      next:
         chats[index + 1]?.customer?.customerId ===
         customer.customer?.customerId,
   };

   return message?.customer?.customerId === customer.customer?.customerId ? (
      <MessageBubbleMe positions={positions} text={message?.content} />
   ) : (
      <MessageBubbleFriend
         id={message.id}
         positions={positions}
         text={message?.content}
      />
   );
}

function ServiceBubble({ order }) {
   const navigation = useNavigation();
   return (
      <View className="flex flex-row items-center justify-center space-x-1 py-1">
         <Text className="text-text/80">Se ha solicitado una nueva orden</Text>
         <Pressable
            onPress={() => {
               navigation.navigate("StackOrders", {
                  screen: "TrackOrders",
                  params: {
                     data: order,
                  },
                  initial: false,
               });
            }}
         >
            <Text className="text-text/80 underline">Ver.</Text>
         </Pressable>
      </View>
   );
}

function MessageInput({ message, setMessage, onSend, functionShare }) {
   const insets = useSafeAreaInsets();
   return (
      <View
         style={{
            paddingHorizontal: 10,
            backgroundColor: "#eee",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 7,
            paddingBottom: insets.bottom,
            position: "relative",
            zIndex: 1,
         }}
      >
         <TouchableOpacity onPress={functionShare}>
            <FontAwesomeIcon
               name="paperclip"
               size={22}
               color={"#303040"}
               style={{
                  marginHorizontal: 12,
               }}
            />
         </TouchableOpacity>

         <TextInput
            placeholder="Message..."
            placeholderTextColor="#909090"
            value={message}
            onChangeText={setMessage}
            style={{
               flex: 1,
               paddingHorizontal: 18,
               borderWidth: 1,
               borderRadius: 12,
               borderColor: "#d0d0d0",
               backgroundColor: "white",
               paddingVertical: 8,
               maxHeight: 60,
            }}
            multiline
         />
         <TouchableOpacity onPress={onSend}>
            <FontAwesomeIcon
               name="paper-plane"
               size={22}
               color={"#303040"}
               style={{
                  marginHorizontal: 12,
               }}
            />
         </TouchableOpacity>
      </View>
   );
}

const UserChatScreen = ({ route, navigation }) => {
   // UseState
   const [page, setPage] = useState(0);
   const [loadingMessages, setLoadingMessages] = useState(false);

   // Variables
   const messagesNext = useGlobal((state) => state.messagesNext);
   const messagesList = useGlobal((state) => state.messagesList);

   // Funcions Globals
   const sendMessage = useGlobal((state) => state.sendMessage);
   const messageList = useGlobal((state) => state.messageList);

   // States
   const [message, setMessage] = useState("");
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [showProfile, setShowProfile] = useState(false);

   //	Ref
   const bottomSheetRef = useRef(null);

   //	Functions
   const handleSheetChanges = useCallback((index) => {
      console.log("handleSheetChanges", index);
   }, []);

   const handleShareModal = () => {
      bottomSheetRef.current?.snapToIndex(0);
      setModalIsOpen(true);
   };

   const handleCloseModal = () => {
      bottomSheetRef.current?.close();
   };

   const handleOpenProfile = () => {
      setShowProfile(true);
      bottomSheetRef.current?.snapToIndex(0);
      setModalIsOpen(true);
   };

   //	UseEffect
   useEffect(() => {
      if (loadingMessages) return;
      messageList(route.params.id, 0);
      setLoadingMessages(true);
   }, []);

   // UseLayoutEffect
   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: () => (
            <MessageHeader
               friend={route.params.customers[0].profile}
               onOpenProfile={handleOpenProfile}
            />
         ),
      });
   }, []);

   const onSend = () => {
      sendMessage(route.params.id, message, route.params.friend);
      setMessage("");
   };

   function onType(value) {
      setMessage(value);
      // messageType(friend.username)
   }

   const OptionsAttach = [
      {
         title: "Fotos",
         icon: "images",
      },
      {
         title: "Ubicacion",
         icon: "map",
      },
      {
         title: "Datos de Facturacion",
         icon: "albums",
      },
   ];
   return (
      <>
         <View
            style={{
               flex: 1,
               opacity: modalIsOpen ? 0.3 : 1,
               backgroundColor: modalIsOpen ? "#00000080" : "white",
            }}
         >
            <View
               style={{
                  flex: 1,
                  marginBottom: Platform.OS === "ios" ? 0 : 0,
               }}
            >
               <FlatList
                  onEndReached={() => {
                     if (messagesNext) {
                        messageList(route.params.id, page + 1);
                        setPage(page + 1);
                     }
                  }}
                  automaticallyAdjustKeyboardInsets={true}
                  contentContainerStyle={{
                     paddingTop: 10,
                  }}
                  data={messagesList ? messagesList : [1, 2, 3, 4, 5, 6]}
                  inverted={true}
                  keyExtractor={(item) => item.id ?? item}
                  renderItem={({ item }) =>
                     messagesList ? (
                        item.type === "TEXT" ? (
                           <MessageBubble
                              message={item}
                              chats={messagesList}
                              key={item.id}
                           />
                        ) : item.type === "SERVICE" ? (
                           <ServiceBubble order={item?.order} key={item.id} />
                        ) : (
                           <Text>Error...</Text>
                        )
                     ) : (
                        <MessageLoadingBubble item={item} />
                     )
                  }
               />
            </View>

            <MessageInput
               functionShare={handleShareModal}
               message={message}
               setMessage={onType}
               onSend={onSend}
            />
         </View>
         <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["40%"]}
            enablePanDownToClose={true}
            onClose={() => {
               setModalIsOpen(false);
               setShowProfile(false);
            }}
            index={-1}
         >
            <BottomSheetView>
               {showProfile ? (
                  <View className="flex items-center justify-center py-6">
                     <Image
                        source={{
                           uri: route.params.customers[0].profile.photo,
                        }}
                        className="w-24 h-24 rounded-full mb-4"
                     />
                     <Text className="text-lg font-bold text-text mb-1">
                        {route.params.customers[0].profile.name}
                     </Text>
                     <Text className="text-base text-text/70">
                        {route.params.customers[0].profile.email}
                     </Text>
                     <Text className="text-base text-text/90 font-medium mt-2">
                        {route.params.customers[0].profile.phone}
                     </Text>
                  </View>
               ) : (
                  <View
                     className="px-2 flex items-center flex-col h-full"
                     style={{ gap: 12 }}
                  >
                     {OptionsAttach.map((option, index) => (
                        <TouchableOpacity
                           key={index}
                           style={{ gap: 12 }}
                           className="w-full flex flex-row items-center"
                        >
                           <View className="p-2 bg-[black]/30 rounded-full">
                              <IonIcons
                                 name={option.icon}
                                 size={24}
                                 color="white"
                              />
                           </View>
                           <Text
                              style={{
                                 fontSize: 16,
                              }}
                              className="text-text"
                           >
                              {option.title}
                           </Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               )}
            </BottomSheetView>
         </BottomSheet>
      </>
   );
};

export default UserChatScreen;
