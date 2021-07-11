import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, SafeAreaView, Image, ScrollView, ActivityIndicator,
    RefreshControl, Alert, TouchableOpacity, FlatList, Dimensions
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
//import Animated from 'react-native-reanimated';
import axios from "axios";
import { Avatar } from 'react-native-elements';
import OptionsMenu from "react-native-option-menu";

import image from '../../../res/images';
import { logout } from '../../../actions/auth';
import ProfileFeed from './ProfileFeed';

import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen(props) {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;
    const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [follow, setFollow] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCurrentMod, setIsCurrentMod] = useState(false);

    const handleSingOut = () => {
        Alert.alert(
            'Bildirim',
            'Çıkmak istediğinize emin misiniz?',
            [
                {
                    text: 'Hayır',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Evet', onPress: () => {
                        try {
                            dispatch(logout()).then(() => {
                                navigation.navigate("SignIn");
                            })

                        } catch (error) {
                            console.log(error);
                        }
                    }
                },
            ],
            { cancelafble: false },
        );

    }

    const ToEditProfile = () => {
        navigation.navigate("editProfile");
    }

    const settings = () => {
        navigation.navigate("Settings");
    }

    useEffect(() => {
        handleRefresh();
    }, [])

    const getFollow = async () => {
        await axios.get(API_URL() + `/user/${currentUser.id}/follow`,
            {
                headers: await authHeader()
            }).then(follow => {
                setFollow((follow.data.follow).reverse());
            }).catch(e => console.log(e));
    }

    const getFollowing = async () => {
        await axios.get(API_URL() + `/user/${currentUser.id}/followers`,
            {
                headers: await authHeader()
            }).then(followers => {
                setFollowers((followers.data.followers).reverse())
            }).catch(e => console.log(e));
    }

    const fetchToUserFeed = async () => {
        setRefresh(true);
        setLoading(true);
        await axios.get(API_URL() + `/user/${currentUser.id}/profileUserFeed`,
            {
                headers: await authHeader()
            }).then((resJson) => {
                setData((resJson.data).reverse());
                setRefresh(false);
                setLoading(false);
            }).catch(e => console.log(e));
    }

    const fetchModProfile = async () => {
        setRefresh(true);
        setLoading(true);
        await axios.get(API_URL() + `/user/${currentUser.id}/profileModFeed`,
            {
                headers: await authHeader()
            }).then((resJson) => {
                setData((resJson.data.post).reverse());
                setRefresh(false);
                setLoading(false);
            }).catch(e => console.log(e));
    }

    const dataFetch = () => {
        if (currentUser.roles == "ROLE_USER") {
            fetchToUserFeed();
            getFollow();
        }
        else if (currentUser.roles == "ROLE_MODERATOR") {
            fetchModProfile();
            setIsCurrentMod(true);
            getFollow();
            getFollowing();
        }
        else if (currentUser.roles == "ROLE_ADMIN") {
            fetchModProfile();
            setIsCurrentMod(true);
            getFollow();
            getFollowing();
        }

    }

    const handleRefresh = () => {
        dataFetch();
    }

    const ReadMore = ({ children }) => {
        const text = children;
        const [isReadMore, setIsReadMore] = useState(true);
        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };

        if (text.length < 100) {
            return <Text style={{ textAlign: "center" }}>{text}</Text>
        } else {
            return (
                <Text style={{ textAlign: "center" }}>
                    {isReadMore ? text.slice(0, 100) : text}
                    <Text onPress={toggleReadMore} style={{ fontWeight: 'bold' }}>
                        {isReadMore ? "...devamı" : " küçült"}
                    </Text>
                </Text>
            );
        }

    };

    const toPostDetail = (_postId) => {
        navigation.navigate("ToPostDetail", { postId: _postId, _isCurrentMod: isCurrentMod })
    }

    const toFollowList = () => {
        navigation.navigate("followList", { user: currentUser.id });
    }

    const toFollowersList = () => {
        navigation.navigate("followList", { user: currentUser.id });
    }

    const profileInfo = () => {
        return (
            <View>
                <View style={{ alignSelf: "center" }}>
                    <View style={styles.profileImage}>
                        {
                            currentUser.avatar ? (
                                <Avatar size={75} source={{ uri: API_URL() + currentUser.avatar }} />
                            ) : (

                                <Avatar size={75} source={image.profile_image} />
                            )
                        }
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={[styles.text, { fontSize: 20 }]}>{currentUser.username}</Text>
                </View>

                {currentUser.biyografi ?
                    <View style={styles.bioText}>
                        <ReadMore>
                            {currentUser.biyografi}
                        </ReadMore>
                    </View>
                    :
                    <View />
                }

                {isCurrentMod ? (
                    <View>
                        <View style={styles.followerContainer}>
                            <TouchableOpacity onPress={toFollowList} style={{ alignItems: 'center' }}>
                                <Text>{follow.length}</Text>
                                <Text style={styles.followTxt}>Takip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toFollowersList} style={{ alignItems: 'center' }}>
                                <Text>{followers.length}</Text>
                                <Text style={styles.followTxt}>Takipçi</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.eventInfo}>Paylaştığım Etkinlikler  ({data.length}) </Text>
                    </View>
                ) : (
                    <View>
                        <View style={styles.followerContainer}>
                            <TouchableOpacity onPress={toFollowList} style={{ alignItems: 'center' }}>
                                <Text>{follow.length}</Text>
                                <Text style={styles.followTxt}>Takip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }}>
                                <Text>{data.length}</Text>
                                <Text style={styles.followTxt}>Katılım</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.eventInfo}>Katıldığım Etkinlikler  ({data.length})</Text>
                    </View>
                )
                }
            </View>
        )
    }

    const emptyFlatlistComponent = () => {
        return (
            <View style={styles.tmpPostImage}>
                <Image source={image.profileTmp} style={styles.tmpImagePost} />
                <Text style={styles.noPostText}>Henüz gönderi yok</Text>
            </View>
        )
    }

    const renderItemComponent = (data) =>
        <View style={styles.feedContainer}>
            <TouchableOpacity onPress={() => toPostDetail(data.item.id)}>
                {
                    !data.item.image ? (
                        <Image source={image.profile_image} style={styles.imagePost} />
                    ) : (
                        // console.log(data.item.image)
                        <Image source={{ uri: API_URL() + data.item.image }} style={styles.imagePost} />
                    )
                }
            </TouchableOpacity>
        </View>


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.titleBar}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{currentUser.username}</Text>
                <TouchableOpacity onPress={handleSingOut}>
                    <OptionsMenu
                        customButton={<Icon name="ellipsis-vertical" style={{ fontSize: 25, marginLeft: 150 }} />}
                        destructiveIndex={1}
                        options={["Profili Düzenle", "Ayarlar", "Çıkış yap", "İptal"]}
                        actions={[ToEditProfile, settings, handleSingOut,]} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={item => renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                refreshing={refresh}
                onRefresh={handleRefresh}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={profileInfo}
                ListEmptyComponent={emptyFlatlistComponent}
            />

            {/*
                <View >
                    <ProfileFeed user={currentUser.id} navigation={navigation} />
                </View>
            */}

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
        justifyContent: "space-between",
        marginHorizontal: 13,
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
        marginTop: 10,
        overflow: "hidden",
    },

    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 5,
    },
    followerContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        //backgroundColor: 'red'
    },
    followTxt: {
        fontWeight: 'bold'
    },
    /*
        feedContainer: {
            borderRadius: 12,
            alignSelf: 'center',
            marginHorizontal: 3,
            //borderWidth: 0.5,
            borderColor: 'grey',
            width: width - 150,
            height: '100%',
            overflow: 'hidden',
            //height: height - 354
            //backgroundColor: 'red'
        },*/

    feedContainer: {
        marginHorizontal: 2,
        marginBottom: 5,
        width: width - 210,
    },
    imagePost: {
        width: '100%',
        height: 270,
        borderRadius: 15,
        alignSelf: 'center',
        //resizeMode: 'contain',
        //backgroundColor: 'black'
    },
    eventInfo: {
        padding: 10,
        fontWeight: 'bold',
        marginLeft: 6
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 3,
        marginBottom: 3,
    },
    postUsername: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    personImage: {
        width: 20,
        height: 20,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginRight: 3
    },
    tmpPostImage: {
        alignSelf: 'center',
        height: 285,
        width: '70%',
        borderWidth: 0.3,
        borderRadius: 12,
        //borderColor: 'b'
        //backgroundColor: 'blue'
    },

    noPostText: {
        marginTop: 35,
        alignSelf: 'center'
    },
    tmpImagePost: {
        marginTop: 40,
        alignSelf: 'center',
        height: '32%',
        width: '32%',
    },


    bioText: {
        fontSize: 10,
        padding: 5
        //fontSize: 10
    },
    actionContainer: {
        flexDirection: "row",
        padding: 2,
        justifyContent: 'space-evenly'
    },
    actionIcon: {
        fontSize: 20,
    },
});