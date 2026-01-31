import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from 'lib';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ShareButton({ onPress }) {
    return (
        <TouchableOpacity className='flex ml-1 flex-col items-center justify-center' onPress={onPress}>
            <Ionicons name="share-social" size={26} color={Colors.principal.DEFAULT} />
        </TouchableOpacity>
    )
}