import { View, Text } from 'react-native'
import { memo } from 'react'
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome"
import { Colors } from 'lib'
import { DetailInfo } from 'components/Profile/Billing/components/detail-info'
import regimenes from "../../data/RegimenFiscales.json"

export const BillingSendView = ({ data }: any) => (
    <View className='flex flex-col px-3 py-3 w-full'>
        <View className="flex flex-row items-center space-x-3">
            <FontAwesomeIcon name="user" size={20} color={Colors.principal.DEFAULT} />
            <Text className="text-base text-text font-medium">{data.name}</Text>
        </View>
        <View className="flex flex-row items-center space-x-3">
            <FontAwesomeIcon name="money" size={20} color={Colors.principal.DEFAULT} />
            <View className="flex flex-row items-center space-x-3">
                <DetailInfo title="RFC:">{data.rfc}</DetailInfo>
            </View>
        </View>
        <View className="flex flex-row items-baseline space-x-3 w-full">
            <FontAwesomeIcon name="home" size={20} color={Colors.principal.DEFAULT} />
            <View className="flex flex-col flex-1">
                <DetailInfo title="Calle:">{data.street}</DetailInfo>
                <DetailInfo title="Colonia:">{data.division}</DetailInfo>
                <DetailInfo title="No. Exterior:">{data.number_ext}</DetailInfo>
                <DetailInfo title="No. Interior:">{data.number_int}</DetailInfo>
                <DetailInfo title="C.P.">{data.cp}</DetailInfo>
                <DetailInfo title="Pais:">{data.country}</DetailInfo>
                <DetailInfo title="Estado:">{data.state}</DetailInfo>
                <DetailInfo title="Ciudad:">{data.city}</DetailInfo>
            </View>
        </View>
        <View className="flex flex-row items-center space-x-3">
            <FontAwesomeIcon name="phone" size={20} color={Colors.principal.DEFAULT} />
            <View className="flex flex-row items-center space-x-3">
                <DetailInfo title="Tel.">{data.phone}</DetailInfo>
            </View>
        </View>
        <View className="flex flex-row items-baseline space-x-3">
            <FontAwesomeIcon name="envelope" size={20} color={Colors.principal.DEFAULT} />
            <View className="flex flex-row items-center space-x-3">
                <DetailInfo title="Regimen fiscal:">{regimenes[data.tax_regime]}</DetailInfo>
            </View>
        </View>
    </View>
)

const BillingBubble = memo(({ billing, isMe, isFirst, isLast }: any) => (
    <View className="flex flex-row py-0.5 px-2" style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}>
        <View style={{
            backgroundColor: isMe ? '#303040' : '#f0f0f0',
            padding: 12,
            maxWidth: '80%',
            gap: 6,

            borderRadius: 16,
            borderBottomRightRadius: isMe && isLast ? 4 : 16,
            borderBottomLeftRadius: !isMe && isLast ? 4 : 16,
            borderTopRightRadius: isMe && isFirst ? 4 : 16,
            borderTopLeftRadius: !isMe && isFirst ? 4 : 16,
        }}>
            <View className="flex flex-row items-center" style={{ gap: 6 }}>
                <FontAwesomeIcon name="user" size={13} color={isMe ? '#fff' : Colors.principal.DEFAULT} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: isMe ? '#fff' : '#050505' }}>{billing.name}</Text>
            </View>
            <View className="flex flex-row items-center" style={{ gap: 6 }}>
                <FontAwesomeIcon name="money" size={13} color={isMe ? '#ffffffCC' : Colors.principal.DEFAULT} />
                <Text style={{ fontSize: 12, color: isMe ? '#ffffffCC' : '#333' }}>RFC: {billing.rfc}</Text>
            </View>
            <View className="flex flex-row items-start" style={{ gap: 6 }}>
                <FontAwesomeIcon name="home" size={13} color={isMe ? '#ffffffCC' : Colors.principal.DEFAULT} style={{ marginTop: 2 }} />
                <Text style={{ fontSize: 12, color: isMe ? '#ffffffCC' : '#333', flexShrink: 1 }}>
                    {billing.street} {billing.number_ext}{billing.number_int ? ` Int. ${billing.number_int}` : ''}, {billing.division}, {billing.city}, {billing.state} {billing.cp}
                </Text>
            </View>
            <View className="flex flex-row items-center" style={{ gap: 6 }}>
                <FontAwesomeIcon name="phone" size={13} color={isMe ? '#ffffffCC' : Colors.principal.DEFAULT} />
                <Text style={{ fontSize: 12, color: isMe ? '#ffffffCC' : '#333' }}>{billing.phone}</Text>
            </View>
            <View className="flex flex-row items-center" style={{ gap: 6 }}>
                <FontAwesomeIcon name="envelope" size={13} color={isMe ? '#ffffffCC' : Colors.principal.DEFAULT} />
                <Text style={{ fontSize: 12, color: isMe ? '#ffffffCC' : '#333', flexShrink: 1 }}>{regimenes[billing.tax_regime]}</Text>
            </View>
        </View>
    </View>
))

export default BillingBubble