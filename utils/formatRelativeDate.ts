function formatRelativeDate(dateInput): string {
    const date = new Date(dateInput);
    const now = new Date();

    // Normalizar a medianoche para evitar errores por horas
    const startOfToday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffMs = startOfToday - startOfDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "hoy";
    if (diffDays === 1) return "ayer";
    if (diffDays === 2) return "antier";

    if (diffDays < 30) return `${diffDays} dias`;

    const diffMonths =
        now.getFullYear() * 12 +
        now.getMonth() -
        (date.getFullYear() * 12 + date.getMonth());

    if (diffMonths < 12) return `${diffMonths}m`;

    const diffYears = now.getFullYear() - date.getFullYear();
    return `${diffYears}a`;
}

export default formatRelativeDate