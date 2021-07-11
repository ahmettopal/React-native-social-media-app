import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import DatePicker from 'react-native-date-picker'

import authHeader from '../services/auth-header';
import API_URL from './API_URL';


export default function ProfileEdit(props) {
    const _postId = props.route.params.postId;
    const navigation = props.navigation;

    const [input, setInput] = useState("");
    const [date, setDate] = useState(new Date());
    const [link, setLink] = useState("");

    const onBack = () => {
        navigation.goBack();
    }

    const updatePostDescription = async () => {

        await axios.put(API_URL() + `/post/updateDescription/${_postId}`,
            {
                "text": input
            },
            {
                headers: await authHeader()
            }
        ).then(resJson => {
            //console.log(resJson.data);
            navigation.navigate("Profile");
        }).catch(e => console.log(e));
    }

    const updatePostDate = async () => {
        await axios.put(API_URL() + `/post/updateDate/${_postId}`,
            {
                "date": date.toString()
            },
            {
                headers: await authHeader()
            }
        ).then(resJson => {
            //console.log(resJson.data);
            navigation.navigate("Profile");
        }).catch(e => console.log(e));
    }

    const updatePostLink = async () => {
        await axios.put(API_URL() + `/post/updateLink/${_postId}`,
            {
                "link": link
            },
            {
                headers: await authHeader()
            }).then(resJson => {
                //console.log(resJson.data);
                navigation.navigate("Profile");
            }).catch(e => console.log(e));
    }

    const deletePost = async () => {
        await axios.delete(API_URL() + `/post/delete/${_postId}`,
            {
                headers: await authHeader()
            }
        ).then(resJson => {
            //console.log(resJson.data);
            navigation.navigate("Profile");
        })
    }

    return (
        <View>
            <View style={styles.header}>
                <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                <Text style={styles.headerText}> Gönderiyi Düzenle </Text>
            </View>


            <View style={styles.form}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '85%' }}>
                        <KeyboardAvoidingView behavior="position">
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                placeholder="Açıklamayı Düzenle"
                                onChangeText={postState => {
                                    setInput(postState);
                                }}
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={{ width: '10%', marginLeft: 25 }}>
                        <TouchableOpacity onPress={() => updatePostDescription()}>
                            <Icon name="checkmark-done-circle-outline" size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.form}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '85%' }}>
                        <KeyboardAvoidingView behavior="position">
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                placeholder="Link Düzenle"
                                onChangeText={postState => {
                                    setLink(postState);
                                }}
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={{ width: '10%', marginLeft: 25 }}>
                        <TouchableOpacity onPress={() => updatePostDescription()}>
                            <Icon name="checkmark-done-circle-outline" size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.dateContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Text style={styles.dateText}>Etkinlik Tarihi Seçin</Text>
                        <DatePicker
                            date={date}
                            onDateChange={setDate}
                        />
                    </View>
                    <View style={{ width: '10%', alignSelf: 'center', marginLeft: 25 }}>
                        <TouchableOpacity onPress={() => updatePostDate()}>
                            <Icon name="checkmark-done-circle-outline" size={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={deletePost}>
                <Text style={styles.shareText}>Bu Etkinliği Sil</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    header: {
        flexDirection: "row",
        //justifyContent: "space-between",
        marginHorizontal: 13,
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    form: {
        marginTop: 30,
        marginBottom: 30,
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
        opacity: 0.4
    },
    dateContainer: {
        padding: 15,
        marginTop: 10,
    },
    dateText: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    shareText: {
        fontSize: 16,
        marginLeft: 30,
        marginTop: 50,
        color: 'red',
        fontWeight: 'bold'
    },
});