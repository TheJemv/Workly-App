import { FlatList, Text, View } from "react-native";
import { ServiceType } from "./types";
import { ServiceItem } from "./components";
import SpinLoading from "components/SpinLoading";

const ServicesTrending = ({ data }: { data?: ServiceType[] }) => {
   return (
      <View
         style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
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
            <Text
               className="text-dark"
               style={{ fontSize: 20, fontWeight: 600 }}
            >
               Populares
            </Text>
            <Text className="text-text">¡Los servicios mas vendidos!</Text>
         </View>

         {data.length === 0 ? (
            <View
               style={{
                  height: 160,
                  marginTop: 4,
                  marginBottom: 14,
                  elevation: 9,
               }}
            >
               <SpinLoading size={48} />
            </View>
         ) : (
            <FlatList
               renderItem={({ item, index }) => (
                  <ServiceItem item={item} key={index} />
               )}
               keyExtractor={(item) => item.id}
               horizontal={true}
               data={data}
               contentContainerStyle={{
                  paddingHorizontal: 12,
                  gap: 12,
                  flexGrow: 1,
                  paddingBottom: 14,
                  paddingTop: 8,
               }}
               scrollEnabled={true}
               showsHorizontalScrollIndicator={false}
            />
         )}
      </View>
   );
};

export default ServicesTrending;
