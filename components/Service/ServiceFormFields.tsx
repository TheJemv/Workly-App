import { View, Text } from "react-native";
import { Controller, useWatch, UseFormReturn } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import { MoneyTextInput } from "@alexzunik/react-native-money-input";

import { TextInput } from "components/Profile/Billing/components/text-input";
import { ServiceData } from "@/types/Service/EditService.types";
import { useServiceCategoryCatalog } from "hooks/useServiceCategoryCatalog";
import ServiceLocationModeEnum from "enum/ServiceLocationModeEnum";
import { Colors } from "lib";

import FormSection from "./FormSection";
import SegmentedField from "./SegmentedField";
import AddonListEditor from "./AddonListEditor";
import IntervalFields from "./IntervalFields";
import CompanyLocationPicker from "./CompanyLocationPicker";

const labelStyle = {
   color: Colors.principal.DEFAULT,
   fontSize: 14,
   fontWeight: "700" as const,
};

export default function ServiceFormFields({ form }: { form: UseFormReturn<ServiceData> }) {
   const { control, setValue } = form;
   const categoryOptions = useServiceCategoryCatalog();
   const indefinite = useWatch({ control, name: "indefinite" });
   const locationMode = useWatch({ control, name: "locationMode" });
   const interval = useWatch({ control, name: "interval" });

   return (
      <View style={{ gap: 12 }}>
         <FormSection title="Información">
            <Controller
               control={control}
               name="name"
               render={({ field, fieldState }) => (
                  <TextInput
                     label="Nombre"
                     placeholder="Nombre del servicio"
                     value={field.value}
                     onChange={field.onChange}
                     error={fieldState.error?.message}
                  />
               )}
            />

            <Controller
               control={control}
               name="description"
               render={({ field, fieldState }) => (
                  <TextInput
                     label="Descripción"
                     placeholder="Describe qué incluye tu servicio"
                     value={field.value}
                     onChange={field.onChange}
                     error={fieldState.error?.message}
                     multiline
                     maxLength={256}
                  />
               )}
            />
         </FormSection>

         <FormSection title="Precio">
            <Controller
               control={control}
               name="indefinite"
               render={({ field }) => (
                  <SegmentedField
                     label="Tipo de precio"
                     value={field.value ? "convenir" : "fijo"}
                     onChange={(v) => {
                        const isConvenir = v === "convenir";
                        field.onChange(isConvenir);
                        if (isConvenir) setValue("addons", [], { shouldDirty: true });
                     }}
                     options={[
                        { label: "Precio fijo", value: "fijo" },
                        { label: "A convenir", value: "convenir" },
                     ]}
                     caption={
                        indefinite
                           ? "El cliente propone un monto y tú lo confirmas por chat."
                           : "El cliente paga este monto al reservar."
                     }
                  />
               )}
            />

            {!indefinite && (
               <Controller
                  control={control}
                  name="unit_amount"
                  render={({ field, fieldState }) => (
                     <View style={{ gap: 4 }}>
                        <Text style={labelStyle}>
                           {interval ? `Precio por ${interval.unitLabel || "unidad"}` : "Monto"}
                        </Text>
                        <MoneyTextInput
                           value={((Number(field.value) || 0) / 100).toString()}
                           onChangeText={(_formatted, extracted) => {
                              field.onChange(Math.round(Number(extracted) * 100));
                           }}
                           style={{
                              padding: 10,
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "#04040420",
                              fontSize: 15,
                           }}
                           prefix="$"
                           groupingSeparator=","
                           fractionSeparator="."
                           placeholderTextColor="#92929D"
                           placeholder="$50.00"
                        />
                        {fieldState.error && (
                           <Text className="text-sm text-red-500 font-medium">
                              {fieldState.error.message}
                           </Text>
                        )}
                     </View>
                  )}
               />
            )}

            {!indefinite && <IntervalFields control={control} setValue={setValue} />}
         </FormSection>

         {!indefinite && (
            <FormSection
               title="Complementos"
               caption="Opcional. Opciones que ajustan el precio final (ej. personas extra)."
            >
               <AddonListEditor control={control} />
            </FormSection>
         )}

         <FormSection title="Detalles">
            <Controller
               control={control}
               name="locationMode"
               render={({ field }) => (
                  <SegmentedField
                     label="Ubicación del servicio"
                     value={field.value}
                     onChange={(v) => {
                        field.onChange(v);
                        if (v !== ServiceLocationModeEnum.CompanyLocation) {
                           setValue("companyLocationId", null, { shouldDirty: true });
                        }
                     }}
                     options={[
                        { label: "No requiere", value: ServiceLocationModeEnum.NotRequired },
                        { label: "Del cliente", value: ServiceLocationModeEnum.CustomerLocation },
                        { label: "Mi sucursal", value: ServiceLocationModeEnum.CompanyLocation },
                     ]}
                     caption={
                        locationMode === ServiceLocationModeEnum.CustomerLocation
                           ? "El cliente elige su dirección al pagar (tú vas hasta allá)."
                           : locationMode === ServiceLocationModeEnum.CompanyLocation
                              ? "El cliente llega a la sucursal que elijas abajo."
                              : "No se le pide ubicación a nadie."
                     }
                  />
               )}
            />

            {locationMode === ServiceLocationModeEnum.CompanyLocation && (
               <Controller
                  control={control}
                  name="companyLocationId"
                  render={({ field, fieldState }) => (
                     <CompanyLocationPicker
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                     />
                  )}
               />
            )}

            <Controller
               control={control}
               name="category"
               render={({ field, fieldState }) => (
                  <View style={{ gap: 4 }}>
                     <Text style={labelStyle}>Categoría</Text>
                     <Dropdown
                        style={{
                           borderRadius: 10,
                           borderWidth: 1,
                           borderColor: "#04040420",
                           paddingHorizontal: 10,
                           paddingVertical: 10,
                        }}
                        selectedTextStyle={{ color: "#050505", fontSize: 15 }}
                        placeholder="Escoge una categoría"
                        placeholderStyle={{ color: "#92929D", fontSize: 15 }}
                        itemContainerStyle={{ backgroundColor: Colors.white, borderRadius: 8 }}
                        containerStyle={{ borderRadius: 10, borderWidth: 1 }}
                        labelField="label"
                        valueField="value"
                        data={categoryOptions}
                        value={field.value}
                        onChange={(item) => field.onChange(item.value)}
                     />
                     {fieldState.error && (
                        <Text className="text-sm text-red-500 font-medium">
                           {fieldState.error.message}
                        </Text>
                     )}
                  </View>
               )}
            />
         </FormSection>
      </View>
   );
}
