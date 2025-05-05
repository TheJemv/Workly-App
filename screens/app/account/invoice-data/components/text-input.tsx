import { View, Text } from "react-native";
import { TextInputUser } from "components";

type Props = {
   label?: string;
   placeholder?: string;
   value?: string;
   onChange?: (value: string) => void;
   error?: string;
};
export function TextInput({
   label,
   placeholder,
   value,
   onChange,
   error,
}: Props): JSX.Element {
   return (
      <View className="flex flex-col space-y-1">
         <TextInputUser
            label={label}
            placeholder={placeholder}
            value={value}
            setValue={onChange}
         />
         {error && (
            <Text className="text-sm text-red-500 font-medium">{error}</Text>
         )}
      </View>
   );
}

export default TextInput;
