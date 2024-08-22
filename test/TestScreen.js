import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Singout } from "../services/firebase/Singout"

const TestScreen = () => {
  const handleSingout = async () => {
    await Singout()
  }
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={handleSingout}>
          <Text>LogOut</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default TestScreen