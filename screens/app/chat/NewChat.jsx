import { View, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect, useState } from "react"
import { Colors } from "lib"

const NewChatScreen = ({ navigation }) => {
   const router = useNavigation()

   const [searchValue, setSearchValue] = useState("")

   useLayoutEffect(() => {
      router.setOptions({
         headerSearchBarOptions: {
            placeholder: 'buscar...',
            onChangeText: (event) => {
               setSearchValue(event.nativeEvent.text)
            }
         },
         headerTitle: "Nuevo mensaje",
         headerLeft: () => (
            <TouchableOpacity>
               <Text style={{ color: Colors.buttonColor }}>Cancelar</Text>
            </TouchableOpacity>
         )
      });
   }, [router])

   return (
      <View style={{ flex: 1 }}>
         <Text>Hola mundo</Text>
      </View>
   )
}

export default NewChatScreen