function getOptimizedCloudinaryUrl(url: string) {
   try {
      // Asegúrate de que el URL contiene "/image/upload/"
      const baseUrl = url.split("/image/upload/")[0];
      const path = url.split("/image/upload/")[1];

      // Construye el nuevo URL con las transformaciones deseadas
      const optimizedUrl = `${baseUrl}/image/upload/c_fill,g_center,h_500,w_500/${path}`;
      return optimizedUrl;
   } catch {
      return url;
   }
}

export default getOptimizedCloudinaryUrl;
