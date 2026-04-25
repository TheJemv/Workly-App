import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
} from 'react-native';
import { Checkbox } from "expo-checkbox"
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from 'lib';
import {
    TextInputComponent,
    ContainerBack,
    SpinLoading,
} from 'components';
import { Register } from "services/firebase/Register";

const RegisterScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });

    const handleLogin = () => router.push('/login');
    const handleTerms = () => router.push('/terms');

    const handleInput = (key: string, value: string | boolean) => {
        setUser(prev => ({
            ...prev,
            [key]: typeof value === 'string'
                ? key === 'email' ? value.trim().toLowerCase() : value.trim()
                : value,
        }));
    };

    const handleRegisterUser = async () => {
        Keyboard.dismiss();

        if (!user.terms) {
            Alert.alert("Error", "Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        setLoading(true);
        await Register(user)
            .catch(e => Alert.alert("Error", e.message))
            .finally(() => setLoading(false));
    };

    return (
        <ContainerBack>
            <View style={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.topTitle}>
                        Bienvenido de nuevo!, Tus Servicios al instante...
                    </Text>
                </View>

                <KeyboardAvoidingView
                    style={styles.fills}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={110}
                >
                    <View style={styles.inputsContainer}>
                        <TextInputComponent
                            value={user.email}
                            onChangeText={e => handleInput('email', e)}
                            label="Email"
                            placeholder="email@hotmail.com"
                            autoComplete="email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TextInputComponent
                            hide
                            value={user.password}
                            onChangeText={e => handleInput('password', e)}
                            label="Password"
                            placeholder="password"
                            autoComplete="password"
                            autoCapitalize="none"
                        />

                        <TextInputComponent
                            hide
                            value={user.confirmPassword}
                            onChangeText={e => handleInput('confirmPassword', e)}
                            label="Confirm Password"
                            placeholder="password"
                            autoComplete="password"
                            autoCapitalize="none"
                        />

                        <View style={styles.termsContainer}>
                            <Checkbox
                                value={user.terms}
                                onValueChange={val => handleInput('terms', val)}
                                color={Colors.principal.DEFAULT}
                            />
                            <View style={styles.termsTextContainer}>
                                <Text>Acepto los </Text>
                                <TouchableOpacity onPress={handleTerms}>
                                    <Text style={styles.termsLink}>
                                        Terminos y Condiciones
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            onPress={handleRegisterUser}
                            style={styles.button}
                            disabled={loading}
                        >
                            {!loading ? (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            ) : (
                                <SpinLoading color='#ffffff' />
                            )}
                        </TouchableOpacity>

                        <View style={styles.login}>
                            <Text style={styles.loginText}>Ya tienes cuenta?</Text>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.loginLink}>Inicia Sesion</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ContainerBack>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        marginVertical: 32,
    },
    top: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    topTitle: {
        color: '#1E232C',
        fontWeight: '700',
        fontSize: 24,
    },
    fills: {
        flexDirection: 'column',
        gap: 24,
    },
    inputsContainer: {
        flexDirection: "column",
        gap: 12,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    termsTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    termsLink: {
        color: '#040048',
        fontWeight: '600',
    },
    bottomContainer: {
        flexDirection: 'column',
        gap: 16,
    },
    button: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        backgroundColor: '#1E232C',
        borderColor: '#1E232C',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
    },
    login: {
        flexDirection: 'row',
        gap: 4,
        marginHorizontal: 'auto',
    },
    loginText: {
        color: Colors.secondary.DEFAULT,
    },
    loginLink: {
        color: '#040048',
        fontWeight: '600',
    },
});

export default RegisterScreen;