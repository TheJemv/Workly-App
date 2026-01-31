import { View, Text } from "react-native";
import { TextInputUser } from "components";

type Props = {
   label?: string;
   placeholder?: string;
   value?: string;
   onChange?: (value: string) => void;
   error?: string;
   multiline?: boolean;
   keyboardType?: string;
   maxLength?: number
};
export function TextInput({
   label,
   placeholder,
   value,
   onChange,
   error,
   multiline = false,
   keyboardType,
   maxLength = 52
}: Props) {
   return (
      <View className="flex flex-col space-y-1">
         <TextInputUser
            label={label}
            placeholder={placeholder}
            value={value}
            setValue={onChange}
            multiline={multiline}
            keyboardType={keyboardType}
            maxLength={maxLength}
         />
         {error && (
            <Text className="text-sm text-red-500 font-medium">{error}</Text>
         )}
      </View>
   );
}

export default TextInput;
