import React, { useState, useEffect } from 'react'
import {
    StyleSheet, Text, View, FlatList, SafeAreaView, Image, ScrollView,
    RefreshControl, TouchableOpacity, Dimensions, ActivityIndicator
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "axios";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const { width, height } = Dimensions.get('window');

const UserOrModProfileFollowList = (props) => {
    const navigation = props.navigation;

    const user = props.route.params.user;
    const role = props.route.params.role;

    const [data, setData] = useState([]);
    const [feedData, setFeedData] = useState([]);
    const [follow, setFollow] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [auth, setAuth] = useState("");

    useEffect(() => {
        fetchToUser();
        dataFetch();
        getFollow();
    }, [])


    const onBack = () => {
        navigation.goBack();
    };

    const fetchToUser = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/user/${user}`,
            {
                headers: await authHeader()
            }
        ).then((resJson) => {
            setData(resJson.data.user);
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const fetchToUserFeed = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/user/${user}/userposts`,
            {
                headers: await authHeader()
            }
        ).then((resJson) => {
            //console.log(resJson.data.userProfileFeed);
            setFeedData((resJson.data.userProfileFeed).reverse());
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const dataFetch = () => {
        if (role == "user") {
            setAuth("user");
            fetchToUserFeed();
        }
        else if (role == "moderator") {
            setAuth("moderator");
            fetchToModFeed();
            checkUserFollow();
            getFollowers();
        }
        else if (role == "admin") {
            setAuth("moderator");
            fetchToModFeed();
            checkUserFollow();
            getFollowers();
        }

    }

    const fetchToModFeed = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/user/${user}/posts`,
            {
                headers: await authHeader()
            }
        ).then((resJson) => {
            setFeedData((resJson.data.user).reverse());
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const getFollow = async () => {
        await axios.get(API_URL() + `/user/${user}/follow`,
            {
                headers: await authHeader()
            }
        ).then(follow => {
            setFollow((follow.data.follow).reverse());
        }).catch(e => console.log(e));
    }

    const getFollowers = async () => {
        await axios.get(API_URL() + `/user/${user}/followers`,
            {
                headers: await authHeader()
            }
        ).then(followers => {
            setFollowers((followers.data.followers).reverse())
        }).catch(e => console.log(e));
    }

    const checkUserFollow = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/user/${user}/checkFollow`,
            {
                headers: await authHeader()
            }
        ).then((res) => {
            setFollowing(true);
        }).catch(e => console.log(e));
    }

    const followUSer = async () => {
        //setRefresh(true);
        setLoading(true);
        await axios.post(API_URL() + `/user/${user}/follow`, {},
            {
                headers: await authHeader()
            }
        ).then((res) => {
            setFollowing(true);
            //setRefresh(false);
            setLoading(false);
        }).catch(e => console.log(e));
    }

    const unFollowUser = async () => {
        //setRefresh(true);
        setLoading(true);
        await axios.post(API_URL() + `/user/${user}/unfollow`, {},
            {
                headers: await authHeader()
            }
        ).then((res) => {
            setFollowing(false);
            //setRefresh(false);
            setLoading(false);
        }).catch(e => console.log(e));
    }

    const handleRefresh = () => {
        setRefresh(false);
        dataFetch(); // call fetchCats after setting the state
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

    const toFollowList = (_user) => {
        let _role = data.roles.map(user => user.name);

        navigation.navigate("followList", { user: _user, role: _role });
    }

    const toFollowersList = (_user) => {
        let _role = data.roles.map(user => user.name);

        navigation.navigate("followList", { user: _user, role: _role });
    }

    const toPostDetail = (_postId) => {
        navigation.navigate("ToPostDetail", { postId: _postId })
    }

    const profileInfo = () => {
        return (
            <View>
                <View style={{ alignSelf: "center" }}>
                    <View style={styles.profileImage}>
                        {
                            data.avatar !== null ? (
                                <Image source={{ uri: API_URL() + data.avatar }} style={styles.image} />
                            ) : (

                                <Image source={image.profile_image} resizeMode="cover" style={styles.image} />
                            )
                        }
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={[styles.text, { fontSize: 20 }]}>{data.username}</Text>
                </View>

                {data.biyografi ?
                    <View style={styles.bioText}>
                        <ReadMore>
                            {data.biyografi}
                        </ReadMore>
                    </View>
                    :
                    <View />
                }

                {auth === "user" ? (
                    <View>
                        <View style={styles.followerContainer}>
                            <TouchableOpacity onPress={() => toFollowList(user)} style={{ alignItems: 'center' }}>
                                <Text>{follow.length}</Text>
                                <Text style={styles.followTxt}>Takip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignItems: 'center' }}>
                                <Text>{feedData.length}</Text>
                                <Text style={styles.followTxt}>Katılım</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.eventInfo}>Katıldığım Etkinlikler  ({feedData.length})</Text>
                    </View>
                ) : (
                    <View>
                        <View style={styles.followerContainer}>
                            <TouchableOpacity onPress={() => toFollowList(user)} style={{ alignItems: 'center' }}>
                                <Text>{follow.length}</Text>
                                <Text style={styles.followTxt}>Takip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => toFollowersList(user)} style={{ alignItems: 'center' }}>
                                <Text>{followers.length}</Text>
                                <Text style={styles.followTxt}>Takipçi</Text>
                            </TouchableOpacity>
                        </View>


                        <View >
                            {
                                following === true ? (
                                    <TouchableOpacity onPress={unFollowUser} style={styles.unFollowBtnContainer} disabled={loading}>
                                        {loading && <ActivityIndicator color="#000" />}
                                        <Text style={styles.unFollowText}>Takibi bırak</Text>
                                    </TouchableOpacity>
                                ) : (

                                    <TouchableOpacity onPress={followUSer} style={styles.followBtnContainer} disabled={loading}>
                                        {loading && <ActivityIndicator color="#FFF" />}
                                        <Text style={styles.followText}>Takip et</Text>
                                    </TouchableOpacity>
                                )
                            }

                        </View>

                        <Text style={styles.eventInfo}>Paylaştığım Etkinlikler  ({feedData.length})</Text>

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
                <Icon name="md-arrow-back" size={25} color="#52575D" onPress={onBack}></Icon>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{data.username}</Text>
            </View>

            <FlatList
                data={feedData}
                renderItem={item => renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                refreshing={refresh}
                onRefresh={handleRefresh}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={profileInfo}
                ListEmptyComponent={emptyFlatlistComponent}
            //horizontal={true}
            />

        </SafeAreaView>
    )


}

export default UserOrModProfileFollowList;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "black"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    titleBar: {
        flexDirection: "row",
        //justifyContent: "space-between",
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
        //borderWidth: 1,
        //borderColor: "#20232a",
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

    followBtnContainer: {
        width: '45%',
        height: 30,
        backgroundColor: '#2c3ea7',
        //borderWidth: 0.5,
        borderRadius: 5,
        marginTop: 13,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    unFollowBtnContainer: {
        width: '45%',
        height: 30,
        borderColor: '#2c3ea7',
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderRadius: 5,
        marginTop: 13,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    followText: {
        fontSize: 16,
        color: 'white'
    },
    unFollowText: {
        color: '#2c3ea7',
        fontSize: 15
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 5,
    },
    /*
        feedContainer: {
            borderRadius: 12,
            alignSelf: 'center',
            marginHorizontal: 3,
            // borderWidth: 0.5,
            borderColor: 'grey',
            width: width - 150,
            height: '100%',
            overflow: 'hidden'
            //backgroundColor: 'red'
        },
        imagePost: {
            width: '100%',
            height: 325,
            resizeMode: 'contain',
            alignSelf: 'center',
            borderRadius: 12,
            // backgroundColor: 'black'
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
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 3,
        marginBottom: 3,
    },
    personImage: {
        width: 20,
        height: 20,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginRight: 3
    },
    description: {
        marginLeft: 5,
        marginRight: 5,
        padding: 5,
        fontSize: 9,
        //backgroundColor: 'blue'
    },
    actionContainer: {
        flexDirection: "row",
        padding: 2,
        justifyContent: 'space-evenly'
    },
    actionIcon: {
        fontSize: 20,
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
    eventInfo: {
        padding: 10,
        fontWeight: 'bold',
        marginLeft: 6
    },
});