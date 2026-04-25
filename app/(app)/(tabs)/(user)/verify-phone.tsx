import React, { useRef, useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Colors } from 'lib';
import { SpinLoading } from 'components';
import PhoneInput from 'react-native-phone-number-input';

import { getAuth, verifyPhoneNumber } from '@react-native-firebase/auth';


export default function VerifyPhone() {
    const router = useRouter();
    const phoneRef = useRef<PhoneInput>(null);
    const [phone, setPhone] = useState('');
    const [formattedPhone, setFormattedPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = getAuth();
    const hasPhone = auth.currentUser?.providerData.some(p => p.providerId === 'phone');

    const handleSend = async () => {
        Keyboard.dismiss();

        const isValid = phoneRef.current?.isValidNumber(phone);
        if (!isValid) {
            Alert.alert("Error", "Ingresa un número de teléfono válido.");
            return;
        }

        setLoading(true);
        try {
            const confirmation = await verifyPhoneNumber(getAuth(), formattedPhone, 180); // 60 = timeout en segundos
            router.push({ pathname: '/verify-code', params: { verificationId: confirmation.verificationId } });
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "No se pudo enviar el código.");
        } finally {
            setLoading(false);
        }
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
                    <Text style={styles.title}>
                        {hasPhone ? 'Actualiza tu teléfono' : 'Vincula tu teléfono'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {hasPhone
                            ? 'Ingresa tu nuevo número y te enviaremos un código SMS para actualizarlo.'
                            : 'Ingresa tu número y te enviaremos un código SMS para vincularlo a tu cuenta.'
                        }
                    </Text>
                </View>

                {/* Input */}
                <View style={styles.form}>
                    <PhoneInput
                        withShadow
                        autoFocus
                        ref={phoneRef}
                        defaultCode="MX"
                        layout="first"
                        onChangeText={setPhone}
                        onChangeFormattedText={setFormattedPhone}
                        containerStyle={styles.phoneContainer}
                        textContainerStyle={styles.phoneTextContainer}
                        textInputStyle={styles.phoneTextInput}
                        flagButtonStyle={styles.flagButton}
                        codeTextStyle={styles.codeText}
                        placeholder="Número de teléfono"
                    />

                    <TouchableOpacity
                        style={[styles.button, !phone && styles.buttonDisabled]}
                        onPress={handleSend}
                        disabled={loading || !phone}
                        activeOpacity={0.8}
                    >
                        {loading
                            ? <SpinLoading color='#fff' />
                            : <Text style={styles.buttonText}>Enviar código</Text>
                        }
                    </TouchableOpacity>
                </View>
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 18,
        height: '100%',
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
    phoneContainer: {
        width: '100%',
        backgroundColor: '#F7F8F9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DADADA',
        height: 52,
    },
    phoneTextContainer: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 0,
    },
    phoneTextInput: {
        fontSize: 14,
        color: '#1E232C',
        height: 50,
    },
    flagButton: {
        borderRightWidth: 1,
        borderRightColor: '#DADADA',
    },
    codeText: {
        fontSize: 14,
        color: '#1E232C',
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
});