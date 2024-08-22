import { TouchableOpacity, View, Text } from "react-native"
import { Colors } from "lib"

const ItemCreditCard = ({ data, onPress, currentCard }) => (
   <TouchableOpacity onPress={onPress && onPress} style={{gap: 32}} className="rounded-lg overflow-hidden flex bg-white flex-col py-3 px-5">
      <View className="flex flex-row w-full items-center justify-between" style={{gap: 6}}>
         <Text className="text-dark" style={{ fontSize: 18, fontWeight: 600 }}>{data?.type}</Text>
         <View className="rounded-full overflow-hidden p-[2]" style={{ width: 16, height: 16, borderWidth: 1, borderColor: Colors.principal.DEFAULT }}>
            {currentCard && (
               <View style={{ backgroundColor: Colors.principal.DEFAULT }} className="w-full h-full rounded-full" />
            )}
         </View>
      </View>

      <View className="flex flex-col" style={{gap: 8}}>
         <Text className="uppercase text-text" style={{ fontSize: 12, fontWeight: 600 }}>Numero de tarjeta</Text>
         <Text className="uppercase text-dark" style={{ fontSize: 22, fontWeight: 800 }}>**** **** **** {data?.number}</Text>
      </View>

      <View className="flex flex-col" style={{gap: 8}}>
         <Text className="uppercase text-text" style={{ fontSize: 12, fontWeight: 600 }}>Fecha de expiracion</Text>
         <Text className="uppercase text-dark" style={{ fontSize: 14, fontWeight: 800 }}>{data?.expMonth}/{data?.expYear}</Text>
      </View>
   </TouchableOpacity>
)

export default ItemCreditCard