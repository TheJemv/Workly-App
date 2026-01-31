import React from 'react';
import { Colors } from '../lib';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Animated, Easing } from 'react-native';

export default function ({ color = Colors.principal.DEFAULT, size = 24 }) {
   const spinValue = new Animated.Value(0);

   Animated.loop(
      Animated.timing(spinValue, {
         toValue: 1,
         duration: 3000,
         easing: Easing.linear,
         useNativeDriver: true,
      }),
   ).start();

   const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
   });

   return (
      <Animated.View
         style={{ transform: [{ rotate: spin }], marginVertical: 'auto' }}
      >
         <AntDesign
            name="loading"
            color={color}
            style={{
               marginVertical: 'auto',
               marginHorizontal: 'auto',
            }}
            size={size}
         />
      </Animated.View>
   );
}
