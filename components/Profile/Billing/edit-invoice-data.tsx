import { useEffect, useLayoutEffect } from "react";
// import { ScrollView, View } from "react-native";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { invoiceDataResolver, InvoiceData, defaultInvoiceData } from "./types";
import { TextInput } from "./components/text-input";
import { Button } from "./components/button";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
   navigation: any;
   route: any;
};
export function EditInvoiceScreen({ navigation, route }: Props) {
   const data: InvoiceData = route.params.data;

   const { control, handleSubmit, reset } = useForm<InvoiceData>({
      resolver: invoiceDataResolver,
      defaultValues: defaultInvoiceData,
   });

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Editar datos de facturación",
      });
   }, []);

   useEffect(() => {
      if (data) {
         reset(data);
      }
   }, []);

   const handleBack = (): void => {
      navigation.goBack();
   };

   const handleUpdate = async (data: InvoiceData): Promise<void> => {
      console.log("DATA: ", data);
      handleBack();
   };

   return (
      <SafeAreaView className="flex-1">
         <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={30}>
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
                        name="street"
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
                        name="division"
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
                     <Button icon="save" onPress={handleSubmit(handleUpdate)}>
                        Actualizar datos
                     </Button>
                  </View>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
}

export default EditInvoiceScreen;
