import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    TextInput,
    Linking,
} from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';

import { register } from "../../../actions/auth";

const SignUp = ({ navigation }) => {

    const [state, setState] = useState({
        username: '',
        email: '',
        password: '',
        //errMess: null,
    });
    const [errMess, setErrMess] = useState(null);
    const [successful, setSuccessful] = useState(false);

    const [usernameSucces, setUsernameSucces] = useState(false);
    const [emailSucces, setEmailSucces] = useState(false);
    const [passwordSucces, setPasswordSucces] = useState(false);
    const [isSecureEntry, setIsSecureEntry] = useState(true);

    const dispatch = useDispatch();
    const { message } = useSelector(state => state.message);

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <TouchableOpacity onPress={handlePress}><Text style={{ color: '#2c3ea7', fontSize: 10 }}>{children}</Text></TouchableOpacity>;
    };

    const onChangeUsername = (e) => {
        if (e.length < 3 || e.length > 20) {
            setErrMess("Kullanıcı adı 3 ile 20 karakter arasında olmalıdır");
            const username = (e).replace(/\s+/g, "_");
            setState({ ...state, username });
            setUsernameSucces(false);
        } else {
            const username = (e).replace(/\s+/g, "_");
            setState({ ...state, username });
            setUsernameSucces(true);
            setErrMess(null);
        }

    };

    const onChangeEmail = (e) => {
        const email = e;
        setState({ ...state, email });
        setEmailSucces(false);
    }

    const onChangePassword = (e) => {
        if (e.length < 6 || e.length > 40) {
            const password = e;
            setState({ ...state, password });
            setPasswordSucces(false);
            setErrMess("Şifre 6 ile 40 karakter arasında olmalıdır");
        } else {
            const password = e;
            setState({ ...state, password });
            setErrMess(null);
            setPasswordSucces(true);
        }

    }

    const handleSignUp = () => {
        username = state.username;
        email = state.email;
        password = state.password;


        if (usernameSucces === false) {
            setErrMess("Kullanıcı adı 3 ile 20 karakter arasında olmalıdır");
        }
        else if (passwordSucces === false) {
            setErrMess("Şifre 6 ile 40 karakter arasında olmalıdır");
        }
        else if (usernameSucces === true && passwordSucces === true) {
            const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            {
                !email || check.test(email.toString()) === false
                    ? setErrMess("Email formatını doğru giriniz")
                    : dispatch(register(username, email, password))
                        .then(() => {
                            navigation.navigate("SignIn");
                            setErrMess(null);
                        })
                        .catch({
                            // setState( errMess: message )
                        });
            }

        } else {
            setErrMess("Hata! Lütfen tekrar deneyin")
        }

    };

    return (

        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <Text style={styles.greeting}>{`Merhaba.\nBaşlamak için kayıt ol`}</Text>

            <View style={styles.errMess}>
                {errMess && <Text style={styles.error}>{errMess}</Text>}
            </View>

            <View style={styles.form}>
                <View>
                    <Text style={styles.inputTitle}>Kullanıcı Adı</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={username => onChangeUsername(username)}
                        value={state.username}
                    />
                </View>
                <View>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        autoCompleteType="email"
                        onChangeText={email => onChangeEmail(email)}
                        value={state.email}
                    />
                </View>
                <View>
                    <Text style={styles.inputTitle}>Şifre</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={isSecureEntry}
                            autoCapitalize="none"
                            onChangeText={password => onChangePassword(password)}
                            value={state.password}
                        />

                        {isSecureEntry ?
                            <Icon name="eye-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntry((prev) => !prev); }} />
                            :
                            <Icon name="eye-off-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntry((prev) => !prev); }} />}


                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.textButton}>Kayıt ol</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => {
                        navigation.navigate('SignIn');
                    }}>
                    <Text style={styles.textButton2}>
                        Hesabın var mı ?{' '}
                        <Text style={{ fontWeight: '500', color: '#2c3ea7' }}> Giriş yap</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            {message && (
                <View style={styles.error}>
                    <Text style={styles.errMess}>
                        {message}
                    </Text>

                </View>
            )}

            <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
                <Text style={{ fontSize: 10 }}>Kayıt olarak, </Text>
                <OpenURLButton url={"http://panoyabak.com/privacy-policy"} >Gizlilik Politikası</OpenURLButton>
                <Text style={{ fontSize: 10 }}>  ve </Text>
                <OpenURLButton url={"http://panoyabak.com/terms-conditions"} >Kullanım Koşulları</OpenURLButton>
            </View>
            <Text style={{ alignSelf: 'center', fontSize: 10 }}> kabul etmiş sayılırsınız</Text>

        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconBox: {
        top: 20,
        left: 20,
    },
    icon: {
        color: '#1A0D00',
        fontSize: 25,
    },

    logo2: {
        position: 'absolute',
        zIndex: -1,
        opacity: 0.2,
        top: 200,
        right: -170,
        height: 500,
        width: '120%',
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
        marginHorizontal: 30,
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
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
        width: '100%',
        fontSize: 15,
        color: '#161F3D',
    },
    textButton: {
        color: 'white',
        fontWeight: '500',
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
    succesFalseButton: {
        marginHorizontal: 38,
        backgroundColor: '#9EA7DB',
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
    actionIcon: {
        fontSize: 25,
        color: '#2c3ea7',
        position: 'absolute',
        marginLeft: 320
    },
});


export default SignUp