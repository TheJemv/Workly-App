import getFileSize from "utils/getFileSize";

const MAX_FILE_SIZE = 10485760; // 10 MB en bytes

// Función auxiliar nativa para convertir URI a Base64 puro
async function uriToBase64(uri: string): Promise<string> {
   const response = await fetch(uri);
   const blob = await response.blob();
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
         const base64String = reader.result as string;
         const base64Data = base64String.includes(",")
            ? base64String.split(",")[1]
            : base64String;
         resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
   });
}

const loadImageFile = async (uri: string) => {
   try {
      const fileSize = await getFileSize(uri);
      if (fileSize >= MAX_FILE_SIZE) {
         throw new Error("La foto no puede ser mayor de 10MB");
      }

      const base64 = await uriToBase64(uri);
      return base64;
   } catch (error: any) {
      throw new Error(error.message);
   }
}

export default loadImageFile;