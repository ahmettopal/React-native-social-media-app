import React, { useState, useEffect, useCallback } from 'react'
import {
    Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Linking, Image, ScrollView, RefreshControl
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from "react-redux";

import image from '../res/images';
import authHeader from '../services/auth-header';
import API_URL from './API_URL';
import { ActivityIndicator } from 'react-native';


const utcDateToString = momentInUTC => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
};

export default function ProfileEdit(props) {
    const { user: currentUser } = useSelector((state) => state.auth);
    const postId = props.route.params.postId;
    const isCurrentMod = props.route.params._isCurrentMod;
    const navigation = props.navigation;

    const [postData, setPostData] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const onBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        getPostDetail();
    }, [])

    const getPostDetail = async () => {
        setLoading(true);
        await axios.get(API_URL() + `/post/${postId}`,
            {
                headers: await authHeader()
            }).then(res => {
                setPostData(res.data.post);
                setUser(res.data.post.user);
                setLoading(false);
            }).catch(e => (e));
    }

    const handleRefresh = () => {
        setRefresh(false);
        getPostDetail(); // call fetchCats after setting the state
    }

    const addEventToCalendar = (title, startDateUTC) => {
        const eventConfig = {
            title: '',
            startDate: utcDateToString(startDateUTC),
            endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
            notes: ''
        };

        AddCalendarEvent.presentEventCreatingDialog(eventConfig)
            .then(eventInfo => {
                //console.log(JSON.stringify(eventInfo.action));
                //alert(/*JSON.stringify(eventInfo)*/"İptal edildi");
            })
            .catch(error => {
                alert('İzin verilmedi', error);
            });
    }

    const ReadMore = ({ children }) => {
        const text = children;
        const [isReadMore, setIsReadMore] = useState(true);
        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };

        if (text.length < 100) {
            return <Text>{text}</Text>
        } else {
            return (
                <Text>
                    {isReadMore ? text.slice(0, 104) : text}
                    <Text onPress={toggleReadMore} style={{ fontWeight: 'bold' }}>
                        {isReadMore ? "...devamı" : " küçült"}
                    </Text>
                </Text>
            );
        }

    };

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <TouchableOpacity onPress={handlePress} style={styles.linkButton}><Text style={{ fontSize: 15, textDecorationLine: 'underline', }}>Etkinliğe Git</Text></TouchableOpacity>;
    };

    const toParticipant = (postPartipants, isCurrent) => {
        //console.log({ postPartipants, isCurrent });
        navigation.navigate("toParticipantMod", { participants: postPartipants, isCurrentMod: isCurrent })
    }

    const toComment = (postID) => {
        //console.log({ postID, _isCurrentMod });
        navigation.navigate("comment", { postID: postID, __isCurrentMod: isCurrentMod })
    }

    const toUser = (author) => {
        if (author == currentUser.id) {
            navigation.navigate("Profile")
        }
        else {
            navigation.navigate("UserOrModFollowlist", { user: author, role: "moderator" });
        }
    }

    const editPost = (postId) => {
        navigation.navigate("EditPost", { postId: postId });
    }

    return (
        <SafeAreaView>

            <View style={styles.header}>
                <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                <Text style={styles.headerText}> Etkinlik Detayları </Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
            >
                {loading && <ActivityIndicator color="black" style={{ marginTop: 200 }} size="large" />}
                {!loading && (
                    <View style={styles.container}>
                        <View style={styles.postHeader}>
                            <TouchableOpacity style={styles.postUsername} onPress={() => { toUser(postData.userId) }}>
                                {
                                    user.avatar ? (
                                        <Image source={{ uri: API_URL() + user.avatar }} style={styles.personImage} />
                                    ) : (
                                        <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                                    )
                                }
                                <Text style={styles.username}>{user.username}</Text>
                            </TouchableOpacity>

                            {
                                !isCurrentMod ? (
                                    <View />
                                ) : (
                                    <TouchableOpacity onPress={() => editPost(postData.id)}>
                                        <Icon name="ellipsis-vertical" size={20} style={{ marginRight: 3 }} />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        <View>
                            {
                                postData.image ? (
                                    <Image source={{ uri: API_URL() + postData.image }} style={styles.imagePost} />
                                ) : (
                                    <Image source={image.profile_image} style={styles.imagePost} />
                                )
                            }
                        </View>

                        <View style={styles.dateContainer}>
                            <Text style={{ fontWeight: 'bold' }}>Etkinlik Tarihi:</Text>
                            <Text style={styles.dateText}>{moment.locale('tr'), moment.utc(postData.date).format('LLLL')}</Text>
                        </View>

                        <View style={styles.linkEventBtn}>
                            {postData.link ?
                                <OpenURLButton url={postData.link} />
                                :
                                <View />
                            }
                        </View>

                        {postData.description ?
                            <View style={styles.description}>
                                <ReadMore>
                                    {postData.description}
                                </ReadMore>
                            </View>
                            :
                            <View />
                        }

                        <View style={styles.actionContainer}>
                            <TouchableOpacity onPress={() => { toParticipant(postData.id, currentUser.id) }}>
                                <Icon name="people-circle-outline" style={styles.actionIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { toComment(postData.id) }}>
                                <Icon name="chatbubbles-outline" style={styles.actionIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addEventToCalendar}>
                                <Icon name="calendar-outline" style={styles.actionIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}


            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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

    container: {
        marginBottom: 50,
        //alignSelf: 'center',
        //borderColor: "grey",
        width: '100%',
        // height: height - 100,
        //backgroundColor: 'red'
    },

    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        //backgroundColor: 'red'
    },
    postUsername: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    personImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginRight: 3
    },
    username: {
        fontSize: 15,
        marginLeft: 5
    },
    imagePost: {
        height: 513,
        width: '100%',
        resizeMode: 'contain',
        alignSelf: 'center',
        //backgroundColor: 'black'
    },
    actionContainer: {
        flexDirection: "row",
        //paddingStart: 20,
        padding: 8,
        justifyContent: 'space-evenly',
    },
    actionIcon: {
        fontSize: 25,
        color: '#2c3ea7'
        //marginLeft: 25,
        //marginRight: 25
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 10,
        //backgroundColor: 'red'
    },
    dateText: {
        marginLeft: 10,
    },
    description: {
        marginLeft: 5,
        marginRight: 5,
        padding: 8,
        //backgroundColor: 'red'
    },
    linkEventBtn: {
        marginLeft: 15,
        //backgroundColor: 'red',
        marginTop: 5,
        width: '90%',
    },
    linkButton: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 4,
        borderRadius: 5,
        //marginLeft: 5
        //height: 25,
        //backgroundColor: 'blue'
    }
});