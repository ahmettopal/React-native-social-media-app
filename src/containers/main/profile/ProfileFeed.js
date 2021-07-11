import React, { Component, useEffect, useState } from 'react'
import { Text, View, FlatList, SafeAreaView, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import { ScrollView } from 'react-native-gesture-handler';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import { useSelector } from "react-redux";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const { width, height } = Dimensions.get('window');


const ProfileFeed = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isCurrentMod, setIsCurrentMod] = useState(false);

    useEffect(() => {
        dataFetch();
    }, [])

    const fetchToUserFeed = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/user/${currentUser.id}/userposts`,
            {
                headers: await authHeader()
            }
        )
            .then((resJson) => {
                setData(resJson.data.userProfileFeed);
                setRefresh(false);
            }).catch(e => console.log(e));
    }

    const fetchModProfile = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/user/${currentUser.id}/posts`,
            {
                headers: await authHeader()
            }
        )
            .then((resJson) => {
                setData(resJson.data.user);
                setIsCurrentMod(true);
                setRefresh(false);
            }).catch(e => console.log(e));
    }

    const dataFetch = () => {
        if (currentUser.roles == "ROLE_USER") {
            fetchToUserFeed();
        }
        else if (currentUser.roles == "ROLE_MODERATOR") {
            fetchModProfile();
        }
        else if (currentUser.roles == "ROLE_ADMIN") {
            fetchModProfile();
        }

    }

    const handleRefresh = () => {
        setRefresh(false);
        dataFetch(); // call fetchCats after setting the state
    }

    const toPostDetail = (postData) => {
        navigation.navigate("ToPostDetail", { postDetailData: postData, _isCurrentMod: isCurrentMod })
    }

    const renderItemComponent = (data) =>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => toPostDetail(data.item)}>
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
        <SafeAreaView>
            {
                isCurrentMod ? (
                    <Text style={styles.eventInfo}>Paylaştığım Etkinlikler</Text>
                ) : (
                    <Text style={styles.eventInfo}>Katıldığım Etkinlikler</Text>
                )
            }
            <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}  >
                {
                    data.length === 0 ? (
                        <View style={styles.tmpPostImage}>
                            <Image source={image.profileTmp} style={styles.tmpImagePost} />
                            <Text style={styles.noPostText}>Henüz gönderi yok</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={data}
                            renderItem={item => renderItemComponent(item)}
                            keyExtractor={(item, index) => index.toString()}
                            refreshing={refresh}
                            onRefresh={handleRefresh}
                            numColumns={2}
                            showsVerticaltalScrollIndicator={false}
                        //horizontal={true}
                        />
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )

}

export default ProfileFeed;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 5,
    },
    eventInfo: {
        padding: 15,
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
        height: height - 430,
        width: width - 110,
        borderWidth: 0.3,
        borderRadius: 12,
        //borderColor: 'b'
        //backgroundColor: 'blue'
    },

    noPostText: {
        marginTop: 50,
        alignSelf: 'center'
    },
    tmpImagePost: {
        marginTop: 40,
        alignSelf: 'center',
        height: '32%',
        width: '34%',
    },
    imagePost: {
        width: '98%',
        height: 270,
        borderRadius: 15,
        alignSelf: 'center',
        //backgroundColor: 'black'
    },
    description: {
        marginLeft: 5,
        marginRight: 5,
        padding: 5,
        fontSize: 9,
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
