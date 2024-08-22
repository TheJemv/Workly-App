import { Colors } from "lib";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from 'react-native-element-dropdown'


const DropdownInput = ({
   value, setValue,

   label, data, labelField, valueField,
   placeholder, searchPlaceholder,

   icon: Icon, disable=false
}) => (
   <View className="flex flex-col" style={{gap:4}}>
      <Text style={{
         color: Colors.principal.DEFAULT,
         fontSize: 14,
         fontWeight: 700,
      }}>{label}</Text>
      <Dropdown
         style={styles.dropdown}
         className="w-full py-2 px-2 rounded-lg border border-dark/10"
         itemTextStyle={{fontSize: 14}}
         containerStyle={{borderRadius: 8}}
         selectedTextStyle={{fontSize: 14}}
         activeColor='#eee'
         inputSearchStyle={{borderRadius: 8}}
         placeholderStyle={{fontSize: 14}}
         renderRightIcon={() => <Icon/>}
         mode="default"
         dropdownPosition='top'
         search

         value={value}
         onChange={setValue}


         disable={disable}
         data={data}
         label={label}
         maxHeight={300}
         labelField={labelField}
         valueField={valueField}
         placeholder={placeholder}
         searchPlaceholder={searchPlaceholder}
      />
   </View>
)

const styles = StyleSheet.create({
   dropdown: {
      width: '100%',
      fontSize: 14,
   }
})

export default DropdownInput;