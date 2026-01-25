const disabled_reason = {
   "requirements.past_due": "Requisitos Vencidos",
   "requirements.pending_verification": "Stripe está verificando información",

   "rejected.fraud":
      "La cuenta fue rechazada por sospecha de actividad fraudulenta.",
   "rejected.listed":
      "La cuenta fue rechazada porque está en una lista restringida.",
   "rejected.terms_of_service":
      "La cuenta fue rechazada por violar los Términos de Servicio de Stripe.",
   listed:
      "La cuenta está en una lista restringida y debe revisarse manualmente.",
   platform_paused: "La plataforma pausó temporalmente esta cuenta.",
   other: "La cuenta está deshabilitada por una razón desconocida.",
};

export default disabled_reason;
