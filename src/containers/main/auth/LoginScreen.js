import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../actions/auth";

const SignIn = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        email: '',
        password: '',
        errMess: null,
    });

    const dispatch = useDispatch();
    const { message } = useSelector(state => state.message);

    const handleLogin = () => {
        const { email, password } = state;

        setLoading(true);

        if (true) {
            dispatch(login(email, password))
                .then(() => {
                    navigation.navigate("Home");
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        /*
        const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        {
            !email || check.test(email.toString()) === false
                ? setState({ errMess: 'Email formatını doğru giriniz' })
                : dispatch(login(email, password))
                    .then(() => {
                        navigation.navigate("Home");
                    })
                    .catch(() => {
                        setLoading(false);
                    });


        }*/
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <Text style={styles.greeting}>{`Merhaba.\nHoşgeldiniz`}</Text>
            <View style={styles.errMess}>
                {/*state.errMess && <Text style={styles.error}>{state.errMess}</Text>*/}
            </View>
            <View style={styles.form}>
                <KeyboardAvoidingView behavior="position">
                    <Text style={styles.inputTitle}>Kullanıcı Adı</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={email => {
                            setState({ ...state, email });
                        }}
                        value={state.email}
                    />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView>
                    <Text style={styles.inputTitle}>Şifre</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={password => {
                            setState({ ...state, password });
                        }}
                        value={state.password}
                    />
                </KeyboardAvoidingView>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.textButton}>Giriş yap</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => {
                        navigation.navigate('SignUp');
                    }}>
                    <Text style={styles.textButton2}>
                        Yeni misin ?{' '}
                        <Text style={{ fontWeight: '500', color: '#2c3ea7' }}> Kayıt ol</Text>
                    </Text>
                </TouchableOpacity>


                {
                    <TouchableOpacity
                        style={styles.button2}
                        onPress={() => {
                            navigation.navigate('ResetPassword');
                        }}>
                        <Text style={styles.textButton2}>
                            Şifremi Unuttum
                    </Text>
                    </TouchableOpacity>
                }

            </View>

            {message && (
                <View style={styles.error}>
                    <Text style={styles.errMess}>
                        {message}
                    </Text>
                    {state.errMess && <Text style={styles.error}>{state.errMess}</Text>}
                </View>
            )}
        </ScrollView>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
    },
    errMess: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#E9446A',
    },
    error: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
    },
    inputTitle: {
        color: '#8A8F9E',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    input: {
        borderBottomColor: '#8A8F9E',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: '#161F3D',
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        marginHorizontal: 38,
        backgroundColor: '#2c3ea7',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    textButton2: {
        color: '#414959',
        fontSize: 13,
    },
    button2: {
        alignSelf: 'center',
        marginTop: 22,
    },
});

export default SignIn