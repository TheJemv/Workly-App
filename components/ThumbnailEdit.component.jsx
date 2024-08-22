import { Alert, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import loadImageFile from "utils/loadImageFile";


const ThumnailEdit = ({ thumbnail, setThumbnail, getDataPhoto }) => {
   const handleImageService = async () => {
      try {
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
         });
         if(result.canceled) return;
         const base64 = await loadImageFile(result.assets[0].uri)
         setThumbnail(result.assets[0].uri)
         getDataPhoto(base64)
      } catch(e) {
         Alert.alert("Error", e.message)
      }
   }

   return (
      <TouchableOpacity onPress={handleImageService} className="flex flex-col items-center">
         <View className="items-center justify-center" style={styles.imageBox}>
            <Image
               style={styles.image}
               source={{uri: thumbnail}}
               resizeMode="cover"
               width={110}
               height={110}
            />
         </View>
      </TouchableOpacity>
   )
};

const styles = StyleSheet.create({
   image: {
      width: 120,
      height: 120,
      borderRadius: 100,
   },
   imageBox: {
      width: 140,
      height: 140,
      borderRadius: 200,
      borderWidth: 4,
      display: 'flex',
      flexDirection: 'col',
      borderStyle: 'dashed',
      borderColor: '#364670'
   },
});

export default ThumnailEdit;