import { View, Text, Image, Pressable, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { AuthContext } from 'context/AuthContext'
import useGlobal from 'core/globals'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-gesture-handler'
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome"
import { BlurView } from 'expo-blur'
import Feather from "@expo/vector-icons/Feather"


function MessageHeader({ friend }) {
    return (
        <View className="flex-1 flex-row items-center">
            <Image
                source={{ uri: friend?.photo }}
                className="w-8 h-8 rounded-full"
            />
            <Text className="text-dark ml-2.5 text-base font-bold">
                {friend?.name || 'Usuario'}
            </Text>
        </View>
    )
}

function MessageBubbleFriend({ text, positions }) {
    return (
        <View className="flex-row p-0.5 pl-4">
            <View
                className="bg-gray-300 max-w-[75%] px-4 py-3 justify-center ml-2 min-h-[42px]"
                style={{
                    borderRadius: 20,
                    borderBottomLeftRadius: positions.last ? 20 : 4,
                    borderTopLeftRadius: positions.next ? 20 : 4,
                }}
            >
                <Text className="text-dark text-base leading-[18px]">
                    {text}
                </Text>
            </View>
            <View className="flex-1" />
        </View>
    )
}

function MessageBubbleMe({ text, positions }) {
    return (
        <View className="flex-row p-0.5 pr-3">
            <View className="flex-1" />
            <View
                className="bg-[#303040] max-w-[75%] px-4 py-3 justify-center mr-2 min-h-[42px]"
                style={{
                    borderRadius: 20,
                    borderBottomRightRadius: positions.last ? 4 : 20,
                    borderTopRightRadius: positions.next ? 4 : 20,
                }}
            >
                <Text className="text-white text-base leading-[18px]">
                    {text}
                </Text>
            </View>
        </View>
    )
}

function MessageBubble({ message, chats, customerId }) {
    const index = chats.findIndex(chat => chat.id === message.id)
    const positions = {
        last: chats[index - 1]?.customer?.customerId === customerId,
        next: chats[index + 1]?.customer?.customerId === customerId
    }

    const isMe = message?.customer?.customerId === customerId

    return isMe ? (
        <MessageBubbleMe positions={positions} text={message?.content} />
    ) : (
        <MessageBubbleFriend positions={positions} text={message?.content} />
    )
}

function ServiceBubble({ order }) {
    return (
        <View className="flex flex-row items-center justify-center space-x-1 py-1">
            <Text className="text-text/80">Se ha solicitado una nueva orden</Text>
            <Pressable onPress={() => {
                router.push({
                    pathname: `/(app)/(tabs)/(orders)/order`,
                    params: order
                })
            }}>
                <Text className="text-text/80 underline">Ver.</Text>
            </Pressable>
        </View>
    )
}

const AnimatedFeather = Animated.createAnimatedComponent(Feather);
function MessageInput({ message, setMessage, onSend, onShare, modalIsOpen }) {
    const insets = useSafeAreaInsets()
    const rotateAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: modalIsOpen ? 1 : 0,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [modalIsOpen]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-45deg"], // Usa strings con 'deg'
    });

    return (
        <View
            className="bg-gray-200 flex-row items-center py-2"
            style={{ paddingBottom: insets.bottom, gap: 12, paddingHorizontal: 18 }}
        >
            <View>
                <TouchableOpacity onPress={onShare}>
                    <AnimatedFeather
                        name='plus-circle'
                        size={24}
                        color={'#303040'}
                        style={{
                            transform: [{ rotate: rotation }]
                        }}
                    />
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Mensaje..."
                placeholderTextColor='#909090'
                value={message}
                onChangeText={setMessage}
                className="flex-1 px-4 border border-gray-300 rounded-xl bg-white py-2 max-h-[60px]"
                multiline
            />

            <TouchableOpacity onPress={onSend} disabled={!message.trim()}>
                <FontAwesomeIcon
                    name='paper-plane'
                    size={22}
                    color={message.trim() ? '#303040' : '#d0d0d0'}
                />
            </TouchableOpacity>
        </View>
    )
}

