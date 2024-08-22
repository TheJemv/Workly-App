import { TouchableOpacity, FlatList, Text, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect } from "react"
import { HomeServicesData } from "@/data"

const ItemGrid = ({ data, index, navigation }) => {
   const { Icon: IconComponent, IconName, handle, label="label" } = data
   const colorStar = "#EABE3F"
   return (
      <TouchableOpacity
         onPress={() => navigation.navigate(`${data.label}screen`)}
         className="w-[110px] h-[110px] rounded-lg items-center justify-center"
         style={{
            gap: 6, borderWidth: 3,
            borderColor: index === 0 ? colorStar:"white",
            backgroundColor: index === 0 ? colorStar:"white",
         }}
      >
         <IconComponent color={index === 0 ? "white":"#354671"} size={32} name={IconName} />
         <Text className="capitalize" style={{ fontWeight: 600, color: index === 0 ? "white":"#444444" }}>{ label }</Text>
      </TouchableOpacity>
   )
}

const HomeScreen = () => {
   const navigation = useNavigation()
   useLayoutEffect(() => {
      navigation.setOptions({
         headerSearchBarOptions: {
            placeholder: "buscar...",
            hideWhenScrolling: false,
            alwaysShowSearchBar: true,
         },
         headerTitle: "Work It"
      })
   }, [navigation])

   return (
      <SafeAreaView>
         <FlatList
            numColumns={3}
            data={HomeServicesData}
            renderItem={({item, index}) => <ItemGrid key={index} index={index} data={item} navigation={navigation} />}
            columnWrapperStyle={{
               justifyContent: "center",
               flex: 1,
               paddingHorizontal: 12,
               paddingTop: 24,
               gap: 16,
            }}
            scrollEnabled={false}
         />
      </SafeAreaView>
   )
}

export default HomeScreen