import { View, Text } from "react-native";
import React from "react";
import type { JSX } from "react";

type Props = {
   title: string;
   description: string;
};
export const TimeOpen = ({ title, description }: Props): JSX.Element => {
   return (
      <View className="flex flex-row items-center justify-between space-x-2">
         <Text className="text-sm text-dark font-bold">{title}</Text>
         <Text className="text-sm text-text font-medium">{description}</Text>
      </View>
   );
};
