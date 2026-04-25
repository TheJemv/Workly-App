import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const TextInputComponent = ({
   value,
   onChangeText,
   placeholder = '',
   autoComplete = '',
   keyboardType = '',
   hide = false,
   label = '',           // 👈
   autoCapitalize = 'none', // 👈
}) => {
   const [viewPassword, setViewPassword] = useState(true);

   return (
      <View>
         {label ? <Text style={styles.label}>{label}</Text> : null}
         <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
               <TextInput
                  keyboardType={keyboardType}
                  autoCapitalize={autoCapitalize}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  style={styles.input}
                  value={value}
                  onChangeText={onChangeText}
                  secureTextEntry={hide && viewPassword}
               />
               {hide && (
                  <TouchableOpacity onPress={() => setViewPassword(!viewPassword)}>
                     <Feather
                        size={18}
                        style={{ marginVertical: 'auto' }}
                        name={viewPassword ? 'eye-off' : 'eye'}
                     />
                  </TouchableOpacity>
               )}
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   label: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1E232C',
      marginBottom: 4,
      marginLeft: 2,
   },
   input: {
      paddingVertical: 8,
      flex: 1,
   },
   container: {
      backgroundColor: "#F7F8F9",
      borderColor: "#DADADA",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
   }
});

export default TextInputComponent;