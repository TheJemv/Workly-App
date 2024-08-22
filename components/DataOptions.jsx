import { TouchableOpacity, View, Text } from "react-native"

const DataOptions = ({ data=['publica', 'pirvada'], value, setValue}) => {
   return (
      <View className="flex flex-col">
         {data.map((data, index) => (
            <TouchableOpacity onPress={() => setValue(data)} className="border-black/20 border-b flex flex-row items-center justify-between px-3 py-4" key={index}>
               <Text className="text-dark capitalize" style={{fontSize: 15, fontWeight: 700}}>{data}</Text>
               <View className="w-4 h-4 rounded-full border-2 border-text flex items-center justify-center">
                  {value === data && (
                     <View className="w-2 h-2 rounded-full bg-text" />
                  )}
               </View>
            </TouchableOpacity>
         ))}
      </View>
   )
}

export default DataOptions