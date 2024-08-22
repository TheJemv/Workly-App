import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Colors } from 'lib'

const TextInputUser = ({ label="TEST", placeholder="TEST", value="TEST", setValue }) => {
   return (
      <View className="flex flex-col" style={{gap:4}}>
         <Text style={{
            color: Colors.principal.DEFAULT,
            fontSize: 14,
            fontWeight: 700,
         }}>{label}</Text>
         <TextInput
            placeholder={placeholder}
            className="py-2 px-2 rounded-lg border border-dark/10"
            maxLength={52}
            value={value}
            placeholderTextColor={"#92929D"}
            onChangeText={setValue}
         />
      </View>
   )
}

export default TextInputUser