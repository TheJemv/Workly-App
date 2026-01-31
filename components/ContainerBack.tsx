import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
   children?: React.ReactNode;
}

const ContainerBack = ({ children }: Props) => {
   const router = useRouter();
   const handleBack = () => router.back();

   return (
      <SafeAreaView style={[styles.container, {
         marginTop: StatusBar.currentHeight
      }]}>
         <TouchableOpacity onPress={handleBack}>
            <View style={styles.backButton}>
               <Entypo name="chevron-left" color="#1E232C" size={24} />
            </View>
         </TouchableOpacity>
         {children}
      </SafeAreaView>
   );
};

export default ContainerBack;

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 18,
      marginHorizontal: 'auto',
      height: '100%',
      paddingVertical: 0,
   },
   backButton: {
      alignSelf: 'flex-start',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E8ECF4",
      padding: 4,
      marginStart: 6
   }
});