const formatMessageDate = (dateString) => {
   try {
      // Verifica que dateString esté en un formato válido
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
         throw new Error('Fecha no válida');
      }

      // OJO: no hay que restar manualmente el timezone offset aquí. `date` ya es un
      // instante UTC correcto (viene de un ISO string), y los métodos de Date como
      // getHours()/getDate()/getMonth() YA devuelven la hora/fecha convertida a la
      // zona horaria local del dispositivo automáticamente. Restar el offset a mano
      // aplicaba la conversión DOS veces y desfasaba la hora mostrada (p. ej. 6h en
      // México), y en casos cerca de medianoche hasta podía cambiar el día mostrado.
      const localDate = date;

      const now = new Date();

      const isSameDay = (d1, d2) =>
         d1.getDate() === d2.getDate() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getFullYear() === d2.getFullYear();

      const isYesterday = d => {
         const yesterday = new Date(now);
         yesterday.setDate(now.getDate() - 1);
         return isSameDay(d, yesterday);
      };

      const isDayBeforeYesterday = d => {
         const dayBeforeYesterday = new Date(now);
         dayBeforeYesterday.setDate(now.getDate() - 2);
         return isSameDay(d, dayBeforeYesterday);
      };

      const getFormattedTime = d => {
         const hours = d.getHours();
         const minutes = d.getMinutes();
         const formattedHours = hours % 12 || 12;
         const formattedMinutes = minutes.toString().padStart(2, '0');
         const period = hours < 12 ? 'AM' : 'PM';
         return `${formattedHours}:${formattedMinutes} ${period}`;
      };

      const getFormattedDate = d => {
         const day = d.getDate();
         const monthNames = [
            'ene',
            'feb',
            'mar',
            'abr',
            'may',
            'jun',
            'jul',
            'ago',
            'sep',
            'oct',
            'nov',
            'dic',
         ];
         const month = monthNames[d.getMonth()];
         return `${day} ${month}`;
      };

      const yearsDifference = now.getFullYear() - localDate.getFullYear();

      if (isSameDay(localDate, now)) {
         return getFormattedTime(localDate);
      } else if (isYesterday(localDate)) {
         return 'ayer';
      } else if (isDayBeforeYesterday(localDate)) {
         return 'antier';
      } else if (yearsDifference >= 1) {
         return `hace ${yearsDifference} ${yearsDifference === 1 ? 'año' : 'años'}`;
      } else {
         return getFormattedDate(localDate);
      }
   } catch (error) {
      return 'Fecha no válida';
   }
};

export default formatMessageDate