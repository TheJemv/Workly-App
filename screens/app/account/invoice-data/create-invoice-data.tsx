import { SafeAreaView, View, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { invoiceDataResolver, InvoiceData, defaultInvoiceData } from "./types";
// import { Header } from "./components/header";
import { TextInput } from "./components/text-input";
import { Button } from "./components/button";
import { useLayoutEffect } from "react";
import { postBilling } from "services/api/billing.api";
import useGlobal from "core/globals";

type Props = {
   navigation: any;
};
export function CreateInvoiceScreen({ navigation }: Props): JSX.Element {
   const { token } = useGlobal();
   const { control, handleSubmit } = useForm<InvoiceData>({
      resolver: invoiceDataResolver,
      defaultValues: defaultInvoiceData,
   });

   const handleBack = (): void => {
      navigation.goBack();
   };

   const handleCreate = async (data: InvoiceData): Promise<void> => {
      console.log("DATA: ", data);
      await postBilling(token, data)
         .then((data) => {
            console.log({
               "Data Server": data,
            });
            handleBack();
         })
         .catch((error) => {
            Alert.alert("Error", (error as Error).message);
         });
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Crear datos de facturación",
      });
   }, []);

   return (
      <SafeAreaView className="flex-1">
         <KeyboardAwareScrollView
            style={{
               flex: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
         >
            <View className="flex flex-col space-y-4 px-3 py-5 mb-10">
               <View>
                  {/* Razon Social */}
                  <Controller
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Razon Social"
                           placeholder="razon social"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Calle o Vialidad */}
               <View>
                  <Controller
                     control={control}
                     name="street"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Calle / Vialidad"
                           placeholder="calle"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Regimen Fiscal */}
               {/* <View>
                     <Controller
                        control={control}
                        name="calle"
                        render={({ field, fieldState }) => (
                           <TextInput
                              label="Calle"
                              placeholder="Calle"
                              value={field.value}
                              onChange={field.onChange}
                              error={fieldState.error?.message}
                           />
                        )}
                     />
                  </View> */}

               {/* No. Exterior */}
               <View>
                  <Controller
                     control={control}
                     name="number_ext"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="No. Exterior"
                           placeholder="numero exterior"
                           value={field.value ? field.value.toString() : ""}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* No. Interior */}
               <View>
                  <Controller
                     control={control}
                     name="number_int"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="No. Interior"
                           placeholder="numero Interior"
                           value={field.value ? field.value.toString() : ""}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* RFC */}
               <View>
                  <Controller
                     control={control}
                     name="rfc"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="RFC"
                           placeholder="XXXX0000000X0"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* CP */}
               <View>
                  <Controller
                     control={control}
                     name="cp"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Codigo Postal"
                           placeholder="codigo postal"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Pais */}
               <View>
                  <Controller
                     control={control}
                     name="country"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Pais"
                           placeholder="pais"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Estado */}
               <View>
                  <Controller
                     control={control}
                     name="state"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Estado"
                           placeholder="estado"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Municpio */}
               <View>
                  <Controller
                     control={control}
                     name="city"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Municpio"
                           placeholder="municipio"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Colonia */}
               <View>
                  <Controller
                     control={control}
                     name="division"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Colonia o Fraccionamiento"
                           placeholder="colonia o fraccionamiento"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Numero de Telefono */}
               <View>
                  <Controller
                     control={control}
                     name="phone"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Numero de Telefono"
                           placeholder="telefono"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               {/* Regimen Fiscal */}
               <View>
                  <Controller
                     control={control}
                     name="tax_regime"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Regimen Fiscal"
                           placeholder="regimen fiscal"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>

               <View className="flex-1 py-4">
                  <Button icon="save" onPress={handleSubmit(handleCreate)}>
                     Guardar datos
                  </Button>
               </View>
            </View>
         </KeyboardAwareScrollView>
      </SafeAreaView>
   );
}

export default CreateInvoiceScreen;
