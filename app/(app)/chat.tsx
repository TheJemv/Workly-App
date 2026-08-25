import {
    View,
    Text,
    Pressable,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { AuthContext } from 'context/AuthContext'
import useGlobal from 'core/globals'
import { BlurView } from 'expo-blur'
import Feather from "@expo/vector-icons/Feather"
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated'

import { getBillings } from 'services/api/billing.api'
import { getLocations } from 'services/api/location.api'
import { getMessages } from 'services/api/rooms.api'

import { Colors } from 'lib'
import { Dropdown } from 'react-native-element-dropdown'
import MessageType from 'enum/MessageType'

import SpinLoading from 'components/SpinLoading'
import MessageHeader from 'components/Chat/MessageHeader'
import { MessageBubbleMe, MessageBubbleFriend } from 'components/Chat/MessageBubble'
import ServiceBubble from 'components/Chat/ServiceBubble'
import BillingBubble, { BillingSendView } from 'components/Chat/BillingBubble'
import LocationBubble, { LocationSendView } from 'components/Chat/LocationBubble'
import MessageInput from 'components/Chat/MessageInput'

import type { Message } from 'core/store/types'
import { formatDateSeparator, formatTimeOnly } from 'utils'

// Espacio vertical entre grupos de mensajes consecutivos de un mismo usuario
// (se aplica arriba del primer mensaje y abajo del último de cada grupo).
const GROUP_GAP = 18

// Cuánto se deslizan los mensajes a la izquierda al hacer swipe (estilo Instagram)
// para revelar la hora de cada uno pegada al borde derecho.
const SWIPE_REVEAL_WIDTH = 64

// Si pasa más de esto entre un mensaje y el siguiente, se muestra un separador
// de fecha/hora entre ellos (y ese mensaje reinicia su grupo visual, aunque sea
// del mismo usuario que el anterior).
const TIME_GAP_MS = 60 * 60 * 1000 // 1 hora

const dropdownStyle = {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(4,4,4,0.1)',
    backgroundColor: 'transparent',
}

const modalBackgroundStyle = {
    backgroundColor: "white",
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#b0aed720",
}

const sendButtonStyle = (loading: boolean) => ({
    backgroundColor: Colors.principal.DEFAULT,
    opacity: loading ? 0.7 : 1,
})

export default function Chat() {
    const navigation = useNavigation()
    const params = useLocalSearchParams()
    const { customer } = useContext(AuthContext)

    const roomId = useMemo(() => {
        if (params.roomId) return String(params.roomId)
        if (params.data) return JSON.parse(params.data as string).id
        return null
    }, [params])

    const uid = customer?.customer?.uid

    const chat = useGlobal(state => state.chats.find(c => c.id === roomId))
    const sendMessage = useGlobal(state => state.sendMessage)

    /**
     * Estado local de mensajes en DESC (nuevo -> viejo).
     * FlatList con inverted=true: index 0 aparece abajo (más nuevo).
     * Al subir se ven los viejos, onEndReached se dispara arriba.
     */
    const [messages, setMessages] = useState<Message[]>(() => [...(chat?.messages ?? [])].reverse())
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const loadingMoreRef = useRef(false)
    const lastBeforeIdRef = useRef<string | null>(null)
    const lastLoadMoreAtRef = useRef(0)
    const errorCooldownUntilRef = useRef(0)

    const [message, setMessage] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false)

    // Billing
    const [billings, setBillings] = useState([])
    const [billingsLoading, setBillingsLoading] = useState(false)
    const [billingsError, setBillingsError] = useState(false)
    const [selectedBilling, setSelectedBilling] = useState<any>(null)
    const [sendingBillingLoading, setSendingBillingLoading] = useState(false)
    const billingsModalRef = useRef<BottomSheetModal>(null)

    // Location
    const [locations, setLocations] = useState([])
    const [locationsLoading, setLocationsLoading] = useState(false)
    const [locationsError, setLocationsError] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<any>(null)
    const [sendingLocationLoading, setSendingLocationLoading] = useState(false)
    const locationModalRef = useRef<BottomSheetModal>(null)

    const snapPoints = useMemo(() => ["65%"], [])
    const closeMenu = useCallback(() => setModalIsOpen(false), [])

    // Swipe estilo Instagram: deslizar la lista hacia la izquierda mueve todos los
    // bubbles y revela la hora de cada uno pegada al borde derecho; al soltar,
    // regresa con un spring. Un solo shared value maneja TODA la lista (mismo
    // valor aplicado a cada fila), no hace falta uno por mensaje.
    const swipeX = useSharedValue(0)
    const bubbleSwipeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: swipeX.value }],
    }))
    const timeRevealStyle = useAnimatedStyle(() => ({
        opacity: interpolate(swipeX.value, [-SWIPE_REVEAL_WIDTH, -SWIPE_REVEAL_WIDTH * 0.4, 0], [1, 1, 0], Extrapolation.CLAMP),
    }))
    const panGesture = Gesture.Pan()
        // Solo se activa si el gesto es claramente horizontal hacia la izquierda;
        // si es más vertical, se lo cede al scroll normal del FlatList.
        .activeOffsetX([-15, 10000])
        .failOffsetY([-10, 10])
        .onUpdate((e) => {
            swipeX.value = Math.max(-SWIPE_REVEAL_WIDTH, Math.min(0, e.translationX))
        })
        .onEnd(() => {
            swipeX.value = withSpring(0, { damping: 20, stiffness: 220 })
        })

    const initializedRef = useRef(false)
    useEffect(() => {
        return () => {
            initializedRef.current = false
            setMessages([])
            setHasMore(true)
            setLoadingMore(false)
            loadingMoreRef.current = false
            lastBeforeIdRef.current = null
        }
    }, [])

    // Inicializar + sincronizar store
    useEffect(() => {
        const storeMessages = chat?.messages ?? []
        if (storeMessages.length === 0) return

        // Primera vez que llegan mensajes: inicializar
        if (!initializedRef.current) {
            initializedRef.current = true
            setMessages([...storeMessages].reverse())
            setHasMore(true)
            return
        }

        // Ya inicializado: sincronizar cambios (temporales + nuevos)
        setMessages(prev => {
            const replaced = prev.map(localMsg => {
                if (!localMsg.tempId) return localMsg
                // Match exacto por tempId resuelto. No usar "content" aquí: en billing/location
                // el optimista se crea con content:'' (el dato real vive en billing/location),
                // así que comparar por content nunca hacía match y el bubble gris se quedaba
                // pegado mientras el mensaje real entraba aparte (duplicado).
                const realMsg = storeMessages.find(s => s.resolvedTempId === localMsg.tempId)
                return realMsg ?? localMsg
            })

            const existingIds = new Set(replaced.map(m => m.id))
            const newOnes = storeMessages.filter(m => m?.id && !existingIds.has(m.id) && !m.tempId)
            if (newOnes.length === 0) return replaced
            return [...newOnes, ...replaced]
        })
    }, [chat?.messages])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <MessageHeader friend={chat?.customers?.find(c => c.uid !== uid) ?? null} />
        })
    }, [navigation, chat])

    const openBillings = useCallback(async () => {
        billingsModalRef.current?.present()
        setBillingsLoading(true)
        setBillingsError(false)
        try {
            const data = await getBillings()
            const list = Array.isArray(data.data) ? data.data : []
            setBillings(list)
            // Con 1 sola opción se preselecciona automático (no hay nada que elegir).
            // Con 2+ no hay default: el usuario debe escoger explícitamente.
            setSelectedBilling(list.length === 1 ? list[0] : null)
        } catch (e) {
            console.error('openBillings error', e)
            setBillings([])
            setSelectedBilling(null)
            setBillingsError(true)
        } finally {
            setBillingsLoading(false)
        }
    }, [])

    const openLocations = useCallback(async () => {
        locationModalRef.current?.present()
        setLocationsLoading(true)
        setLocationsError(false)
        try {
            const data = await getLocations()
            const list = Array.isArray(data.data) ? data.data : []
            setLocations(list)
            setSelectedLocation(list[0] ?? null)
        } catch (e) {
            console.error('openLocations error', e)
            setLocations([])
            setSelectedLocation(null)
            setLocationsError(true)
        } finally {
            setLocationsLoading(false)
        }
    }, [])

    const renderBackdrop = useCallback((props: any) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    ), [])

    // Si sendMessage() no pudo mandar nada (sin socket/desconectado), antes el bubble
    // se quedaba gris "enviando" para siempre sin ninguna señal. Lo quitamos de ambos
    // lados (local + store) y avisamos, para que el usuario sepa que debe reintentar.
    const discardOptimisticMessage = useCallback((optimisticId: string) => {
        setMessages(prev => prev.filter(m => m.tempId !== optimisticId))
        useGlobal.setState(state => ({
            chats: state.chats.map(c =>
                c.id !== roomId ? c : { ...c, messages: (c.messages ?? []).filter(m => m.tempId !== optimisticId) }
            )
        }))
        Alert.alert('No se pudo enviar', 'Revisa tu conexión e intenta de nuevo.')
    }, [roomId])

    const handleSend = useCallback(() => {
        const cleanedMessage = message.trim()
        if (!cleanedMessage || !roomId) return
        const optimisticId = `temp-${Date.now()}`
        const optimisticMsg: Message = {
            id: optimisticId,
            tempId: optimisticId,
            content: cleanedMessage,
            type: MessageType.TEXT,
            createdAt: new Date().toISOString(),
            customer: { id: customer?.customer?.id, uid, profile: customer?.customer?.profile },
            room: { id: roomId },
            order: null,
        } as Message

        // Agregar optimísticamente al estado local
        setMessages(prev => [optimisticMsg, ...prev])

        // Al store también para que responseMessageSend pueda hacer el replace
        useGlobal.setState(state => ({
            chats: state.chats.map(c =>
                c.id !== roomId ? c : { ...c, messages: [...(c.messages ?? []), optimisticMsg] }
            )
        }))

        const sent = sendMessage(roomId, cleanedMessage, optimisticId)
        if (!sent) {
            discardOptimisticMessage(optimisticId)
            return // dejamos el texto en el input para que no lo pierda
        }
        setMessage('')
    }, [message, roomId, sendMessage, customer, uid, discardOptimisticMessage])

    const handleSendBilling = useCallback(async () => {
        if (!selectedBilling || !roomId) return
        setSendingBillingLoading(true)
        const optimisticId = `temp-${Date.now()}`
        const optimisticMsg: Message = {
            id: optimisticId,
            tempId: optimisticId,
            type: MessageType.BILLING,
            content: '',
            createdAt: new Date().toISOString(),
            customer: { id: customer?.customer?.id, uid, profile: customer?.customer?.profile },
            room: { id: roomId },
            billing: selectedBilling,
            order: null,
        } as Message

        setMessages(prev => [optimisticMsg, ...prev])
        useGlobal.setState(state => ({
            chats: state.chats.map(c =>
                c.id !== roomId ? c : { ...c, messages: [...(c.messages ?? []), optimisticMsg] }
            )
        }))

        const sent = sendMessage(roomId, selectedBilling.id, optimisticId, MessageType.BILLING)
        if (!sent) discardOptimisticMessage(optimisticId)
        billingsModalRef.current?.dismiss()
        setSendingBillingLoading(false)
    }, [selectedBilling, roomId, customer, uid, sendMessage, discardOptimisticMessage])

    const handleSendLocation = useCallback(async () => {
        if (!selectedLocation || !roomId) return
        setSendingLocationLoading(true)
        const optimisticId = `temp-${Date.now()}`
        const optimisticMsg: Message = {
            id: optimisticId,
            tempId: optimisticId,
            type: MessageType.LOCATION,
            content: '',
            createdAt: new Date().toISOString(),
            customer: { id: customer?.customer?.id, uid, profile: customer?.customer?.profile },
            room: { id: roomId },
            location: selectedLocation,
            order: null,
        } as Message

        setMessages(prev => [optimisticMsg, ...prev])
        useGlobal.setState(state => ({
            chats: state.chats.map(c =>
                c.id !== roomId ? c : { ...c, messages: [...(c.messages ?? []), optimisticMsg] }
            )
        }))

        const sent = sendMessage(roomId, selectedLocation.id, optimisticId, MessageType.LOCATION)
        if (!sent) discardOptimisticMessage(optimisticId)
        locationModalRef.current?.dismiss()
        setSendingLocationLoading(false)
    }, [selectedLocation, roomId, customer, uid, sendMessage, discardOptimisticMessage])

    const handleShare = useCallback(() => setModalIsOpen(prev => !prev), [])

    /**
     * Scroll hasta arriba (FlatList inverted) = onEndReached.
     * Pide los 20 mensajes anteriores al más viejo que tenemos.
     */
    const handleLoadMore = useCallback(async () => {
        const now = Date.now()
        if (!roomId) return
        if (!hasMore) return
        if (loadingMoreRef.current) return
        if (now - lastLoadMoreAtRef.current < 800) return
        if (now < errorCooldownUntilRef.current) return

        // El más viejo es el ÚLTIMO del array DESC
        const oldest = messages[messages.length - 1]
        const beforeId = oldest?.id
        if (!beforeId || beforeId.startsWith('temp-')) return
        if (lastBeforeIdRef.current === beforeId) return

        loadingMoreRef.current = true
        lastLoadMoreAtRef.current = now
        lastBeforeIdRef.current = beforeId
        setLoadingMore(true)

        try {
            const res = await getMessages({ roomId, take: 20, beforeId })
            // Backend devuelve ASC (viejo->nuevo), invertimos a DESC
            const serverMessages: Message[] = Array.isArray(res?.messages) ? res.messages : []
            const serverDesc = [...serverMessages].reverse()

            const existingIds = new Set(messages.map(m => m?.id))
            const clean = serverDesc.filter(m => m?.id && !existingIds.has(m.id))

            if (clean.length > 0) {
                // Más viejos van al FINAL del array DESC
                setMessages(prev => [...prev, ...clean])
            }

            lastBeforeIdRef.current = null
            setHasMore(Boolean(res?.hasMore))
        } catch (e) {
            console.error('loadMore error', e)
            errorCooldownUntilRef.current = Date.now() + 2000
            lastBeforeIdRef.current = null
        } finally {
            setLoadingMore(false)
            loadingMoreRef.current = false
        }
    }, [roomId, hasMore, messages])

    const renderMessage = useCallback(({ item, index }: any) => {
        // !!uid evita que dos mensajes sin customer.uid (p. ej. datos aún cargando)
        // se marquen como "míos" solo porque undefined === undefined.
        const isMe = !!uid && item?.customer?.uid === uid

        // DESC con inverted: index 0 = más nuevo = abajo
        // prevMsg = index - 1 = más nuevo (abajo visual)
        // nextMsg = index + 1 = más viejo (arriba visual)
        const prevMsg = messages[index - 1]
        const nextMsg = messages[index + 1]

        // true si no hay vecino, o si pasó más de TIME_GAP_MS entre los dos mensajes.
        const timeGapWith = (other?: Message) => {
            if (!other) return true
            return Math.abs(new Date(item.createdAt).getTime() - new Date(other.createdAt).getTime()) > TIME_GAP_MS
        }
        // Salto respecto al mensaje más viejo (arriba): aquí va el separador de fecha.
        const hasTimeGapAbove = timeGapWith(nextMsg)
        // Salto respecto al mensaje más nuevo (abajo): solo afecta el redondeo del
        // borde inferior, para que no se vea "pegado" a algo que ya no está pegado.
        const hasTimeGapBelow = timeGapWith(prevMsg)

        // Un salto de tiempo también reinicia el grupo visual, aunque sea el mismo usuario.
        const isFirstInGroup = hasTimeGapAbove || nextMsg?.customer?.uid !== item?.customer?.uid
        const isLastInGroup = hasTimeGapBelow || prevMsg?.customer?.uid !== item?.customer?.uid

        const positions = { last: isLastInGroup, next: isFirstInGroup }

        // Grupo = mensajes consecutivos del mismo usuario sin saltos de tiempo grandes.
        // Entre grupos dejamos un espacio claro (GROUP_GAP); dentro del mismo grupo los
        // mensajes van pegados (el propio bubble ya trae py-0.5, así que 0 aquí basta).
        const wrapper = (children: any) => (
            <View>
                {hasTimeGapAbove && (
                    <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#909090' }}>
                            {formatDateSeparator(item.createdAt)}
                        </Text>
                    </View>
                )}
                <View style={{ paddingTop: !hasTimeGapAbove && isFirstInGroup ? GROUP_GAP : 0, paddingBottom: isLastInGroup ? GROUP_GAP : 0 }}>
                    {/* La hora vive detrás, pegada al borde derecho, y solo se hace
                        visible (opacity) mientras se desliza — no ocupa espacio propio,
                        así que no afecta el layout normal del bubble. */}
                    <View>
                        <Animated.View
                            pointerEvents="none"
                            style={[
                                { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center' },
                                timeRevealStyle,
                            ]}
                        >
                            <Text style={{ fontSize: 11, color: '#909090' }}>
                                {formatTimeOnly(item.createdAt)}
                            </Text>
                        </Animated.View>
                        <Animated.View style={bubbleSwipeStyle}>
                            {children}
                        </Animated.View>
                    </View>
                </View>
            </View>
        )

        switch (item.type) {
            case MessageType.TEXT:
                return wrapper(
                    isMe
                        ? <MessageBubbleMe positions={positions} text={item?.content} isTemp={item.tempId} />
                        : <MessageBubbleFriend positions={positions} text={item?.content} />
                )
            case MessageType.SERVICE:
                return wrapper(<ServiceBubble order={item?.order} uid={uid} />)
            case MessageType.BILLING:
                return wrapper(<BillingBubble billing={item?.billing} isMe={isMe} isFirst={isFirstInGroup} isLast={isLastInGroup} isTemp={item.tempId} />)
            case MessageType.LOCATION:
                return wrapper(<LocationBubble location={item?.location} isMe={isMe} isFirst={isFirstInGroup} isLast={isLastInGroup} isTemp={item.tempId} />)
            default:
                return <Text className="text-center text-red-500">Tipo de mensaje no soportado</Text>
        }
    }, [messages, uid, bubbleSwipeStyle, timeRevealStyle])

    if (!roomId) return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-red-500">Error: No se encontró la conversación</Text>
        </View>
    )


    return (
        <>
            <KeyboardAvoidingView
                className="flex-1 bg-white"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className='flex-1'>
                    {/* GestureDetector activeOffsetX/failOffsetY hacen que solo capture
                        swipes claramente horizontales; uno más vertical se lo cede al
                        scroll normal del FlatList (ver panGesture arriba). */}
                    <GestureDetector gesture={panGesture}>
                        <FlatList
                            data={messages}
                            inverted
                            // Nunca usar Math.random() aquí: generaría una key nueva en cada
                            // render y React remontaría el item entero (flicker, pierde estado).
                            keyExtractor={(item, index) => item?.id?.toString() ?? item?.tempId ?? `msg-${index}`}
                            renderItem={renderMessage}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.2}
                            contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
                            keyboardShouldPersistTaps="handled"
                            onScrollBeginDrag={closeMenu}
                            // Con inverted, ListFooterComponent aparece ARRIBA (spinner de carga de más viejos)
                            ListFooterComponent={loadingMore ? (
                                <View style={{ paddingVertical: 12 }}>
                                    <ActivityIndicator />
                                </View>
                            ) : null}
                        />
                    </GestureDetector>

                    {modalIsOpen && !message.trim() && (
                        <>
                            <Pressable
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                                onPress={closeMenu}
                            />
                            <BlurView
                                tint="dark"
                                intensity={20}
                                style={{ position: "absolute", right: 10, bottom: 10, zIndex: 20, borderRadius: 8, overflow: "hidden", padding: 8 }}
                            >
                                <TouchableOpacity
                                    className='flex flex-row items-center gap-2 px-2 py-1'
                                    activeOpacity={0.7}
                                    onPress={() => { closeMenu(); openBillings() }}
                                >
                                    <Feather size={18} name='file-plus' />
                                    <Text className='text-xl'>Facturas</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className='flex flex-row items-center gap-2 px-2 py-1'
                                    activeOpacity={0.7}
                                    onPress={() => { closeMenu(); openLocations() }}
                                >
                                    <Feather size={18} name='navigation' />
                                    <Text className='text-xl'>Ubicación</Text>
                                </TouchableOpacity>
                            </BlurView>
                        </>
                    )}
                </View>

                <MessageInput
                    message={message}
                    setMessage={setMessage}
                    onSend={handleSend}
                    onShare={handleShare}
                    onFocus={closeMenu}
                    modalIsOpen={modalIsOpen}
                />
            </KeyboardAvoidingView>

            {/* Billing Modal */}
            <BottomSheetModal
                ref={billingsModalRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                backgroundStyle={modalBackgroundStyle}
            >
                <BottomSheetView className='flex-1'>
                    <View className="px-4 pt-4 pb-8 flex-1 flex flex-col justify-between h-full" style={{ gap: 24 }}>
                        <View style={{ gap: 12 }}>
                            <Text className="text-dark text-lg font-bold">Selecciona tus datos fiscales</Text>
                            {billingsLoading ? (
                                <View className="py-4 items-center">
                                    <SpinLoading color={Colors.principal.DEFAULT} />
                                </View>
                            ) : billingsError ? (
                                <View style={{ gap: 8 }}>
                                    <Text style={{ fontSize: 13, color: '#e53e3e' }}>No se pudieron cargar tus datos fiscales.</Text>
                                    <TouchableOpacity onPress={openBillings}>
                                        <Text style={{ fontSize: 13, color: '#e53e3e', textDecorationLine: "underline" }}>Reintentar.</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : billings.length === 0 ? (
                                <View style={{ gap: 8 }}>
                                    <View className='flex flex-row items-center gap-x-1'>
                                        <Text style={{ fontSize: 13, color: '#e53e3e' }}>No tienes datos guardadas.</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                billingsModalRef.current.dismiss()
                                                setTimeout(() => {
                                                    router.push("/(app)/(tabs)/(user)")
                                                    setTimeout(() => {
                                                        router.push("/(app)/(tabs)/(user)/billing")
                                                    }, 50)
                                                }, 300)
                                            }}
                                        >
                                            <Text style={{ fontSize: 13, color: '#e53e3e', textDecorationLine: "underline" }}>Agregar uno nuevo.</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    {/* Con 2+ opciones el usuario debe elegir; con 1 sola no hay nada que
                                        mostrar en el selector, ya quedó preseleccionada en openBillings. */}
                                    {billings.length > 1 && (
                                        <Dropdown
                                            data={billings.map((l: any) => ({ label: l.name, value: l.id }))}
                                            labelField="label"
                                            valueField="value"
                                            value={selectedBilling?.id}
                                            onChange={(item) => setSelectedBilling(billings.find((l: any) => l.id === item.value))}
                                            placeholder="Selecciona tus datos fiscales"
                                            placeholderStyle={{ color: '#92929D', fontSize: 14 }}
                                            selectedTextStyle={{ color: '#040404', fontSize: 14 }}
                                            style={dropdownStyle}
                                            containerStyle={{ borderRadius: 8, borderColor: 'rgba(4,4,4,0.1)' }}
                                            itemTextStyle={{ fontSize: 13 }}
                                        />
                                    )}
                                    {selectedBilling && <BillingSendView data={selectedBilling} />}
                                </>
                            )}
                        </View>
                        <View className='flex-1' />
                        <TouchableOpacity
                            disabled={sendingBillingLoading || !selectedBilling}
                            className="py-3 rounded-full max-h-12 h-12 flex flex-col items-center justify-center"
                            style={sendButtonStyle(sendingBillingLoading || !selectedBilling)}
                            onPress={handleSendBilling}
                        >
                            {sendingBillingLoading
                                ? <SpinLoading color='white' />
                                : <Text className="text-white font-semibold">Enviar factura</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal >

            {/* Location Modal */}
            < BottomSheetModal
                ref={locationModalRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                backgroundStyle={modalBackgroundStyle}
            >
                <BottomSheetView className='flex-1'>
                    <View className="px-4 pt-4 pb-8 flex-1 flex flex-col justify-between h-full" style={{ gap: 24 }}>
                        <View style={{ gap: 12 }}>
                            <Text className="text-dark text-lg font-bold">Selecciona una ubicación</Text>

                            {locationsLoading ? (
                                <View className="py-4 items-center">
                                    <SpinLoading color={Colors.principal.DEFAULT} />
                                </View>
                            ) : locationsError ? (
                                <View style={{ gap: 8 }}>
                                    <Text style={{ fontSize: 13, color: '#e53e3e' }}>No se pudieron cargar tus ubicaciones.</Text>
                                    <TouchableOpacity onPress={openLocations}>
                                        <Text style={{ fontSize: 13, color: '#e53e3e', textDecorationLine: "underline" }}>Reintentar.</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : locations.length === 0 ? (
                                <View className='flex flex-row items-center gap-x-1'>
                                    <Text style={{ fontSize: 13, color: '#e53e3e' }}>No tienes ubicaciones guardadas.</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            locationModalRef.current.dismiss()
                                            setTimeout(() => {
                                                router.push("/(app)/(tabs)/(user)")
                                                setTimeout(() => {
                                                    router.push("/(app)/(tabs)/(user)/location")
                                                }, 50)
                                            }, 300)
                                        }}
                                    >
                                        <Text style={{ fontSize: 13, color: '#e53e3e', textDecorationLine: "underline" }}>Agregar una nueva.</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <Dropdown
                                        data={locations.map((l: any) => ({ label: l.name, value: l.id }))}
                                        labelField="label"
                                        valueField="value"
                                        value={selectedLocation?.id}
                                        onChange={(item) => setSelectedLocation(locations.find((l: any) => l.id === item.value))}
                                        placeholder="Selecciona una ubicación"
                                        placeholderStyle={{ color: '#92929D', fontSize: 14 }}
                                        selectedTextStyle={{ color: '#040404', fontSize: 14 }}
                                        style={dropdownStyle}
                                        containerStyle={{ borderRadius: 8, borderColor: 'rgba(4,4,4,0.1)' }}
                                        itemTextStyle={{ fontSize: 13 }}
                                    />
                                    {selectedLocation && <LocationSendView data={selectedLocation} />}
                                </>
                            )}
                        </View>

                        <View className='flex-1' />

                        <TouchableOpacity
                            disabled={sendingLocationLoading || !selectedLocation}
                            className="py-3 rounded-full max-h-12 h-12 flex flex-col items-center justify-center"
                            style={sendButtonStyle(sendingLocationLoading || !selectedLocation)}
                            onPress={handleSendLocation}
                        >
                            {sendingLocationLoading
                                ? <SpinLoading color='white' />
                                : <Text className="text-white font-semibold">Enviar ubicación</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal >
        </>
    )
}