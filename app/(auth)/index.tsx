import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from 'lib';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const bgImage = require("assets/LoginImage.jpg");
    const insets = useSafeAreaInsets();

    const handleSignIn = () => router.push('/login');
    const handleSignUp = () => router.push('/register');
    const handleBack = () => {
        router.replace('/(app)/(home)');
    };

    return (
        <View style={styles.container}>
            <Image
                source={bgImage}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={0}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity onPress={handleBack}>
                    <View style={styles.backButton}>
                        <Entypo name="chevron-left" color="#1E232C" size={24} />
                    </View>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.bottomContainer}>
                <View style={{ flex: 1 }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={styles.title}>Inicia en</Text>
                        <Text style={styles.subName}>Workly</Text>
                    </View>

                    <Text style={{ color: Colors.gray.DEFAULT, marginTop: 18, fontSize: 16 }}>
                        Bienvenido a Workly, la plataforma que conecta a clientes
                        con los profesionales más cualificados de tu ciudad.
                        Contrata servicios de forma inmediata, segura y sin
                        complicaciones, desde la palma de tu mano.
                    </Text>

                    <View style={[styles.buttons, { marginBottom: Platform.OS === "android" ? insets.bottom : 0 }]}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 18,
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
    },
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
    buttons: {
        borderWidth: 1,
        borderRadius: 50,
        width: '100%',
        marginTop: 'auto',
        borderColor: '#24214a',
        flexDirection: 'row',

    },
    backButton: {
        alignSelf: 'flex-start',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E8ECF4",
        padding: 4,
        marginStart: 6,
        backgroundColor: Colors.white,
    }
});
