import RNFS from "react-native-fs"
import getFileSize from "utils/getFileSize";

const MAX_FILE_SIZE = 10485760; // 10 MB en bytes
const loadImageFile = async (uri) => {
   try {
      const fileSize = await getFileSize(uri);
      if (fileSize >= MAX_FILE_SIZE) {
         throw new Error("La foto no puede ser mayor de 10MB")
      }

      const base64 = await RNFS.readFile(uri, "base64")
      return base64;
   } catch (error) {
      throw new Error(error.message);
   }
}

export default loadImageFile;