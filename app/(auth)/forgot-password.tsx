import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { Colors } from 'lib';
import { ContainerBack, TextInputComponent, SpinLoading } from 'components';
import { getAuthErrorMessage } from 'services/firebase/Singin';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async () => {
        Keyboard.dismiss();

        if (!email.trim()) {
            Alert.alert("Error", "Ingresa tu correo electrónico.");
            return;
        }

        setLoading(true);
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email.trim().toLowerCase())
            setSent(true);
        } catch (e: any) {
            Alert.alert("Error", getAuthErrorMessage(e?.code ?? ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContainerBack>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={60}
            >
                {/* Header */}
                <View style={styles.top}>
                    <Text style={styles.title}>Recuperar contraseña</Text>
                    <Text style={styles.subtitle}>
                        {sent
                            ? `Enviamos un correo a ${email}. Revisa tu bandeja de entrada.`
                            : 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.'
                        }
                    </Text>
                </View>

                {/* Formulario */}
                {!sent ? (
                    <View style={styles.form}>
                        <TextInputComponent
                            value={email}
                            onChangeText={(e: string) => setEmail(e.trim().toLowerCase())}
                            placeholder="email@hotmail.com"
                            autoComplete="email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            label="Email"
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSend}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading
                                ? <SpinLoading color='#fff' />
                                : <Text style={styles.buttonText}>Enviar correo</Text>
                            }
                        </TouchableOpacity>
                    </View>
                ) : (
                    // ✅ Estado de éxito
                    <View style={styles.form}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSend}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading
                                ? <SpinLoading color='#fff' />
                                : <Text style={styles.buttonText}>Reenviar correo</Text>
                            }
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </ContainerBack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 32,
        paddingVertical: 32,
    },
    top: {
        flexDirection: 'column',
        gap: 8,
    },
    title: {
        color: '#1E232C',
        fontWeight: '700',
        fontSize: 24,
    },
    subtitle: {
        color: '#8391A1',
        fontSize: 14,
        lineHeight: 22,
    },
    form: {
        flexDirection: 'column',
        gap: 16,
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
    back: {
        marginHorizontal: 'auto',
        marginTop: 'auto',
    },
    backText: {
        color: '#040048',
        fontWeight: '600',
        fontSize: 14,
    },
});