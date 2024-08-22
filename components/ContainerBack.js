import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, TouchableOpacity } from 'react-native';

const ContainerBack = ({ children, navigation }) => {
   const handleBack = () => navigation.goBack();
   return (
      <SafeAreaView style={styles.container}>
         <TouchableOpacity onPress={handleBack}>
            <Entypo name="chevron-left" color="#040048" size={24} />
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
      width: '85%',
      marginHorizontal: 'auto',
      height: '100%',
      paddingVertical: 10,
   },
});
