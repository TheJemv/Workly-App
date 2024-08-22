function updateValue(obj, key, newValue) {
   function update(obj) {
     // Crear una copia del objeto actual
     const newObj = Array.isArray(obj) ? [] : {};
     
     for (const [k, v] of Object.entries(obj)) {
       if (k === key) {
         // Si la clave coincide, actualiza el valor
         newObj[k] = newValue;
       } else if (typeof v === 'object' && v !== null) {
         // Si el valor es un objeto, aplica la actualización recursivamente
         newObj[k] = update(v);
       } else {
         // Copia el valor tal cual si no es un objeto
         newObj[k] = v;
       }
     }
     
     return newObj;
   }
   return update(obj);
}

export default updateValue