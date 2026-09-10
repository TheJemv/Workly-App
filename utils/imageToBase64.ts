export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

/** Convierte una URI local a data-URI base64 (`data:image/jpeg;base64,…`). */
export async function uriToDataUri(uri: string): Promise<string> {
   const response = await fetch(uri);
   const blob = await response.blob();
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
         const result = reader.result as string;
         resolve(
            result.startsWith("data:")
               ? result
               : `data:image/jpeg;base64,${result}`,
         );
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
   });
}

/** Tamaño en bytes de un archivo local (0 si falla). */
export async function getFileSize(uri: string): Promise<number> {
   try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.size;
   } catch {
      return 0;
   }
}
