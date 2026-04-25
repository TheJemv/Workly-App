import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack initialRouteName='index' screenOptions={{ headerShown: false }}>
            <Stack.Screen options={{ headerShown: false, animation: 'none' }} name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />

            <Stack.Screen name="forgot-password" />

            <Stack.Screen
                name='terms'
                options={{
                    presentation: "modal",
                    headerShown: true,
                    title: "Workly"
                }}
            />
        </Stack>
    );
}