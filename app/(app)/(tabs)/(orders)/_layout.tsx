import CustomBackButton from "components/Header/CustomBackButton";
import { Stack } from "expo-router";
import { Colors } from "lib";

export default function OrdersLayout() {
    return (
        <Stack
            screenOptions={{
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
                    headerShown: false,
                }}
            />
            {/* <Stack.Screen
                name="order"
                options={{
                    title: "Detalles de la Orden",
                    headerShown: true,
                    headerLeft: () => <CustomBackButton />
                }}
            /> */}
        </Stack>
    );
}