import { Image, StyleSheet, Text, Pressable } from 'react-native';

const ChatItemSearch = ({ data }) => {
   return (
      <Pressable
         style={({ pressed }) => [
            {
               backgroundColor: pressed ? 'lightgray' : 'transparent',
            },
            styles.Button,
         ]}
      >
         <Image style={styles.Image} src={data.avatar} />
         <Text style={styles.Text} src={data.avatar}>{ data.name }</Text>
      </Pressable>
   );
};

const styles = StyleSheet.create({
    Button: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 4,
        alignItems: "center"
    },

    Image: {
        width: 30,
        height: 30,
        borderRadius: 50
    },
    Text: {
        flex: 1,
        borderRadius: 50
    }
})

export default ChatItemSearch