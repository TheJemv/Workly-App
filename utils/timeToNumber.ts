const timeToNumber = (timeStr: string): number => {
    // timeStr puede ser "7:00PM", "10:00AM", etc.
    const [time, period] = timeStr.split(/(AM|PM)/);
    const [hours, minutes] = time.split(':').map(Number);

    let hour24 = hours;

    // Convertir a formato 24 horas
    if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
    }

    // Retornar como número: hora * 100 + minutos
    // Ejemplo: 15:30 = 1530, 5:30 = 530, 0:30 = 30
    return hour24 * 100 + minutes;
}

export default timeToNumber