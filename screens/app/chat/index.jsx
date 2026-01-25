import { FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { ChatItem } from 'components';
import { useEffect, useLayoutEffect, useState } from 'react';
import { getMessages } from '@/services/api/getMessage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Colors } from 'lib';
import useGlobal from 'core/globals';

const ChatScreen = ({ navigation }) => {
   const { chats } = useGlobal()
   console.log("chats", chats)

   const bottomTab = useBottomTabBarHeight()
   const router = useNavigation()

   const [searchValue, setSearchValue] = useState('');

   useLayoutEffect(() => {
      router.setOptions({
         headerSearchBarOptions: {
            placeholder: 'buscar...',
            onChangeText: (event) => {
               setSearchValue(event.nativeEvent.text)
            }
         },
         headerRight: () => (
            <TouchableOpacity style={{ borderRadius: 50, padding: 0 }} onPress={() => navigation.navigate('Edit')}>
               <FontAwesome name='pencil-square-o' size={22} color={Colors.buttonColor} />
            </TouchableOpacity>
         ),
         headerTitle: "Chats"
      });
   }, [router])


   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
         style={{ flex: 1 }}
         keyboardVerticalOffset={50}
      >
         {chats.length > 0 && (
            <FlatList
               data={chats}
               renderItem={({ item }) => <ChatItem key={item.id} data={item} navigation={navigation} />}
               keyExtractor={item => item.id}
               contentContainerStyle={{
                  paddingBottom: bottomTab
               }}
            />
         )}
      </KeyboardAvoidingView>
   );
};

export default ChatScreen;
