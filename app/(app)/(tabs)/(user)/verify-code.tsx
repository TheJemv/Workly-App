import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAuth, PhoneAuthProvider, linkWithCredential } from '@react-native-firebase/auth';
import { Colors } from 'lib';
import { SpinLoading } from 'components';

const CODE_LENGTH = 6;

export default function VerifyCode() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const verificationId = params.verificationId as string;
    const phone = params.phone as string;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleVerify = async () => {
        if (code.length < CODE_LENGTH) {
            Alert.alert("Error", "Ingresa el código de 6 dígitos.");
            return;
        }

        setLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) throw new Error("No hay sesión activa.");

            const credential = PhoneAuthProvider.credential(verificationId, code);

            const hasPhone = user.providerData.some(p => p.providerId === "phone");

            if (hasPhone) {
                await user.updatePhoneNumber(credential);   // 🔁 cambia el número
            } else {
                await user.linkWithCredential(credential);  // 🔗 vincula el número
            }

            // 🔄 refrescar usuario y token
            await user.reload();
            await user.getIdToken(true);

            Alert.alert("¡Listo!", "Tu número ha sido actualizado.", [
                { text: "OK", onPress: () => router.back() }
            ]);

        } catch (e: any) {
            if (e?.code === 'auth/invalid-verification-code') {
                Alert.alert("Error", "El código ingresado es incorrecto.");
            } else if (e?.code === 'auth/phone-number-already-exists') {
                Alert.alert("Error", "Este número ya está vinculado a otra cuenta.");
            } else if (e?.code === 'auth/credential-already-in-use') {
                Alert.alert("Error", "Este número ya está en uso por otra cuenta.");
            } else {
                Alert.alert("Error", e?.message ?? "No se pudo verificar el código.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Renderiza los 6 cajitas del código
    const renderBoxes = () => {
        return Array(CODE_LENGTH).fill(0).map((_, i) => {
            const isActive = code.length === i;
            const char = code[i] ?? '';
            return (
                <TouchableOpacity
                    key={i}
                    onPress={() => inputRef.current?.focus()}
                    style={[
                        styles.box,
                        isActive && styles.boxActive,
                        char && styles.boxFilled,
                    ]}
                    activeOpacity={1}
                >
                    <Text style={styles.boxText}>{char}</Text>
                </TouchableOpacity>
            );
        });
    };

    return (
        <View style={styles.containerTwo}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={60}
            >
                {/* Header */}
                <View style={styles.top}>
                    <Text style={styles.title}>Ingresa el código</Text>
                    <Text style={styles.subtitle}>
                        Enviamos un código SMS a {phone}. Puede tardar unos segundos.
                    </Text>
                </View>

                {/* Cajitas del código */}
                <TouchableOpacity
                    onPress={() => inputRef.current?.focus()}
                    activeOpacity={1}
                    style={styles.boxesContainer}
                >
                    {renderBoxes()}
                </TouchableOpacity>

                {/* Input oculto que captura el texto */}
                <TextInput
                    ref={inputRef}
                    value={code}
                    onChangeText={text => setCode(text.replace(/\D/g, '').slice(0, CODE_LENGTH))}
                    keyboardType="numeric"
                    maxLength={CODE_LENGTH}
                    style={styles.hiddenInput}
                    caretHidden
                />

                {/* Botón verificar */}
                <TouchableOpacity
                    style={[styles.button, code.length < CODE_LENGTH && styles.buttonDisabled]}
                    onPress={handleVerify}
                    disabled={loading || code.length < CODE_LENGTH}
                    activeOpacity={0.8}
                >
                    {loading
                        ? <SpinLoading color='#fff' />
                        : <Text style={styles.buttonText}>Verificar</Text>
                    }
                </TouchableOpacity>

                {/* Reenviar */}
                <TouchableOpacity onPress={() => router.back()} style={styles.resend}>
                    <Text style={styles.resendText}>¿No te llegó? Cambiar número</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Text style={styles.backText}>Volver</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        gap: 32,
        paddingVertical: 32,
    },
    containerTwo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 18,
        marginHorizontal: 'auto',
        height: '100%',
        paddingVertical: 0,
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
    boxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    box: {
        flex: 1,
        height: 56,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#DADADA',
        backgroundColor: '#F7F8F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxActive: {
        borderColor: '#1E232C',
        backgroundColor: '#fff',
    },
    boxFilled: {
        borderColor: '#1E232C',
        backgroundColor: '#fff',
    },
    boxText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E232C',
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0,
    },
    button: {
        width: '100%',
        height: 52,
        borderRadius: 12,
        backgroundColor: '#1E232C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
    },
    resend: {
        marginHorizontal: 'auto',
    },
    resendText: {
        color: '#8391A1',
        fontSize: 13,
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