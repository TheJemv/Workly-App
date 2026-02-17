import { DataDays, Day, DayName } from "@/types/Schedule";
import timeToMinutes from "utils/TimeToMinuts";
const TextSchedule = (dataDays: DataDays[], daysArray: DayName[]) => {
    const date = new Date()
    const currentDay = daysArray[date.getDay() - 1]
    const currentDaySchedule: Day = dataDays[currentDay]
    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    if (currentDaySchedule.open === false) return "Cerrado"
    if (currentMinutes < timeToMinutes(currentDaySchedule.intervals.start)) return `Abre a las ${currentDaySchedule.intervals.start}`
    if (currentMinutes < timeToMinutes(currentDaySchedule.intervals.end)) return `Cierra a las ${currentDaySchedule.intervals.end}`
    return "Cerrado por hoy, revisa otro dia."
}

export default TextSchedule