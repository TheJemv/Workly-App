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
import { Colors } from '../../lib';
import {
    TextInputComponent,
    ContainerBack,
    SpinLoading,
} from '../../components';
import { Register } from "../../services/firebase/Register";
import { registerSchema } from "../../schemas/auth.schema";

const RegisterScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleLogin = () => router.push('/login');
    const handleTerms = () => router.push('/terms');

    const [user, setUser] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });

    const handleInput = (key, value) => {
        if (key === 'terms') {
            setUser(prevUser => ({
                ...prevUser,
                [key]: value,
            }));
            return;
        }

        let trimmedValue = value.trim();
        if (key === 'email') {
            trimmedValue = trimmedValue.toLowerCase();
        }

        setUser(prevUser => ({
            ...prevUser,
            [key]: trimmedValue,
        }));

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[key]) {
            setErrors(prev => ({
                ...prev,
                [key]: undefined
            }));
        }
    };

    const validateForm = () => {
        try {
            registerSchema.parse(user);
            setErrors({});
            return true;
        } catch (error) {
            if (error.errors) {
                const formattedErrors = {};
                error.errors.forEach(err => {
                    formattedErrors[err.path[0]] = err.message;
                });
                setErrors(formattedErrors);
            }
            return false;
        }
    };

    const handleRegisterUser = async () => {
        // Cerrar teclado
        Keyboard.dismiss();

        // Validar formulario
        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            Alert.alert("Error de validación", firstError || "Por favor corrige los errores");
            return;
        }

        // Validar aceptación de términos
        if (!user.terms) {
            Alert.alert("Error", "Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        setLoading(true);
        await Register(user)
            .catch((e) => {
                Alert.alert("Error", e.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ContainerBack>
            <View style={styles.container}>
                {/* Titulo... */}
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
                        <View>
                            <TextInputComponent
                                value={user.email}
                                onChangeText={e => handleInput('email', e)}
                                label="Email"
                                placeholder="email@hotmail.com"
                                autoComplete="email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}
                        </View>

                        <View>
                            <TextInputComponent
                                hide
                                value={user.password}
                                onChangeText={e => handleInput('password', e)}
                                label="Password"
                                placeholder="password"
                                autoComplete="password"
                                autoCapitalize="none"
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            )}
                        </View>

                        <View>
                            <TextInputComponent
                                hide
                                value={user.confirmPassword}
                                onChangeText={e => handleInput('confirmPassword', e)}
                                label="Confirm Password"
                                placeholder="password"
                                autoComplete="password"
                                autoCapitalize="none"
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}
                        </View>

                        {/* Check point */}
                        <View style={styles.termsContainer}>
                            <Checkbox
                                value={user.terms}
                                onValueChange={(val) => {
                                    handleInput('terms', val);
                                }}
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
                        <View style={styles.bottom}>
                            <TouchableOpacity
                                onPress={handleRegisterUser}
                                style={styles.button}
                                disabled={loading}
                            >
                                {!loading ? (
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                ) : (
                                    <SpinLoading />
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.login}>
                            <Text style={styles.loginText}>
                                Ya tienes cuenta?
                            </Text>
                            <TouchableOpacity onPress={handleLogin}>
                                <Text style={styles.loginLink}>
                                    Inicia Sesion
                                </Text>
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
        backgroundColor: 'white',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        marginHorizontal: 'auto',
        height: '100%',
        marginVertical: 32,
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
        gap: 24,
    },
    inputsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    termsTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    termsLink: {
        color: '#040048',
        fontWeight: '600'
    },
    bottomContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    bottom: {
        width: '100%',
        marginHorizontal: 'auto',
        gap: 24,
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
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        marginHorizontal: 'auto',
    },
    loginText: {
        color: Colors.secondary.DEFAULT
    },
    loginLink: {
        color: '#040048',
        fontWeight: '600'
    }
});

export default RegisterScreen;