function EmptyState() {
    return (
        <View className="w-full flex items-center py-32">
            <Image
                source={require("assets/ChatImage.png")}
                className="w-[220px] h-[220px]"
                resizeMode="contain"
            />
            <View className="flex flex-col items-center px-8 gap-y-1">
                <Text className="text-dark text-lg font-semibold">
                    Envía y recibe mensajes
                </Text>
                <Text className="text-text text-center mt-2">
                    Chatea con tus clientes de manera fácil y rápida a través de nuestra plataforma.
                </Text>
            </View>
        </View>
    )
}

function LoadingBubble() {
    return (
        <View className="flex-row p-0.5 pl-4">
            <View className="flex-1" />
            <View className="bg-gray-300 rounded-2xl max-w-[75%] px-4 py-3 ml-2 min-h-[42px]" />
        </View>
    )
}

export default function Chat() {
    const navigation = useNavigation()
    const params = useLocalSearchParams()
    const { customer } = useContext(AuthContext)

    //  Parse conversation data
    const conversation = params.data ? JSON.parse(params.data as string) : null

    //  Global State
    const messagesNext = useGlobal(state => state.messagesNext)
    const messagesList = useGlobal(state => state.messagesList)
    const sendMessage = useGlobal(state => state.sendMessage)
    const messageList = useGlobal(state => state.messageList)

    //  Local State
    const [message, setMessage] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    // Error handling
    if (!conversation) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">Error: No se encontró la conversación</Text>
            </View>
        )
    }

    // Load messages
    useEffect(() => {
        if (isLoading || !conversation?.id) return
        messageList(conversation.id, 0)
        setIsLoading(true)
    }, [conversation?.id])

    // Set header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <MessageHeader friend={conversation.customers?.[0]?.profile} />
            )
        })
    }, [conversation])

    // Handlers
    const handleSend = useCallback(() => {
        const cleanedMessage = message.trim()
        if (!cleanedMessage || !conversation?.id) return

        sendMessage(conversation.id, cleanedMessage, conversation.customers?.[0])
        setMessage('')
    }, [message, conversation, sendMessage])

    const handleShare = useCallback(() => {
        setModalIsOpen(!modalIsOpen)
    }, [modalIsOpen])

    const handleLoadMore = useCallback(() => {
        if (messagesNext && conversation?.id) {
            messageList(conversation.id, page + 1)
            setPage(prev => prev + 1)
        }
    }, [messagesNext, conversation?.id, page, messageList])

    // Render message item
    const renderMessage = useCallback(({ item }) => {
        if (!messagesList) return <LoadingBubble />

        switch (item.type) {
            case "TEXT":
                return (
                    <MessageBubble
                        message={item}
                        chats={messagesList}
                        customerId={customer?.customer?.customerId}
                    />
                )
            case "SERVICE":
                return <ServiceBubble order={item?.order} />
            default:
                return <Text className="text-center text-red-500">Tipo de mensaje no soportado</Text>
        }
    }, [messagesList, customer])

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >

            <View className='flex-1'>
                <FlatList
                    data={messagesList || Array(6).fill(null).map((_, i) => ({ id: i }))}
                    inverted
                    keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                    renderItem={renderMessage}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingTop: 10,
                    }}
                    ListFooterComponent={!messagesList ? EmptyState : null}
                    automaticallyAdjustKeyboardInsets={true}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={!modalIsOpen}
                />
                {modalIsOpen && (
                    <BlurView tint="dark" intensity={10} style={{ position: "absolute", left: 10, bottom: 10, zIndex: 20, borderRadius: 8, overflow: "hidden", display: "flex", padding: 8 }}>
                        <TouchableOpacity
                            className='flex flex-row items-center gap-2 p-1'
                            activeOpacity={0.7}
                        >
                            <Feather size={18} name='file-plus' />
                            <Text>Facturas</Text>
                        </TouchableOpacity>
                    </BlurView>
                )}
            </View>

            <MessageInput
                message={message}
                setMessage={setMessage}
                onSend={handleSend}
                onShare={handleShare}
                modalIsOpen={modalIsOpen}
            />
        </KeyboardAvoidingView>
    )
}