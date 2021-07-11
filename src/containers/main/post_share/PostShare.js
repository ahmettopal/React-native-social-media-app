import React, { Component, useState, useEffect } from 'react'
import { Image, SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
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

    const [image, setImage] = useState("");
    const [imageType, setImageType] = useState("");


    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 1080,
            compressImageMaxHeight: 1350,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            bs.current.snapTo(1);
            setImage(image.path);
            setImageType(image.mime);
        }).catch(error => {
            //console.log(error);
        });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1080,
            height: 1350,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            bs.current.snapTo(1);
            setImage(image.path);
            setImageType(image.mime);
        }).catch(error => {
            //console.log(error);
        });
    }

    const renderInner = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Fotoğraf Ekle</Text>
                <Text style={styles.panelSubtitle}>Etkinliğiniz için resim seçin</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Kamerayı Aç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Galeriden Seç</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>İptal</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.bottomSheetheader}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );

    const toPostDetails = () => {
        //console.log({ image, imageType })
        navigation.navigate("shareDetails", { postImage: image, postImageType: imageType })
        setImage("");
    }

    const bs = React.createRef();
    const fall = new Animated.Value(1);

    return (
        <SafeAreaView style={styles.container}>

            <BottomSheet
                ref={bs}
                snapPoints={[330, 0]}
                renderContent={renderInner}
                renderHeader={renderHeader}
                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
            />

            <View style={styles.header}>
                <Text style={styles.headerText}>Etkinlik Paylaşın</Text>

                {image ?
                    <TouchableOpacity onPress={toPostDetails}>
                        <Text style={styles.shareText}>İleri</Text>
                    </TouchableOpacity>
                    :
                    <Text style={styles.shareTextDisable}>İleri</Text>
                }

            </View>


            <View style={styles.postImageContainer}>
                {!image ? (
                    <View style={styles.tmpPostImage}>
                        <Image style={styles.tmpIcon} source={image.addPhoto} />
                        <TouchableOpacity style={styles.addImageButton} onPress={() => bs.current.snapTo(0)}>
                            <Text style={{ color: 'white' }}>Resim eklemek için tıkla</Text>
                        </TouchableOpacity>
                    </View>
                ) : (

                    <Image source={{ uri: Platform.OS === 'android' ? image : image.replace('file://', '') }} style={styles.postimage} />

                )}
            </View>

        </SafeAreaView>
    )

}

export default PostShare;


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    shareText: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: 'bold',
        color: '#2c3ea7'
    },
    shareTextDisable: {
        fontSize: 20,
        marginRight: 20,
        fontWeight: 'bold',
        color: '#9EA7DB'
    },
    addImageButton: {
        marginTop: 70,
        alignSelf: 'center',
        height: '24%',
        width: '75%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2c3ea7'
    },
    tmpPostImage: {
        marginTop: 60,
        alignSelf: 'center',
        height: '64%',
        width: '76%',
        borderWidth: 0.2,
        borderColor: '#2c3ea7',
        borderRadius: 12
        //backgroundColor: 'blue'
    },
    tmpIcon: {
        marginTop: 40,
        alignSelf: 'center',
        height: 100,
        width: 100,
        //backgroundColor: 'red'
    },
    postImageContainer: {
        marginTop: 20,
        alignItems: 'center',
        //height: 300,
        //swidth: 300,
        //backgroundColor: 'black'
    },
    postimage: {
        height: '85%',
        width: '100%',
        resizeMode: 'contain',
    },

    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    bottomSheetheader: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
})