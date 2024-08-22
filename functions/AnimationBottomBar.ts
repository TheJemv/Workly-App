import { Animated } from "react-native"

export const AnimOut = (Anim: Animated.AnimatedValue) => {
   Animated.timing(Anim, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
   }).start()
}

export const AnimIn = (Anim: Animated.AnimatedValue) => {
   Animated.timing(Anim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
   }).start()
}