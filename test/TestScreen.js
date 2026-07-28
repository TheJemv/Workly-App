import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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