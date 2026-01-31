import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Padding } from '../lib';
import { formatMessageDate } from '../utils';
import { router } from 'expo-router';

const ChatItem = ({ data }) => {
   const handleItemPress = () => {
      router.push({
         pathname: "/(app)/chat",
         params: {
            data: JSON.stringify(data)
         }
      })
   };

   return (
      <Pressable
         onPress={handleItemPress}
         style={({ pressed }) => [
            {
               backgroundColor: pressed ? 'lightgray' : 'transparent',
            },
            styles.Container,
         ]}
      >
         <Image
            source={{ uri: data?.customers[0]?.profile?.photo }}
            style={{ backgroundColor: Colors.zinc[200], ...styles.Image }}
            resizeMode="cover"
         />

         <View style={styles.SemiContainer}>
            <View style={styles.SemiContainer.Top}>
               <Text
                  numberOfLines={1}
                  style={{
                     fontWeight: data.onView ? 900 : 700,
                     ...styles.SemiContainer.Top.Name,
                  }}
               >
                  {data?.customers[0]?.profile?.name}
               </Text>
               <Text style={styles.SemiContainer.Top.Time}>
                  {formatMessageDate(data?.messages[0]?.createdAt)}
               </Text>
            </View>
            <View
               style={styles.SemiContainer.Bottom}
            >
               <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                     color: data.onView ? Colors.gray[700] : Colors.gray[500],
                     fontWeight: data.onView ? 900 : 300,
                     ...styles.SemiContainer.Bottom.Message
                  }}
               >
                  {data?.messages[0]?.content}
               </Text>
               {data.onView && (
                  <View
                     style={styles.SemiContainer.Bottom.Notification}
                  />
               )}
            </View>
         </View>
      </Pressable>
   );
};

const styles = StyleSheet.create({
   Container: {
      display: 'flex',
      flexDirection: 'row',
      padding: Padding[2],
      gap: Padding[2],
   },
   Image: {
      borderRadius: 25,
      width: 50,
      height: 50,
   },
   SemiContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      justifyContent: 'center',

      Top: {
         display: 'flex',
         flexDirection: 'row',
         alignItems: 'center',
         gap: 12,

         Name: {
            color: Colors.principal.DEFAULT,
            fontSize: 16,
            flex: 1,
         },
         Time: {
            color: Colors.principal.DEFAULT,
            fontWeight: 400,
            fontSize: 12,
         },
      },
      Bottom: {
         flex: 1,
         display: 'flex',
         flexDirection: 'row',

         Message: {
            flex: 1,
         },

         Notification: {
            width: 12,
            height: 12,
            backgroundColor: Colors.blue.DEFAULT,
            borderRadius: 50,
            marginVertical: 'auto',
         }
      }
   },
});

export default ChatItem;
