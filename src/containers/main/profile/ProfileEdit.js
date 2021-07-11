import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, SafeAreaView, Image, ScrollView,
    TextInput, RefreshControl, Alert, TouchableOpacity, KeyboardAvoidingView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { Avatar } from 'react-native-elements';

import Images from '../../../res/images';
import { logout, updateAvatar, updateUsername, updateBiyografi } from '../../../actions/auth';
//import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';


const bs = React.createRef();
const fall = new Animated.Value(1);

export default function ProfileScreen(props) {
    const { user: currentUser } = useSelector((state) => state.auth);

    const navigation = props.navigation;
    const dispatch = useDispatch();

    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [imageType, setImageType] = useState(null);
    const [biyografi, setBiyografi] = useState("");
    const [loading, setLoading] = useState(false);
    const [errMess, setErrMess] = useState(null);
    const [usernameSucces, setUsernameSucces] = useState(false);

    const onBack = () => {
        navigation.goBack();
    }

    const onChangeUsername = (e) => {
        if (e.length < 3 || e.length > 20) {
            setErrMess("Kullanıcı adı 3 ile 20 karakter arasında olmalıdır");
            const username = (e).replace(/\s+/g, "_");
            //setState({ ...state, username });
            setName(username);
            setUsernameSucces(false);
        } else {
            const username = (e).replace(/\s+/g, "_");
            setName(username);
            setErrMess(null);
            setUsernameSucces(true);
        }
    };

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropperCircleOverlay: true,
            avoidEmptySpaceAroundImage: true,
            cropping: true,
            compressImageQuality: 0.7
        }).then((image) => {
            setAvatar(image.path);
            setImageType(image.mime);
            handleUploadAvatar(image.path, image.mime);
            bs.current.snapTo(1);
        }).catch(error => {
            //console.log(error);
        });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            avoidEmptySpaceAroundImage: true,
            cropperCircleOverlay: true,
            cropping: true,
            compressImageQuality: 0.7
        }).then((image) => {
            setAvatar(image.path);
            setImageType(image.mime);
            handleUploadAvatar(image.path, image.mime);
            bs.current.snapTo(1);
        }).catch(error => {
            //console.log(error);
        });
    }

    const renderInner = () => {
        try {
            return (
                <View style={styles.panel}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.panelTitle}>Fotoğraf Yükle</Text>
                        <Text style={styles.panelSubtitle}>Profil Resmini Değiştir</Text>
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
            )
        } catch (error) {
            //console.log(error);
        }

    };

    const renderHeader = () => (
        <View style={styles.bottomSheetheader}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );


    const handleUploadAvatar = (_avatar, _imageType) => {
        let __avatar = _avatar;
        let __imageType = _imageType;

        dispatch(updateAvatar(__avatar, __imageType))
            .then(() => {
                navigation.navigate("Profile")
            }
            ).catch(error => {
                //console.log(error);
            });
    }

    const handleChangeName = (username) => {
        if (usernameSucces === true) {
            setLoading(true);
            dispatch(updateUsername(username))
                .then(() => {
                    navigation.navigate("Profile");
                    setLoading(false);
                }).catch(error => {
                    //console.log(error);
                });
        } else { setErrMess("Kullanıcı adı 3 ile 20 karakter arasında olmalıdır"); }

    }

    const updateBiyo = async (biyografi) => {
        dispatch(updateBiyografi(biyografi))
            .then(() => {
                navigation.navigate("Profile");
            }).catch(error => {
                //console.log(error);
            });
    }


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

            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.titleBar}>
                    <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profili Düzenle</Text>
                </View>

                <View style={styles.errMess}>
                    {errMess && <Text style={styles.error}>{errMess}</Text>}
                </View>

                <View style={{ alignSelf: "center" }}>
                    <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                        <View style={styles.profileImage}>
                            {
                                currentUser.avatar ? (
                                    <Avatar size={75} source={{ uri: API_URL() + currentUser.avatar }} />
                                ) : (

                                    <Avatar size={75} source={Images.profile_image} />
                                )
                            }
                        </View>
                    </TouchableOpacity>

                    <View style={styles.add}>
                        <Icon name="add-circle" size={25} color="#f1880d" style={{ overflow: "hidden", }}></Icon>
                    </View>
                </View>

                <View style={styles.form}>
                    <View style={{ width: '85%' }}>
                        <KeyboardAvoidingView behavior="position">
                            <Text style={styles.inputTitle}>Kullanıcı Adı değiştir</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                placeholder={currentUser.username}
                                onChangeText={text => onChangeUsername(text)}
                                value={name}
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={{ width: '10%' }}>
                        {loading === false &&
                            <TouchableOpacity onPress={() => handleChangeName(name)}>
                                <Icon name="checkmark-done-circle-outline" size={30} />
                            </TouchableOpacity>
                        }
                        {loading === true &&
                            <TouchableOpacity disabled>
                                <Icon name="checkmark-done-circle-outline" size={30} color="grey" />
                            </TouchableOpacity>
                        }
                    </View>
                </View>

                <View style={styles.form2}>
                    <View style={{ width: '85%' }}>
                        <KeyboardAvoidingView behavior="position">
                            <Text style={styles.inputTitle}>Biyografi Güncelle</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                placeholder="Biyografi yazın"
                                onChangeText={text => {
                                    setBiyografi(text);
                                }}
                                value={biyografi}
                            />
                        </KeyboardAvoidingView>
                    </View>
                    <View style={{ width: '10%' }}>
                        {loading === false &&
                            <TouchableOpacity onPress={() => updateBiyo(biyografi)}>
                                <Icon name="checkmark-done-circle-outline" size={30} />
                            </TouchableOpacity>
                        }
                        {loading === true &&
                            <TouchableOpacity disabled>
                                <Icon name="checkmark-done-circle-outline" size={30} color="grey" />
                            </TouchableOpacity>
                        }
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
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 100,
        //marginTop: 5,
        overflow: "hidden",
        opacity: 0.5
    },
    add: {
        // backgroundColor: "#41444B",
        position: "absolute",
        bottom: 7,
        right: 7,
        width: 22,
        height: 22,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 13,
    },
    form: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        marginBottom: 35,
        marginHorizontal: 30,
    },
    form2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        backgroundColor: '#f1880d',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    errMess: {
        height: 50,
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
});