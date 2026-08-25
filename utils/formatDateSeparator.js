const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
   'ene', 'feb', 'mar', 'abr', 'may', 'jun',
   'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const startOfDay = d => {
   const copy = new Date(d);
   copy.setHours(0, 0, 0, 0);
   return copy;
};

const getFormattedTime = d => {
   const hours = d.getHours();
   const minutes = d.getMinutes();
   const formattedHours = hours % 12 || 12;
   const formattedMinutes = minutes.toString().padStart(2, '0');
   const period = hours < 12 ? 'A.M.' : 'P.M.';
   return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Solo la hora (sin día/fecha) — la usa el gesto de swipe del chat para mostrar
// la hora de cada mensaje al deslizar, sin importar qué tan viejo sea.
export const formatTimeOnly = (dateString) => {
   try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return getFormattedTime(date);
   } catch {
      return '';
   }
};

/**
 * Separador de fecha/hora que se muestra dentro del chat entre dos mensajes
 * cuando pasó suficiente tiempo entre ellos (ver TIME_GAP_MS en chat.tsx).
 * A diferencia de formatMessageDate (para la lista de chats), aquí SIEMPRE
 * se acompaña de la hora, y se usa el formato más corto que siga siendo claro:
 *   - Hoy, mismo día      -> "Hoy, 10:25 P.M."
 *   - Ayer                -> "Ayer, 10:25 P.M."
 *   - Esta semana         -> "Lun, 10:25 P.M."
 *   - Más viejo           -> "24 ago, 10:25 P.M."
 *   - Otro año            -> "24 ago 2024, 10:25 P.M."
 */
const formatDateSeparator = (dateString) => {
   try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error('Fecha no válida');

      const now = new Date();
      const time = getFormattedTime(date);

      const dayDiff = Math.round(
         (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86400000
      );

      if (dayDiff === 0) return `Hoy, ${time}`;
      if (dayDiff === 1) return `Ayer, ${time}`;
      if (dayDiff > 1 && dayDiff < 7) return `${WEEKDAYS[date.getDay()]}, ${time}`;

      const sameYear = date.getFullYear() === now.getFullYear();
      const datePart = `${date.getDate()} ${MONTHS[date.getMonth()]}${sameYear ? '' : ' ' + date.getFullYear()}`;
      return `${datePart}, ${time}`;
   } catch (error) {
      return '';
   }
};

export default formatDateSeparator;
