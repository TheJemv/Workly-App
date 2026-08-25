import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Padding } from '../lib';
import { formatMessageDate } from '../utils';
import { router } from 'expo-router';
import { Order } from '@/types/Order';
import MessageType from 'enum/MessageType';
import useGlobal from 'core/globals';
import { memo } from 'react';

// ─── Utils ────────────────────────────────────────────────────────────────────

export const timeAgo = (createdAt: string): string => {
   const diff = Date.now() - new Date(createdAt).getTime()
   const s = Math.floor(diff / 1000)
   const m = Math.floor(s / 60)
   const h = Math.floor(m / 60)
   const d = Math.floor(h / 24)
   const w = Math.floor(d / 7)
   const mo = Math.floor(d / 30)
   const y = Math.floor(d / 365)

   if (s < 60) return 'hace un momento'
   if (m === 1) return 'hace 1 minuto'
   if (m < 60) return `hace ${m} minutos`
   if (h === 1) return 'hace una hora'
   if (h < 24) return `hace ${h} horas`
   if (d === 1) return 'hace un día'
   if (d < 7) return `hace ${d} días`
   if (w === 1) return 'hace una semana'
   if (w < 4) return `hace ${w} semanas`
   if (mo === 1) return 'hace un mes'
   if (mo < 12) return `hace ${mo} meses`
   if (y === 1) return 'hace un año'
   return `hace ${y} años`
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LastMessage {
   id: string
   content: string
   type: MessageType
   order?: Order | null
   createdAt: string
   customer?: { uid: string; profile?: any } | null
}

interface Props {
   id: string
   onView?: boolean
   lastMessage: LastMessage | null
   customers: { profile?: { photo?: string; name?: string }, uid: string }[]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const LastTextMessage = memo(({ createdAt, message, isMe }: { createdAt: string; message: string; isMe: boolean }) => {
   if (!isMe) return <Text>{message}</Text>
   return <Text>Mensaje enviado {timeAgo(createdAt)}</Text>
})

const LastLocationMessage = memo(({ createdAt, message, isMe }: { createdAt: string; message: string; isMe: boolean }) => {
   if (!isMe) return <Text>Ha enviado su ubicacion</Text>
   return <Text>Ubicacion enviada {timeAgo(createdAt)}</Text>
})

// ─── Main ─────────────────────────────────────────────────────────────────────

const ChatItem = memo(({ data }: { data: Props }) => {
   const uid = useGlobal((s) => s.customer?.uid)
   const isMe = data.lastMessage?.customer?.uid === uid

   const convertMessage = () => {
      // Un chat recién creado (p. ej. justo después de comprar un servicio) puede
      // no tener todavía lastMessage — no asumir que siempre existe.
      if (!data.lastMessage) return 'Inicia la conversación'
      const { type, order, content, createdAt } = data.lastMessage
      switch (type) {
         case MessageType.SERVICE:
            return `Orden: ${order?.serviceName}`
         case MessageType.BILLING:
            return isMe ? "Tú: enviaste los datos fiscales" : "Él/ella envió los datos fiscales"
         case MessageType.TEXT:
            return <LastTextMessage createdAt={createdAt} message={content} isMe={isMe} />
         case MessageType.LOCATION:
            return <LastLocationMessage createdAt={createdAt} message={content} isMe={isMe} />
         default:
            return `${isMe ? 'Has' : 'Te ha'} enviado algo ${timeAgo(createdAt)}`
      }
   }

   // Puede no existir si `customers` viene incompleto (edge case de datos del backend).
   const otherCustomer = data.customers?.find(c => c.uid !== uid);
   return (
      <Pressable
         onPress={() => router.push({ pathname: "/(app)/chat", params: { roomId: data.id } })}
         style={({ pressed }) => [{ backgroundColor: pressed ? 'lightgray' : 'transparent' }, styles.container]}
      >
         <Image
            source={{ uri: otherCustomer?.profile?.photo }}
            style={styles.image}
            resizeMode="cover"
         />

         <View style={styles.semiContainer}>
            <View style={styles.top}>
               <Text
                  numberOfLines={1}
                  style={[styles.topName, { fontWeight: data.onView ? '900' : '700' }]}
               >
                  {otherCustomer?.profile?.name ?? 'Usuario'}
               </Text>
               <Text style={styles.topTime}>
                  {formatMessageDate(data?.lastMessage?.createdAt)}
               </Text>
            </View>

            <View style={styles.bottom}>
               <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                     styles.bottomMessage,
                     {
                        color: data.onView ? Colors.gray[700] : Colors.gray[500],
                        fontWeight: data.onView ? '900' : '300',
                     }
                  ]}
               >
                  {convertMessage()}
               </Text>

               {data.onView && <View style={styles.bottomNotification} />}
            </View>
         </View>
      </Pressable>
   )
})

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      padding: Padding[2],
      gap: Padding[2],
   },
   image: {
      borderRadius: 25,
      width: 50,
      height: 50,
      backgroundColor: Colors.zinc[200],
   },
   semiContainer: {
      flex: 1,
      flexDirection: 'column',
      gap: 4,
      justifyContent: 'center',
   },
   top: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   topName: {
      color: Colors.principal.DEFAULT,
      fontSize: 16,
      flex: 1,
   },
   topTime: {
      color: Colors.principal.DEFAULT,
      fontWeight: '400',
      fontSize: 12,
   },
   bottom: {
      flex: 1,
      flexDirection: 'row',
   },
   bottomMessage: {
      flex: 1,
   },
   bottomNotification: {
      width: 12,
      height: 12,
      backgroundColor: Colors.blue.DEFAULT,
      borderRadius: 50,
      marginVertical: 'auto',
   },
})

export default ChatItem;