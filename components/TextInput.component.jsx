import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Colors } from 'lib'

const TextInputUser = ({ label = "TEST", placeholder = "TEST", value = "TEST", setValue, multiline = false, keyboardType = "default", maxLength = 52 }) => {
   return (
      <View className="flex flex-col" style={{ gap: 4 }}>
         <Text style={{
            color: Colors.principal.DEFAULT,
            fontSize: 14,
            fontWeight: 700,
         }}>{label}</Text>
         <TextInput
            placeholder={placeholder}
            className="py-2 px-2 rounded-lg border border-dark/10"
            maxLength={maxLength}
            value={value}
            placeholderTextColor={"#92929D"}
            onChangeText={setValue}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
         />
      </View>
   )
}

export default TextInputUser