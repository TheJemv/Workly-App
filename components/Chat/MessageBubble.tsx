import { View, Text } from 'react-native'
import { memo } from 'react'
import Feather from "@expo/vector-icons/Feather"

export const MessageBubbleFriend = memo(({ text, positions }: any) => (
    <View className="flex-row py-0.5 pl-2">
        <View className="bg-[#f0f0f0] max-w-[75%] px-4 justify-center min-h-[42px]" style={{
            borderRadius: positions.next && positions.last ? 48 : 16,

            borderBottomLeftRadius: positions.next && positions.last ? 48 : positions.last ? 16 : 4,
            borderTopLeftRadius: positions.last && positions.next ? 48 : positions.next ? 16 : 4,
        }}>
            <Text className="text-dark text-base leading-[18px]">{text}</Text>
        </View>
        <View className="flex-1" />
    </View>
))

export const MessageBubbleMe = memo(({ text, positions, isTemp }: any) => (
    <View className="flex-row py-0.5 px-2">
        <View className="flex-1" />
        <View className="max-w-[75%] flex flex-row">
            {isTemp && (
                <View className="flex-row justify-end pr-1 mt-auto">
                    <Feather name="clock" size={10} color="#909090" />
                </View>
            )}
            <View style={{
                backgroundColor: '#303040',
                opacity: isTemp ? 0.5 : 1,
                borderRadius: positions.next && positions.last ? 48 : 16,

                borderTopRightRadius: positions.next && positions.last ? 48 : positions.next ? 16 : 4,
                borderBottomRightRadius: positions.last && positions.next ? 48 : positions.last ? 16 : 4,

                paddingHorizontal: 12,
                paddingVertical: 12,
                minHeight: 42,
                justifyContent: 'center',
            }}>
                <Text className="text-white text-base leading-[18px]">{text}</Text>
            </View>
        </View>
    </View>
))