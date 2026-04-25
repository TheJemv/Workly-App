import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from 'lib';
import Feather from '@expo/vector-icons/Feather';

export default function ShareButton({ onPress }) {
    return (
        <TouchableOpacity className='flex ml-1 flex-col items-center justify-center' onPress={onPress}>
            <Feather name="share" size={26} color={Colors.principal.DEFAULT} />
        </TouchableOpacity>
    )
}