import { Period } from "@/types/Schedule";

export const parseTimeString = (timeString: string) => {
    // Normalizar: agregar espacio si no existe entre hora y AM/PM
    const normalized = timeString.replace(/(\d)(AM|PM)/i, '$1 $2');

    const [time, period] = normalized.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    console.log('Parsing:', timeString, '-> normalized:', normalized, '-> parts:', { hours, minutes, period });

    return {
        hour: hours,
        minute: minutes,
        period: period as Period
    };
};

export const createTimeString = (hour: number, minute: number, period: Period): string => {
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hour}:${minuteStr}${period}`; // Sin espacio para mantener consistencia con tus datos
};

export const convertTimeTo24Hour = (timeString: string): number => {
    // Normalizar primero
    const normalized = timeString.replace(/(\d)(AM|PM)/i, '$1 $2');
    const [time, period] = normalized.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    // Convertir a formato 24 horas
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    console.log('Converting:', timeString, '-> Hours:', hours, 'Minutes:', minutes, 'Total minutes:', hours * 60 + minutes);

    // Retornar en minutos totales para mejor comparación
    return hours * 60 + minutes;
};

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
    const start = convertTimeTo24Hour(startTime);
    const end = convertTimeTo24Hour(endTime);

    console.log('Validating:', {
        startTime,
        endTime,
        startMinutes: start,
        endMinutes: end,
        isValid: start < end
    });

    return start < end;
};