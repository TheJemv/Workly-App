import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

const TextInputComponent = ({
   value,
   onChangeText,
   placeholder = '',
   autoComplete = '',
   keyboardType = '',
   hide = false,
}) => {
   const [viewPassword, setViewPassword] = useState(true);
   return (
      <View style={styles.container}>
         <View
            style={{
               display: 'flex',
               flexDirection: 'row',
            }}
         >
            <TextInput
               keyboardType={keyboardType}
               autoCapitalize="none"
               autoComplete={autoComplete}
               placeholder={placeholder}
               style={styles.input}
               value={value}
               onChangeText={onChangeText}
               secureTextEntry={hide && viewPassword}
            />
            {hide && (
               <TouchableOpacity onPress={() => setViewPassword(!viewPassword)}>
                  {viewPassword ? (
                     <Feather
                        size={18}
                        style={{ marginVertical: 'auto' }}
                        name="eye-off"
                     />
                  ) : (
                     <Feather
                        size={18}
                        style={{ marginVertical: 'auto' }}
                        name="eye"
                     />
                  )}
               </TouchableOpacity>
            )}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
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
