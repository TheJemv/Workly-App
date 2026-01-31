export const FacebookProviderLogin = async () => {
   try {
      // const result = await LoginManager.logInWithPermissions(["public_profile", "email"])
      // if(result.isCancelled) {
      //    throw new Error("Has cancelado el inicio de sesion")
      // }

      // const data = await AccessToken.getCurrentAccessToken()
      // if(!data) {
      //    throw new Error("Hubo un error al conseguir el token")
      // }

      // const credential = FacebookAuthProvider.credential(data.accessToken)
      // await signInWithCredential(auth, credential)
   } catch (e) {
      throw new Error(e.message)
   }
}