import axios from 'axios';
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
import API_URL from '../../../components/API_URL';

const SignIn = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({ email: '', });
    const [errMessage, setErrMessage] = useState("");

    const dispatch = useDispatch();
    const { message } = useSelector(state => state.message);

    const handleLogin = () => {
        const { email } = state;

        setLoading(true);


        const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        {
            !email || check.test(email.toString()) === false
                ? setState({ errMess: 'Email formatını doğru giriniz' })
                : navigation.navigate('HomeScreen');
            try {

            } catch (err) {
                setState({ errMess: err.message });
            }
            //
        }
    };

    const ResetPassword = async () => {
        email = state.email;

        const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        {
            !email || check.test(email.toString()) === false
                ? setState({ errMess: 'Email formatını doğru giriniz' })
                : await axios.post(API_URL() + "/reset_password",
                    {
                        "email": email
                    }
                ).then(res => {
                    //console.log(res.data.message);
                    setErrMessage(res.data.message);
                }).catch(e => console.log(e));
            try {

            } catch (err) {
                setState({ errMess: err.message });
            }
            //
        }



    }

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <Text style={styles.greeting}>{``}</Text>
            <View style={styles.errMess}>
                {state.errMess && <Text style={styles.error}>{state.errMess}</Text>}
            </View>

            <View style={{ width: '85%', alignSelf: 'center', marginBottom: 25 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Şifrenizi mi unutunuz?</Text>
                <Text>Lütfen email adresinizi giriniz. Şifrenizi sıfırlamak için size mail göndereceğiz</Text>
            </View>

            <View style={styles.form}>
                <KeyboardAvoidingView behavior="position">
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={email => {
                            setState({ ...state, email });
                        }}
                        value={state.email}
                    />
                </KeyboardAvoidingView>

                <TouchableOpacity style={styles.button} onPress={ResetPassword}>
                    <Text style={styles.textButton}>Gönder</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.error}>
                <Text style={styles.errMess}>
                    {errMessage}
                </Text>
            </View>

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