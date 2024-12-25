import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import { View, ScrollView, TouchableOpacity, Alert, Text, SafeAreaView, StatusBar  } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SpinLoading, TextInputUser, ThumnailEdit } from 'components';
import * as Location from 'expo-location';
import { Colors } from 'lib';
import MapView, { Marker } from 'react-native-maps';
import { getStreetName } from 'services/api/google.api';
import { Entypo } from '@expo/vector-icons';
import useGlobal from 'core/globals';
import isEqual from 'lodash/isEqual';
import getChangedProperties from 'utils/CompareObjects';
import { updatedCustomer } from 'services/api/customer.api';



const Profile = () => {
   // Globals Variables
   const customer = useGlobal(state => state.customer);
   const token = useGlobal(state => state.token);

   // Variables
   const navigation = useNavigation();

   // UseStates
   const [loading, setLoading] = useState(false);
   const [thumbnail, setThumbnail] = useState(customer?.profile?.photo || null);
   const [valueDataEdit, setValueDataEdit] = useState(customer);
   const [markerCoordinate, setMarkerCoordinate] = useState({
      latitude: customer?.address?.latitude || 0,
      longitude: customer?.address?.longitude || 0,
   });
   const [markerDirection, setMarkerDirection] = useState(null);
   const [locationNow, setLocationNow] = useState({
      latitude: customer?.address?.latitude || 0,
      longitude: customer?.address?.longitude || 0,
   });

   // Functions
   const handleValue = useCallback((key, handleValue) => {
      setValueDataEdit(prevValue => {
         const keys = key.split('.');
         const newValue = JSON.parse(JSON.stringify(prevValue)); // Deep clone using JSON methods
         let temp = newValue;
         for (let i = 0; i < keys.length - 1; i++) {
            if (!temp[keys[i]]) {
               temp[keys[i]] = {};
            }
            temp = temp[keys[i]];
         }
         temp[keys[keys.length - 1]] = handleValue;
         return newValue;
      });
   }, []);

   const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
         Alert.alert('Error', 'Permiso denegado para acceder a la ubicación');
         return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocationNow({
         latitude: currentLocation.coords.latitude,
         longitude: currentLocation.coords.longitude,
      });

      try {
         const res = await getStreetName(currentLocation.coords.latitude, currentLocation.coords.longitude);
         setMarkerDirection(res);
      } catch (e) {
         Alert.alert('Error', e.message);
      }
   };


   const handleEditProfile = async () => {
      const newData = getChangedProperties(customer, valueDataEdit);
      setLoading(true);
      await updatedCustomer(token, newData).catch((e) => {
         Alert.alert('Error', e.message)
      }).finally(() => {
         setLoading(false);
      });
   }

   // UseEffects
   useEffect(() => {
      setValueDataEdit(customer);
   }, [customer]);

   useEffect(() => {
      navigation.setOptions({
         headerTitle: 'Perfil',
         headerRight: () => (
            !isEqual(customer, valueDataEdit) && (
               <TouchableOpacity disabled={loading} onPress={handleEditProfile}>
                  <Entypo color={Colors.principal.DEFAULT} name="save" size={24} />
               </TouchableOpacity>
            )
         ),
      });
   }, [navigation, valueDataEdit, customer, loading]);

   useEffect(() => {
      (async () => {
         await getLocation();
      })();
   }, []);

   useEffect(() => {
      const updateAddress = async () => {
         handleValue('address.latitude', markerCoordinate.latitude);
         handleValue('address.longitude', markerCoordinate.longitude);

         await getStreetName(markerCoordinate.latitude, markerCoordinate.longitude).then((res) => {
            setMarkerDirection(res);
         }).catch((e) => {
            Alert.alert('Error', e.message);
         });
      };

      updateAddress();
   }, [markerCoordinate, markerDirection]);

   // Return
   return (
      loading ? (
         <View style={{flex: 1}} className="flex flex-col items-center justify-center">
            <SpinLoading color={Colors.principal.DEFAULT} size={46} />
         </View>
      ) : (
         <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
            <ScrollView style={{ gap: 32 }}>
               <View style={{ gap: 32, paddingBottom: 70 }}>
                  <View style={{ alignItems: 'center' }}>
                     <ThumnailEdit thumbnail={thumbnail} setThumbnail={setThumbnail} getDataPhoto={(e) => handleValue('profile.photo', e)} />
                  </View>

                  <View style={{ paddingHorizontal: 16, gap: 20 }}>
                     <TextInputUser
                        label='Nombre'
                        placeholder="nombre"
                        value={valueDataEdit?.profile?.name || ''}
                        setValue={e => handleValue('profile.name', e)}
                     />
                     <TextInputUser
                        label='Apellidos'
                        placeholder="apellidos"
                        value={valueDataEdit?.profile?.lastName || ''}
                        setValue={e => handleValue('profile.lastName', e)}
                     />
                     <TextInputUser
                        label='Telefono'
                        placeholder="telefono"
                        value={valueDataEdit?.profile?.phone || ''}
                        setValue={e => handleValue('profile.phone', e)}
                     />
                     <TextInputUser
                        label='Fecha de nacimiento'
                        placeholder="fecha de nacimiento"
                        value={valueDataEdit?.profile?.bornDate || ''}
                        setValue={e => handleValue('profile.birthday', e)}
                     />

                     <View style={{ gap: 4 }}>
                        <Text style={{
                           color: Colors.principal.DEFAULT,
                           fontSize: 14,
                           fontWeight: '700',
                        }}>Calle</Text>
                        <Text
                           numberOfLines={1}
                           style={{
                              borderWidth: 1,
                              borderRadius: 8,
                              borderColor: "rgba(4,4,4,0.1)",
                           }}
                           className="py-2 px-2"
                        >{markerDirection || 'No disponible'}</Text>
                     </View>

                     <View style={{ gap: 4 }}>
                        <Text style={{
                           color: Colors.principal.DEFAULT,
                           fontSize: 14,
                           fontWeight: '700',
                        }}>Ubicación</Text>
                        {locationNow.latitude !== 0 && (
                           <MapView
                              zoomControlEnabled={true}
                              style={{
                                 height: 300,
                                 width: '100%',
                                 borderRadius: 12,
                              }}
                              initialRegion={{
                                 latitudeDelta: 0.0022,
                                 longitudeDelta: 0.0021,
                                 latitude: locationNow.latitude,
                                 longitude: locationNow.longitude,
                              }}
                              showsUserLocation={true}
                              onRegionChangeComplete={(region) => {
                                 setLocationNow({
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                 });
                              }}
                              mapType="satellite"
                           >
                              <Marker
                                 coordinate={markerCoordinate}
                                 title="Mi ubicación"
                                 description={markerDirection}
                                 draggable={true}
                                 onDragEnd={(e) => {
                                    setMarkerCoordinate({
                                       latitude: e.nativeEvent.coordinate.latitude,
                                       longitude: e.nativeEvent.coordinate.longitude,
                                    });
                                    getStreetName(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
                                       .then((res) => {
                                          setMarkerDirection(res);
                                       })
                                       .catch((e) => {
                                          Alert.alert('Error', e.message);
                                       });
                                 }}
                              />
                           </MapView>
                        )}
                     </View>
                  </View>
               </View>
            </ScrollView>
         </SafeAreaView>
      )
   );
};

export default Profile;