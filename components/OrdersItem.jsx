import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native"

const OrderItem = ({ data, navigation }) => {
   const handleItemPress = () => {
      navigation.navigate('OrderDetails', {
         orderId: data.id,
      });
   };
  
   return (
      <TouchableOpacity style={styles.shadow} onPress={handleItemPress} className="bg-white rounded-lg h-[82] items-center overflow-hidden flex flex-row">
         <Image
            source={{uri: data?.image}}
            style={styles.image}
            className="bg-theme-light"
         />
            
         <View className="flex-1 px-4" style={{gap: 6}}>
            <Text className="text-dark font-bold" numberOfLines={1}>{ data?.company }</Text>
            <View className="flex flex-row justify-between">
               <Text className="text-text">{ data?.name }</Text>
               <Text className="text-text">{ "Ayer" }</Text>
            </View>
         </View>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   image: {
      height: '100%', // Ancho de la imagen al 100% del ancho del contenedor
      aspectRatio: 1, // Mantener la relación de aspecto de 1:1 para que sea un cuadrado
   },
   shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
   }
});

export default OrderItem