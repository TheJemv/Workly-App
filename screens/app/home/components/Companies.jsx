import {
   View,
   Text,
   FlatList
} from "react-native"
import CompanyItem from "./CompanyItem"

const Companies = () => {
   const data = [{
      id: "1",
      name: "Empresa 1",
      description: "Descripcion de la empresa 1",
      image: "https://via.placeholder.com/150",
   }, {
      id: "2",
      name: "Empresa 2",
      description: "Descripcion de la empresa 2",
      image: "https://via.placeholder.com/150",
   }, {
      id: "3",
      name: "Empresa 3",
      description: "Descripcion de la empresa 3",
      image: "https://via.placeholder.com/150",
   }]

   return (
      <View
         style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
         }}
      >
         <View
            style={{
               display: "flex",
               flexDirection: "column",
               gap: 2,
               paddingHorizontal: 12,
            }}
         >
            <Text className="text-dark" style={{fontSize:20,fontWeight:600}}>Empresas Recomendas</Text>
            <Text className="text-text">¡Estas son las empresas que workit te recomienda!</Text>
         </View>

         <FlatList
            renderItem={({ item, index }) => <CompanyItem item={item} key={index} />}
            keyExtractor={(item) => item.id}
            data={data}
            contentContainerStyle={{
               gap: 12,
               paddingHorizontal: 12,
               paddingVertical: 12,
               paddingBottom: 82,
            }}
         />
      </View>
   )
}

export default Companies