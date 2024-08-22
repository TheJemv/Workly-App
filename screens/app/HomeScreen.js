import React, { useLayoutEffect, useState } from 'react';

import { Grid } from 'components';
import { HomeServicesData } from "data"
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
   const navigation = useNavigation()
   useLayoutEffect(() => {
      navigation.setOptions({
         headerLargeTitle: true,
         headerSearchBarOptions: {
            placeholder: "search..."
         }
      })
   }, [navigation])

   return (
      <>
         <Grid data={HomeServicesData} />
      </>
   );
};

export default HomeScreen;
