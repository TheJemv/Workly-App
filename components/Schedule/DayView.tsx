import { Text, View } from "react-native"
import { Day, DayName } from "@/types/Schedule"
import { Colors } from "lib"
interface PropsScheduleView {
    label: DayName
    data: Day
    daysArray: DayName[]
}

export default function DayView({ label, data, daysArray }: PropsScheduleView) {
    const date = new Date()
    const currentDay = daysArray[date.getDay() - 1]
    return (
        <View className="flex flex-row items-center justify-between py-3" style={{ borderBottomWidth: 1, borderBottomColor: "#c2c2c2" }}>
            <Text style={{ color: currentDay === label ? Colors.principal[400] : "#040404" }} className="text-lg font-semibold">{label}</Text>
            <Text style={{ color: data.open ? "#000" : "#444444" }}>{data.open ? `${data.intervals.start} - ${data.intervals.end}` : "Cerrado"}</Text>
        </View>
    )
}
