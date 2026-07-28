import { View, TouchableOpacity, Animated, TextInput } from 'react-native'
import { memo, useRef, useEffect, useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome"
import Feather from "@expo/vector-icons/Feather"

function useButtonBounce() {
    const scale = useRef(new Animated.Value(0)).current
    const show = useCallback(() => {
        scale.setValue(0)
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 200, mass: 0.6 }).start()
    }, [scale])
    return { scale, show }
}

const MessageInput = memo(({ message, setMessage, onSend, onShare, onFocus, modalIsOpen }: any) => {
    const insets = useSafeAreaInsets()
    const rotateAnim = useRef(new Animated.Value(0)).current
    const hasTrimmed = !!message.trim()
    const prevHasTrimmed = useRef(hasTrimmed)
    const sendButton = useButtonBounce()
    const shareButton = useButtonBounce()

    useEffect(() => { shareButton.show() }, [])
    useEffect(() => {
        if (hasTrimmed === prevHasTrimmed.current) return
        hasTrimmed ? sendButton.show() : shareButton.show()
        prevHasTrimmed.current = hasTrimmed
    }, [hasTrimmed])

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: modalIsOpen ? 1 : 0,
            duration: 150,
            useNativeDriver: true
        }).start()
    }, [modalIsOpen])

    const rotation = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-45deg"] })
    return (
        <View
            className="bg-gray-200 flex-row items-center pt-2.5"
            style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 18 }}
        >
            <TextInput
                placeholder="Mensaje..."
                placeholderTextColor='#909090'
                value={message}
                onChangeText={setMessage}
                onFocus={onFocus}
                className="flex-1 px-4 border border-gray-300 rounded-xl bg-white py-2 max-h-[60px]"
                multiline
            />
            {hasTrimmed ? (
                <TouchableOpacity onPress={onSend} className='pl-3'>
                    <Animated.View style={{ transform: [{ scale: sendButton.scale }] }}>
                        <FontAwesomeIcon name='paper-plane' size={28} color='#303040' />
                    </Animated.View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={onShare} className='pl-3'>
                    <Animated.View style={{ transform: [{ scale: shareButton.scale }, { rotate: rotation }] }}>
                        <Feather name='plus-circle' size={28} color='#303040' />
                    </Animated.View>
                </TouchableOpacity>
            )}
        </View>
    )
})

export default MessageInput