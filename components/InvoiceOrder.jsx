import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

function DetailInfo({ title, children }) {
   return (
      <View className="flex flex-row items-center space-x-1 py-0.5">
         <Text
            style={{ fontWeight: 600 }}
            className="text-[14px] text-primary font-semibold"
         >
            {title}
         </Text>
         <Text
            style={{ fontWeight: 400 }}
            className="text-[14px] text-text font-medium"
         >
            {children}
         </Text>
      </View>
   );
}

const InvoiceOrder = ({ data }) => {
   return (
      <View className='flex flex-col space-y-5'>
         <View className="flex flex-row items-center space-x-3">
            <FontAwesome
               name="user"
               size={20}
               color={Colors.principal.DEFAULT}
            />
            <Text className="text-base text-text font-medium">
               {data.name}
            </Text>
         </View>

         <View className="flex flex-row items-center space-x-3">
            <FontAwesome
               name="money"
               size={20}
               color={Colors.principal.DEFAULT}
            />
            <View className="flex flex-col">
               <DetailInfo title="RFC:">{data.rfc}</DetailInfo>
            </View>
         </View>

         <View className="flex flex-row items-baseline space-x-3">
            <FontAwesome
               name="home"
               size={20}
               color={Colors.principal.DEFAULT}
            />
            <View className="flex flex-col">
               <DetailInfo title="Calle:">{data.street}</DetailInfo>
               <DetailInfo title="Colonia o Fraccionamiento:">
                  {data.division}
               </DetailInfo>
               <DetailInfo title="No. Exterior:">
                  {data.number_ext}
               </DetailInfo>
               <DetailInfo title="No. Interior:">
                  {data.number_int}
               </DetailInfo>
               <DetailInfo title="C.P.">{data.cp}</DetailInfo>
               <DetailInfo title="Pais:">{data.country}</DetailInfo>
               <DetailInfo title="Estado:">{data.state}</DetailInfo>
               <DetailInfo title="Ciudad:">{data.city}</DetailInfo>
            </View>
         </View>
         <View className="flex flex-row items-center space-x-3">
            <FontAwesome
               name="phone"
               size={20}
               color={Colors.principal.DEFAULT}
            />
            <View className="flex flex-col space-y-1">
               <DetailInfo title="Tel.">{data.phone}</DetailInfo>
            </View>
         </View>
         {/* <View className="flex flex-row items-baseline space-x-3">
            <FontAwesome
               name="envelope"
               size={20}
               color={Colors.principal.DEFAULT}
            />
            <View className="flex flex-col">
               <DetailInfo title="Regimen fiscal:">
                  {data.tax_regime}
               </DetailInfo>
            </View>
         </View> */}
         <Text className="text-base text-text font-medium">{data.tax_regime}</Text>
      </View>
   );
}

export default InvoiceOrder;