const timeToMinutes = (time: string) => {
    const [hourMin, period] = time.split(/(AM|PM)/);
    let [hours, minutes] = hourMin.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
};

export default timeToMinutes;   