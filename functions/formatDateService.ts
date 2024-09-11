function formatDateService(fecha: Date): string {
   const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
   ];

   const dia = fecha.getDate();
   const mes = meses[fecha.getMonth()];
   const año = fecha.getFullYear();

   let horas = fecha.getHours();
   const minutos = fecha.getMinutes().toString().padStart(2, "0");
   const periodo = horas >= 12 ? "pm" : "am";

   // Convertir horas a formato 12 horas
   horas = horas % 12 || 12;

   return `${dia} de ${mes} del ${año} a las ${horas}:${minutos}${periodo}`;
}

export default formatDateService;
