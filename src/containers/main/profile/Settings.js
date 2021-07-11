import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, SafeAreaView, Image, ScrollView,
    TextInput, Alert, TouchableOpacity, KeyboardAvoidingView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from "react-redux";

import { logout } from '../../../actions/auth';

export default function ProfileScreen(props) {
    const navigation = props.navigation;
    const dispatch = useDispatch();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [password, setPassword] = useState("");
    const [errMess, setErrMess] = useState(null);
    const [passwordSucces, setPasswordSucces] = useState(false);
    const [isSecureEntryOld, setIsSecureEntryOld] = useState(true);
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const [isSecureEntryNew, setIsSecureEntryNew] = useState(true);

    const onBack = () => {
        navigation.goBack();
    }

    _afterChangePasswordLogOut = () => {
        dispatch(logout()).then(() => {
            navigation.navigate("SignIn");
        })
    }

    const onChangeNewPassword = (e) => {
        if (e.length < 6 || e.length > 40) {
            const password = e;
            setPasswordSucces(false);
            setErrMess("Yeni Şifre 6 ile 40 karakter arasında olmalıdır");
        } else {
            const password = e;
            setNewPassword(password);
            setErrMess(null);
            setPasswordSucces(true);
        }
    }

    const onChangePassword = (e) => {
        if (e.length < 6 || e.length > 40) {
            const password = e;
            setPasswordSucces(false);
            setErrMess("Şifre tekrarı 6 ile 40 karakter arasında olmalıdır");
        } else {
            const password = e;
            setPassword(password);
            setErrMess(null);
            setPasswordSucces(true);
        }

    }

    const handleChangePassword = async (oldPassword, password, newPassword) => {
        console.log(oldPassword, password, newPassword);

        if (newPassword !== password) {
            setErrMess("Yeni şifre ile Şifre tekrarı aynı olmalıdır");
        }
        else if (newPassword === password) {
            console.log(password, newPassword);
        }

        /*
        await axios.put(API_URL() + "/change_password",
            {
                "password": password
            },
            {
                headers: await authHeader()
            }
        ).then(resJson => {
            //console.log(resJson.data.message);
            _afterChangePasswordLogOut();
        }).catch(e => console.log(e));*/
    }


    return (
        <SafeAreaView style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.titleBar}>
                    <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ayarlar</Text>
                </View>


                <View style={styles.form}>
                    <Text style={{ fontWeight: "bold" }}>Şifre Değiştir</Text>
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <View >
                            <Text style={styles.inputTitle}>Eski Şifreniz</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    secureTextEntry={isSecureEntryOld}
                                    placeholder="Eski şifrenizi yazınız"
                                    onChangeText={password => {
                                        setOldPassword(password);
                                    }}
                                    value={oldPassword}
                                />

                                {isSecureEntryOld ?
                                    <Icon name="eye-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntryOld((prev) => !prev); }} />
                                    :
                                    <Icon name="eye-off-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntryOld((prev) => !prev); }} />}
                            </View>
                        </View>

                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View >
                            <Text style={styles.inputTitle}>Yeni Şifre</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    secureTextEntry={isSecureEntry}
                                    placeholder="Yeni şifrenizi yazınız"
                                    onChangeText={password => onChangeNewPassword(password)}
                                    value={newPassword}
                                />

                                {isSecureEntry ?
                                    <Icon name="eye-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntry((prev) => !prev); }} />
                                    :
                                    <Icon name="eye-off-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntry((prev) => !prev); }} />}
                            </View>
                        </View>

                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View >
                            <Text style={styles.inputTitle}>Yeni Şifre Tekrar</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    secureTextEntry={isSecureEntryNew}
                                    placeholder="Yeni şifrenizi tekrar yazınız"
                                    onChangeText={password => onChangePassword(password)}
                                    value={password}
                                />

                                {isSecureEntryNew ?
                                    <Icon name="eye-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntryNew((prev) => !prev); }} />
                                    :
                                    <Icon name="eye-off-outline" style={styles.actionIcon} onPress={() => { setIsSecureEntryNew((prev) => !prev); }} />}
                            </View>
                        </View>

                    </View>

                    <TouchableOpacity onPress={() => handleChangePassword(oldPassword, newPassword, password)} >
                        <View style={styles.changeButton}>
                            <Text style={{ marginRight: 10, color: 'white' }}>Şifreyi değiştir</Text>
                            <Icon name="checkmark-done-circle-outline" size={30} color="white" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.errMess}>
                        {errMess && <Text style={styles.error}>{errMess}</Text>}
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "#FFF"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    titleBar: {
        flexDirection: "row",
        marginHorizontal: 15,
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    form: {
        marginTop: 30,
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
        opacity: 0.5
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
    changeButton: {
        marginTop: 25,
        padding: 3,
        borderRadius: 10,
        backgroundColor: '#2c3ea7',
        width: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    actionIcon: {
        fontSize: 25,
        color: '#2c3ea7',
        position: 'absolute',
        marginLeft: 320
    },

});