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
   label = 'label',
}) => {
   const [viewPassword, setViewPassword] = useState(true);
   return (
      <View>
         <Text>{label}</Text>
         <View
            style={{
               display: 'flex',
               flexDirection: 'row',
               borderBottomWidth: 0.7,
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
});

export default TextInputComponent;
