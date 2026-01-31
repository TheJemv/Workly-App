import { createMaterialTopTabNavigator, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import useGlobal from "core/globals";
import { Colors } from "lib";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabsLayout() {
    const company = useGlobal((s) => s.company);

    // Si no es empresa, solo muestra index sin tabs
    if (!company) {
        return (
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Ordenes",
                        headerShown: true,
                        headerTintColor: Colors.principal.DEFAULT,
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20,
                        },
                        headerStyle: {
                            backgroundColor: "transparent",
                        },
                        headerShadowVisible: true,
                    }}
                />
            </Stack>
        );
    }

    // Si es empresa, muestra tabs
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray[200] }}>
            <MaterialTopTabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: Colors.gray[200],
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.5,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: Colors.principal[400],
                        height: 3,
                    },
                    tabBarLabelStyle: {
                        color: Colors.principal[500],
                        fontWeight: '800',
                        textTransform: "capitalize",
                        fontSize: 14,
                    },
                    tabBarActiveTintColor: Colors.principal[500],
                    tabBarInactiveTintColor: Colors.gray[500],
                    animationEnabled: true,
                    swipeEnabled: true,
                }}
                initialRouteName="index"
            >
                <MaterialTopTabs.Screen
                    name="index"
                    options={{ title: "Ordenes" }}
                />
                <MaterialTopTabs.Screen
                    name="sales"
                    options={{ title: "Ventas" }}
                />
            </MaterialTopTabs>
        </SafeAreaView>
    );
}