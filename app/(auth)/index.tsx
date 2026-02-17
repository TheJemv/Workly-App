import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from 'lib';

export default function WelcomeScreen() {
    const router = useRouter();

    const handleSignIn = () => router.push('/login');
    const handleSignUp = () => router.push('/register');

    return (
        <ImageBackground source={require("assets/LoginImage.jpg")} style={styles.container}>
            <View style={styles.bottomContainer}>
                <View style={{ flex: 1 }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={styles.bottomContainer.title}>Bienvenido a</Text>
                        <Text style={styles.bottomContainer.subName}>Workly</Text>
                    </View>
                    <Text style={{ color: Colors.gray.DEFAULT, marginTop: 18 }}>
                        Bienvenido a WorkIt, somos una empresa que gestiona y vende
                        tus servicios, donde como cliente puedes encontrar todos los
                        servicos, entre yaaa!
                    </Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 50,
                                backgroundColor: '#24214a',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: Colors.white,
                                }}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSignIn}
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 50,
                                backgroundColor: Colors.white,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 18,
                                    color: '#040048',
                                }}
                            >
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        backgroundColor: Colors.white,
        borderColor: '#b0aed720',
        borderWidth: 3,
        height: '50%',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        paddingVertical: 36,
        title: {
            color: '#d2d0f0',
            fontWeight: '700',
            fontSize: 46,
        },
        subName: {
            color: '#24214a',
            fontWeight: '700',
            fontSize: 46,
        },
    },
    buttons: {
        borderWidth: 1,
        borderRadius: 50,
        width: '100%',
        marginTop: 'auto',
        borderColor: '#24214a',
        display: 'flex',
        flexDirection: 'row',
    },
});