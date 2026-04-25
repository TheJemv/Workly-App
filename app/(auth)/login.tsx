import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from "lib"

// Icons
import {
    ContainerBack,
    SpinLoading,
    TextInputComponent,
} from 'components';
import { Singin } from 'services/firebase/Singin';

import LoginApple from 'auth/buttons/LoginApple';
import LoginGoogle from 'auth/buttons/LoginGoogle';


const LoginScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ email: '', password: '' });

    const handleRegister = () => router.push('/register');
    const handleLoginUser = async () => {
        setLoading(true);
        await Singin(user).catch(e => {
            Alert.alert("Error", e.message); // 👈 "Correo o contraseña incorrectos."
        }).finally(() => {
            setLoading(false)
        })
    };

    const handleInput = (key, value) => {
        const trimmedValue = value.trim();
        setUser(prevUser => ({
            ...prevUser,
            [key]: trimmedValue,
        }));
    };

    return (
        <ContainerBack>
            <KeyboardAvoidingView
                style={styles.fills}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={60}
            >
                {/* Titulo... */}
                <View style={styles.top}>
                    <Text style={styles.topTitle}>Bienvenido de nuevo!, Tus Servicios al instante...</Text>
                </View>

                {/* Inputs... */}
                <View style={styles.inputsContainer}>
                    <TextInputComponent
                        value={user.email}
                        onChangeText={e => handleInput("email", e)}
                        placeholder="Ingresa tu email"
                        autoComplete="email"
                        keyboardType="email-address"
                    />

                    <TextInputComponent
                        hide
                        value={user.password}
                        onChangeText={e => handleInput("password", e)}
                        placeholder="Ingresa tu contraseña"
                        autoComplete="password"
                    />

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push("/forgot-password")}>
                        <Text style={styles.forgotPasswordText}>
                            Olvidaste la contraseña?
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Iniciar sesion... */}
                <TouchableOpacity
                    onPress={handleLoginUser}
                    style={styles.button}
                >
                    {!loading ? (
                        <Text style={styles.buttonText}>Iniciar Sesion</Text>
                    ) : (
                        <SpinLoading color='#fff' />
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>

            {/* Aplicacion */}
            <View style={styles.bottom}>
                <View style={styles.lines}>
                    <View style={styles.line} />
                    <Text style={styles.linesText}>O Inicia Sesion con</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialMedia}>
                    <LoginGoogle />
                    <LoginApple />
                    {/* <LoginFacebook /> */}
                </View>
            </View>

            <View style={styles.register}>
                <Text style={styles.registerText}>
                    No tienes cuenta?
                </Text>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.registerLink}>
                        Registrate
                    </Text>
                </TouchableOpacity>
            </View>
        </ContainerBack>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '85%',
        marginHorizontal: 'auto',
    },
    top: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    topTitle: {
        color: '#1E232C',
        fontWeight: '700',
        fontSize: 24,
    },
    fills: {
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        marginBottom: "auto",
        paddingVertical: 32,
        flex: 1,
    },
    inputsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12
    },
    forgotPassword: {
        marginLeft: 'auto'
    },
    forgotPasswordText: {
        color: '#040048',
        fontWeight: '600'
    },
    button: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        backgroundColor: '#1E232C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
    },
    bottom: {
        width: '100%',
        marginHorizontal: 'auto',
        gap: 24,
        marginBottom: 48,
    },
    lines: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    linesText: {
        marginHorizontal: 10,
    },
    socialMedia: {
        flexDirection: "row",
        width: "100%",
        gap: 12
    },
    register: {
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        marginHorizontal: 'auto',
        marginBottom: 48,
    },
    registerText: {
        color: Colors.secondary.DEFAULT
    },
    registerLink: {
        color: '#040048',
        fontWeight: '600'
    }
});

export default LoginScreen;