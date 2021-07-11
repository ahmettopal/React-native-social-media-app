import React, { Component, useEffect, useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    Image,
    Text,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import { useSelector } from "react-redux";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const Discover = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;

    const [data, setData] = useState([]);
    //const [like, setLike] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [])

    const fetchPost = async () => {
        setRefresh(true);
        await axios.get(API_URL() + '/posts',
            {
                headers: await authHeader()
            }
        ).then((resJson) => {
            //console.log(resJson.data.posts);
            //setLike(resJson.data.posts.likes);
            setData((resJson.data.posts).reverse());
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const handleRefresh = () => {
        setRefresh(false);
        fetchPost();
    }

    const toUser = (author) => {
        if (author == currentUser.id) {
            navigation.navigate("Profile")
        }
        else {
            navigation.navigate("UserOrModFollowlist", { user: author, role: "moderator" });
        }
    }

    const toPostDetail = (_postId, userID) => {
        if (currentUser.id == userID) {
            navigation.navigate("ToPostDetail", { postId: _postId, _isCurrentMod: true })
        }
        else {
            navigation.navigate("ToPostDetail", { postId: _postId })
        }
    }

    const emptyFlatlistComponent = () => {
        return (
            <View style={styles.dPost}>
                <Text>gönderi yok</Text>
            </View>
        )
    }

    const renderItemComponent = (data) =>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { toUser(data.item.userId) }} style={styles.header}>
                {
                    data.item.user.avatar !== null ? (
                        <Image source={{ uri: API_URL() + data.item.user.avatar }} style={styles.personImage} />
                    ) : (
                        <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                    )
                }
                <Text style={{ fontSize: 10 }}>{data.item.user.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toPostDetail(data.item.id, data.item.userId)}>
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
        <SafeAreaView style={{ marginBottom: 50 }}>
            <View style={styles.headerTitle}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pano</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Arama")}>
                    <Icon name="search-outline" size={25} style={{ marginRight: 10 }} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={item => renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
                }
                numColumns={2}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={emptyFlatlistComponent}
            />

        </SafeAreaView>
    )

}

export default Discover;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        alignSelf: 'center',
        marginHorizontal: 2,
        marginVertical: 3,
        borderWidth: 0.3,
        borderColor: "grey",
        width: '49%',
        height: '98%',
        overflow: 'hidden'
        //backgroundColor: 'red',
        //height: height - 415
    },
    headerTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 13,
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    dPost: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 200
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 5,
        padding: 3
    },
    personImage: {
        width: 20,
        height: 20,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginRight: 3
    },
    imagePost: {
        width: '100%',
        height: 246,
        //resizeMode: 'contain',
        alignSelf: 'center',
        //backgroundColor: 'black'
    },
    actionContainer: {
        flexDirection: "row",
        //paddingStart: 20,
        padding: 5,
        justifyContent: 'space-evenly'
    },
    actionIcon: {
        fontSize: 15,
    },
    description: {
        marginLeft: 10,
        marginRight: 5,
        padding: 5,
        fontSize: 10
    }
});