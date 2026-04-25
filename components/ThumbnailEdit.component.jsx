import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image"; // ✅ expo-image
import * as ImagePicker from "expo-image-picker";
import loadImageFile from "utils/loadImageFile";

const ThumnailEdit = ({ thumbnail, setThumbnail, getDataPhoto }) => {
   const handleImageService = async () => {
      try {
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], // ✅ mediaTypes en minúscula
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
         });
         if (result.canceled) return;
         const base64 = await loadImageFile(result.assets[0].uri)
         setThumbnail(result.assets[0].uri)
         getDataPhoto(base64)
      } catch (e) {
         Alert.alert("Error", e.message)
      }
   }

   return (
      <TouchableOpacity onPress={handleImageService} className="flex flex-col items-center">
         <View className="items-center justify-center" style={styles.imageBox}>
            <Image
               style={styles.image}
               source={{ uri: thumbnail }}
               contentFit="cover" // ✅ expo-image usa contentFit
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
      borderStyle: 'dashed',
      borderColor: '#364670'
   },
});

export default ThumnailEdit;