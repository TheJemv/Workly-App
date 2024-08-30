import { useNavigation } from "@react-navigation/native"
import { useContext, useEffect, useRef, useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import PhoneInput from "react-native-phone-number-input";
import CountryCodeMap from "constants/countryCodeMap.json"
import { DataOptions, SpinLoading } from "components"


import AntDesign from "@expo/vector-icons/AntDesign"
import updateValue from "utils/updateValue"
import { AuthContext } from "context/AuthContext"
import getChangedProperties from "utils/CompareObjects"
import { updateCompany } from "services/api/company.api"
import getValue from "utils/getValue"
import { Colors } from "lib";
import useGlobal from "core/globals";


const OptionScreen = ({ route }) => {
   const { token } = useContext(AuthContext)
   const navigation = useNavigation()
   const dataOption = route.params
   const phoneInput = useRef()
   const inputRef = useRef(null);

   const companyData = useGlobal((state) => state.company);

   const [value, setValue] = useState(getValue(companyData, dataOption.key))
   const [loading, setLoading] = useState(false)


   const handleSaveData = async () => {
      setLoading(true)
      try {
         const editingData = updateValue(companyData, dataOption.key, value)
         const newData = getChangedProperties(companyData, editingData);
         await updateCompany(token, newData);
         navigation.goBack()
      } catch (error) {
         Alert.alert('Error', error.message);
      } finally {
         setLoading(false)
      }
   };


   useEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <TouchableOpacity onPress={handleSaveData} disabled={getValue(companyData, dataOption.key)===value}>
               <Text style={{fontWeight:600}} className={getValue(companyData, dataOption.key)!==value?"text-dark":"text-text/70"}>Listo</Text>
            </TouchableOpacity>
         ),
         headerBackVisible: !loading
      });
      inputRef.current?.focus();
   }, [navigation, value, dataOption?.value, loading]);


   const clearValue = () => {
      setValue("")
   }


   return (
      <View className="flex flex-col flex-1">
         {loading ? (
            <View className="h-1/2 items-center justify-center">
               <SpinLoading size={52} color={Colors.principal.DEFAULT} />
            </View>
         ) : (
            dataOption.key !== 'description' && dataOption.key !== 'phone' && dataOption.key !== 'public' ? (
               <View className="flex flex-col px-2 flex-1 py-3">
                  <View className="py-1 px-2 rounded-lg flex items-center flex-row border border-dark">
                     <View className="flex flex-col flex-1" style={{gap:0}}>
                        <Text style={{fontSize: 12}} className="text-text">{dataOption?.title}</Text>
                        <TextInput
                           ref={inputRef}
                           value={value}
                           onChangeText={(e) => setValue(e)}
                           placeholder={dataOption?.title.toLowerCase()}
                           className="pl-0"
                           style={{fontSize: 15}}
                           autoCapitalize='none'
                           keyboardType={dataOption?.key === "phone" && "phone-pad"}
                        />
                     </View>

                     <TouchableOpacity onPress={clearValue} className="py-full">
                        <AntDesign color={"black"} size={16} name="closecircle" />
                     </TouchableOpacity>
                  </View>
               </View>
            ) : dataOption.key === 'phone' ? (
               <PhoneInput
                  ref={phoneInput}
                  value={value.slice(-10)}
                  defaultCode={getValue(companyData, dataOption.key) ? CountryCodeMap.find(c => c.dial_code === getValue(companyData, dataOption.key).substring(0, getValue(companyData, dataOption.key).length - 10)).code : 'MX'}
                  layout="second"
                  onChangeFormattedText={(text) => {
                     setValue(text);
                  }}
                  withDarkTheme
                  autoFocus
                  containerStyle={{
                     width: '100%',
                     paddingTop: 12
                  }}
               />
            ) : dataOption.key === 'description' ? (
               <View className="border-black/20 border-b pb-2 px-1 py-2">
                  <TextInput
                     ref={inputRef}
                     value={value}
                     onChangeText={(e) => setValue(e)}
                     placeholder={dataOption?.title.toLowerCase()}
                     style={{fontSize: 16}}
                     multiline
                     maxLength={130}
                  />
               </View>
            ) : dataOption.key === "public" && (
               <DataOptions setValue={(e) => setValue(e === "publica"?true:false)} value={value?'publica':'privada'} data={['publica', 'privada']} />
            )
         )}
      </View>
   )
}

export default OptionScreen