import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RevenueCatUI from 'react-native-purchases-ui';

const PaywallPresent = () => {
   const navigation = useNavigation();

   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, [])

   return (
      <View style={{ flex: 1, paddingBottom: 80}}>
         <RevenueCatUI.Paywall
            onDismiss={() => {
               console.log("Nice...")
            }}

            onPurchaseCompleted={() => {
               console.log("Purchase...")
            }}

            onPurchaseError={() => {
               console.log("Error...")
            }}
         />
      </View>
   );
}


export default PaywallPresent