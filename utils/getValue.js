function getValue(obj, key) {
   let result = null;

   function search(obj) {
      for (const [k, v] of Object.entries(obj)) {
         if (k === key) {
            result = v;
            return true; // Se encontró el valor
         } else if (typeof v === 'object' && v !== null) {
            if (search(v)) {
               return true; // Se encontró el valor en una subestructura
            }
         }
      }
      return false; // No se encontró el valor
   }

   search(obj);
   return result;
}

export default getValue