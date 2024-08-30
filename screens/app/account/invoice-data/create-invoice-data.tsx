import { SafeAreaView, ScrollView, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { invoiceDataResolver, InvoiceData, defaultInvoiceData } from "./types";
import { Header } from "./components/header";
import { TextInput } from "./components/text-input";
import { Button } from "./components/button";

type Props = {
   navigation: any;
};
export function CreateInvoiceScreen({ navigation }: Props): JSX.Element {
   const { control, handleSubmit } = useForm<InvoiceData>({
      resolver: invoiceDataResolver,
      defaultValues: defaultInvoiceData,
   });

   const handleBack = (): void => {
      navigation.goBack();
   };

   const handleCreate = async (data: InvoiceData): Promise<void> => {
      console.log("DATA: ", data);
      handleBack();
   };

   return (
      <SafeAreaView className="flex-1">
         <Header onBack={handleBack}>Crear datos de facturacion</Header>
         <ScrollView className="flex-1">
            <View className="flex flex-col space-y-5 px-3 py-5 mb-10">
               <View>
                  <Controller
                     control={control}
                     name="name"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Nombre"
                           placeholder="Nombre"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="rfc"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="RFC"
                           placeholder="RFC"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
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
               </View>
               <View>
                  <Controller
                     control={control}
                     name="colonia"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Colonia"
                           placeholder="Colonia"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="del"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Departamento"
                           placeholder="Departamento"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="cp"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="C.P."
                           placeholder="C.P."
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="state"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Estado"
                           placeholder="Estado"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="phone"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Tel."
                           placeholder="Tel."
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="email"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Correo"
                           placeholder="Correo"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="tax_regime"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Regimen fiscal"
                           placeholder="Regimen fiscal"
                           value={field.value}
                           onChange={field.onChange}
                           error={fieldState.error?.message}
                        />
                     )}
                  />
               </View>
               <View>
                  <Controller
                     control={control}
                     name="cfdi"
                     render={({ field, fieldState }) => (
                        <TextInput
                           label="Uso CFDI"
                           placeholder="Uso CFDI"
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
         </ScrollView>
      </SafeAreaView>
   );
}

export default CreateInvoiceScreen;
