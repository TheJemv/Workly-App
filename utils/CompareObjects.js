export default function getChangedProperties(obj1, obj2) {
  const changedProperties = {};

  function compareObjects(o1, o2, result) {
    for (const key in o2) {
      if (o2.hasOwnProperty(key)) {
        if (typeof o2[key] === 'object' && o2[key] !== null && typeof o1[key] === 'object' && o1[key] !== null) {
          result[key] = Array.isArray(o2[key]) ? [] : {};
          compareObjects(o1[key], o2[key], result[key]);
          // Eliminar propiedades vacías resultantes de objetos anidados sin cambios
          if (Object.keys(result[key]).length === 0) {
            delete result[key];
          }
        } else if (o1[key] !== o2[key]) {
          result[key] = o2[key];
        }
      }
    }
  }

  compareObjects(obj1, obj2, changedProperties);
  return changedProperties;
}
