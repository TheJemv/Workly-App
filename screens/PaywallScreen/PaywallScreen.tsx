/**
 * @file Paywall Screen.
 * @author Vadim Savin
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import Purchases from 'react-native-purchases';
import styles from './styles';
import PackageItem from 'components/PackageItem/PackageItem';

const PaywallScreen = () => {
  const [packages, setPackages] = useState([]);

  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        // Alert.alert('Error getting offers', e.message);
        console.error('Error getting offers', e.message);
      }
    };

    getPackages();
  }, []);

  const header = () => <Text style={styles.text}>Workit Premium</Text>;

  const footer = () => {
    console.warn(
      "Modify this value to reflect your app's Privacy Policy and Terms & Conditions agreements. Required to make it through App Review.",
    );
    return (
      <Text style={styles.text}>
        Basic paywall Template
      </Text>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.text}>No packages available at the moment</Text>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={packages}
        renderItem={({ item }) => <PackageItem purchasePackage={item} setIsPurchasing={setIsPurchasing} />}
        keyExtractor={(item) => item.identifier}
        ListEmptyComponent={emptyComponent}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={styles.headerFooterContainer}
        ListFooterComponent={footer}
        ListFooterComponentStyle={styles.headerFooterContainer}
      />
      {isPurchasing && <View style={styles.overlay} />}
    </View>
  );
};

export default PaywallScreen;