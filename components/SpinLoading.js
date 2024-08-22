import React from 'react';
import { Colors } from '../lib';
import AntDesing from 'react-native-vector-icons/AntDesign';
import { Animated, Easing } from 'react-native';

export default function ({ color, size }) {
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
         <AntDesing
            name="loading1"
            color={color ? color : Colors.white}
            style={{
               marginVertical: 'auto',
               marginHorizontal: 'auto',
            }}
            size={size ? size : 24}
         />
      </Animated.View>
   );
}
