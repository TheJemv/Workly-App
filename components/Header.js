import React, {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Colors, Padding } from '../lib';
import { useRef, useState } from 'react';

const Header = ({
   title = 'Work IT',
   searchValue,
   setSearchValue,
   onSearch,
   setFocusSearch,
}) => {
   const [onFocus, setOnFocus] = useState(false);

   const inputButton = useRef();
   const cancelButton = () => {
      setSearchValue('');
      if (inputButton.current) {
         inputButton.current.blur();
         setOnFocus(false);
         setFocusSearch(false);
      }
   };
   const clearSearch = () => {
      setSearchValue('');
   };
   const onFocusCallback = () => {
      setOnFocus(true);
      setFocusSearch(true);
   };

   return (
      <View style={styles.Container}>
         <Text style={[{ fontWeight: 700 }, styles.Text]}>{title}</Text>
         {onSearch && (
            <View style={styles.SearchBarContainer}>
               <View style={styles.SearchBar}>
                  <Feather name="search" style={styles.SearchBar.Icon} />
                  <TextInput
                     value={searchValue}
                     onChangeText={setSearchValue}
                     style={styles.SearchBar.Input}
                     ref={inputButton}
                     placeholder="Buscar..."
                     onFocus={onFocusCallback}
                  />
                  {searchValue && (
                     <TouchableOpacity
                        style={{
                           backgroundColor: Colors.secondary.DEFAULT,
                           padding: 1,
                           borderRadius: 50,
                        }}
                        onPress={clearSearch}
                     >
                        <Feather
                           name="x"
                           style={{
                              color: Colors.white,
                              fontSize: 14,
                           }}
                        />
                     </TouchableOpacity>
                  )}
               </View>

               {onFocus && (
                  <TouchableOpacity onPress={cancelButton}>
                     <Text style={{ color: Colors.blue[600] }}>cancelar</Text>
                  </TouchableOpacity>
               )}
            </View>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   Container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      gap: 12,
      backgroundColor: Colors.transparent,
   },
   Text: {
      textAlign: 'center',
      fontSize: 26,
      color: Colors.principal.DEFAULT,
   },

   SearchBarContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '95%',
      alignItems: 'center',
      gap: Padding[2],
   },

   SearchBar: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      padding: Padding[1],
      backgroundColor: '#f8f6ff',
      borderRadius: 4,

      Icon: {
         fontSize: 18,
         color: Colors.secondary.DEFAULT,
      },

      Input: {
         flex: 1,
         fontSize: 16,
      },
   },
});

export default Header