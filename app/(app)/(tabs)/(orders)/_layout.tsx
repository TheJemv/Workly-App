import CustomBackButton from "components/Header/CustomBackButton";
import { Stack } from "expo-router";
import { Colors } from "lib";

export default function OrdersLayout() {
    return (
        <Stack
            screenOptions={{
                headerTintColor: Colors.principal.DEFAULT,
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                },
                headerShown: false,
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "transparent",
                }
            }}
        >
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false, // Los tabs manejan su propio header
                }}
            />
            <Stack.Screen
                name="order"
                options={{
                    title: "Detalles de la Orden",
                    headerShown: true,
                    headerLeft: () => <CustomBackButton />
                }}
            />
        </Stack>
    );
}