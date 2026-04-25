import { DataDays, Day, DayName } from "@/types/Schedule"
import timeToMinutes from "utils/TimeToMinuts"

const TextSchedule = (dataDays: DataDays[], daysArray: DayName[]) => {
    const date = new Date()

    // (getDay() + 6) % 7 convierte el índice de JS al tuyo:
    // Domingo (0) → 6, Lunes (1) → 0, Sábado (6) → 5
    const dayIndex = (date.getDay() + 6) % 7
    const currentDay = daysArray[dayIndex]
    const currentDaySchedule: Day = dataDays[currentDay]

    if (!currentDaySchedule) return "Horario no disponible"

    const currentMinutes = date.getHours() * 60 + date.getMinutes()

    if (currentDaySchedule.open === false) return "Cerrado"
    if (currentMinutes < timeToMinutes(currentDaySchedule.intervals.start)) return `Abre a las ${currentDaySchedule.intervals.start}`
    if (currentMinutes < timeToMinutes(currentDaySchedule.intervals.end)) return `Cierra a las ${currentDaySchedule.intervals.end}`
    return "Cerrado por hoy, revisa otro dia."
}

export default TextSchedule