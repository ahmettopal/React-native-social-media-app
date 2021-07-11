import React, { Component, useState, useEffect } from 'react'
import { Image, SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import DatePicker from 'react-native-date-picker'

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';
import { KeyboardAvoidingView } from 'react-native';


const PostShare = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;
    const image = props.route.params.postImage;
    const imageType = props.route.params.postImageType;

    const [input, setInput] = useState("");
    const [date, setDate] = useState(new Date());
    const [link, setLink] = useState("");

    const onBack = () => {
        navigation.goBack();
    }

    const sharePost = async () => {

        const formData = new FormData();

        formData.append('description', input);
        formData.append('date', date.toString());
        formData.append('link', link);
        formData.append('image', {
            name: "post",
            type: imageType,
            uri: Platform.OS === 'android' ? image : image.replace('file://', ''),
        });

        await axios.post(API_URL() + "/post/share",
            formData,
            {
                //headers: await authHeader()
                headers: {
                    ...await authHeader(),
                    "Content-type": "multipart/form-data",
                    Accept: "application/json"
                }
            }
        )
            .then((sendPost) => {
                console.log(sendPost.data.post);
                //setImage("");
                setInput("");
                //setImageType("");
                navigation.navigate("Home");
            }).catch(e => console.log(e));
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                    <Text style={styles.headerText}>Etkinlik Paylaşın</Text>
                </View>
                <TouchableOpacity onPress={sharePost}>
                    <Text style={styles.shareText}>Paylaş</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.inputContainer}>
                <View style={styles.inputBox}>
                    {currentUser.avatar ? (
                        <Image source={{ uri: API_URL() + currentUser.avatar }} style={styles.personImage} />
                    ) : (
                        <Image source={image.profile_image} style={styles.personImage} />
                    )}
                    <TextInput
                        multiline={true}
                        //autoFocus={true}
                        value={input}
                        style={styles.input}
                        onChangeText={text => setInput(text)}
                        placeholder="Açıklama yaz..."
                    />
                </View>

                {!image ? (
                    <View style={styles.tmpPostImage}>
                        <Text style={{ alignSelf: 'center', marginTop: 10 }}>resim yok</Text>
                    </View>
                ) : (

                    <Image source={{ uri: Platform.OS === 'android' ? image : image.replace('file://', '') }} style={styles.postimage} />

                )}
            </View>

            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>Etkinlik Tarihi Seçin</Text>
                <DatePicker
                    date={date}
                    onDateChange={setDate}
                //mode="date"
                />
            </View>

            <View style={styles.linkContainer}>
                <Text style={styles.dateText}>Etkinlik İçin Link Ekleyin</Text>
                <TextInput
                    multiline={true}
                    autoFocus={true}
                    value={link}
                    //style={styles.input}
                    onChangeText={text => setLink(text)}
                    placeholder="Etkinlik linki ekleyin"
                    style={styles.linkText}
                />
            </View>


        </SafeAreaView>
    )

}

export default PostShare;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: '#fff'
        //justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
        marginLeft: 10,
        marginRight: 10,
        //backgroundColor: 'green'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    dateContainer: {
        padding: 15,
        marginTop: 30
    },
    dateText: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    linkContainer: {
        padding: 15,
        marginTop: 5,
    },
    shareText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: 'bold',
        color: '#2c3ea7'
    },
    tmpPostImage: {
        //marginTop: 60,
        marginRight: 10,
        alignSelf: 'center',
        height: '100%',
        width: '20%',
        borderWidth: 0.2,
        borderColor: '#2c3ea7',
        borderRadius: 12,
        //backgroundColor: 'blue'
    },

    postimage: {
        height: '120%',
        width: '20%',
        resizeMode: 'contain',
        marginRight: 10,
        //backgroundColor: 'blue',
    },
    inputContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor: 'red',
    },
    inputBox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#C9CDCF',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        height: 50,
        width: '70%',
        //backgroundColor: 'grey',
    },
    personImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginLeft: 5
    },
    input: {
        width: '85%',
        alignItems: 'center',
        marginRight: 10,
        paddingHorizontal: 5,
        marginLeft: 10,
        //backgroundColor: 'yellow'
    },
    linkText: {
        borderTopColor: '#C9CDCF',
        borderBottomWidth: 0.5,
        height: 40
    }
})