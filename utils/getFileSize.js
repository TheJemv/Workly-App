const getFileSize = async (uri) => {
   try {
     const response = await fetch(uri);
     const blob = await response.blob();
     return blob.size;
   } catch (error) {
     console.error('Error al obtener el tamaño del archivo:', error);
     return 0; // Si ocurre un error, asumimos un tamaño de archivo de 0
   }
}

export default getFileSize;