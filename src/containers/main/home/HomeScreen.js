import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    RefreshControl,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Linking,
    Button
} from 'react-native'
import { useSelector } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import axios from "axios";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const { width, height } = Dimensions.get('window');

const utcDateToString = momentInUTC => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
};

const HomeScreen = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getHomeScreenPost();
    }, [])


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
                //alert(JSON.stringify(eventInfo)"İptal edildi");
            })
            .catch(error => {
                alert('İzin verilmedi', error);
            });
    }

    const getHomeScreenPost = async () => {
        setRefresh(true);
        await axios.get(API_URL() + "/post/Home",
            {
                headers: await authHeader()
            }
        ).then((post) => {
            setData((post.data.userpost).reverse());
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const handleRefresh = () => {
        setRefresh(false);
        getHomeScreenPost(); // call fetchCats after setting the state
    }

    const ReadMore = ({ children }) => {
        const text = children;
        const [isReadMore, setIsReadMore] = useState(true);
        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };

        if (text.length < 104) {
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

        return <TouchableOpacity onPress={handlePress} style={styles.linkButton}><Text style={{ fontSize: 15, textDecorationLine: 'underline', }}>Etkinliğe git</Text></TouchableOpacity>;
    };

    const toUser = (author) => {
        if (author == currentUser.id) {
            navigation.navigate("Profile")
        }
        else {
            navigation.navigate("UserOrModFollowlist", { user: author, role: "moderator" });
        }
    }

    const toParticipant = (postPartipants, isCurrentModId) => {
        if (currentUser.roles == "ROLE_USER") {
            navigation.navigate("toParticipant", { participants: postPartipants })
        }
        else if (currentUser.roles == "ROLE_MODERATOR") {
            navigation.navigate("toParticipantMod", { participants: postPartipants, isCurrentMod: isCurrentModId })
        }
        else if (currentUser.roles == "ROLE_ADMIN") {
            navigation.navigate("toParticipantMod", { participants: postPartipants, isCurrentMod: isCurrentModId })
        }
    }

    const toComment = (postID) => {
        navigation.navigate("comment", { postID: postID })
    }

    const emptyFlatlistComponent = () => {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />} >
                <View style={styles.tmpPostImage}>
                    <Image source={image.homeTmp} style={styles.tmpImagePost} />
                    <Text style={styles.noPostText}>Henüz gönderi yok</Text>
                </View>
            </ScrollView>
        )
    }

    const renderItemComponent = (data) =>
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.header} onPress={() => { toUser(data.item.userId) }}>
                    {
                        data.item.user.avatar !== null ? (
                            <Image source={{ uri: API_URL() + data.item.user.avatar }} style={styles.personImage} />
                        ) : (

                            <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                        )
                    }
                    <Text style={{ fontSize: 15, marginLeft: 5 }}>{data.item.user.username}</Text>
                </TouchableOpacity>
            </View>
            <View>
                {
                    data.item.image ? (
                        <Image source={{ uri: API_URL() + data.item.image }} style={styles.imagePost} />
                    ) : (
                        <Image source={image.profile_image} style={styles.imagePost} />
                    )
                }
            </View>

            <View style={styles.dateContainer}>
                <Text style={{ fontWeight: 'bold' }}>Etkinlik Tarihi:</Text>
                <Text style={styles.dateText}>{moment.locale('tr'), moment.utc(data.item.date).format('LLLL')}</Text>
            </View>

            <View style={styles.linkEventBtn}>
                {data.item.link ?
                    <OpenURLButton url={data.item.link} />
                    :
                    <View />
                }
            </View>

            {data.item.description ?
                <View style={styles.description}>
                    <ReadMore>
                        {data.item.description}
                    </ReadMore>
                </View>
                :
                <View />
            }

            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => { toParticipant(data.item.id, currentUser.id) }}>
                    <Icon name="people-circle-outline" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { toComment(data.item.id) }}>
                    <Icon name="chatbubbles-outline" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={addEventToCalendar}>
                    <Icon name="calendar-outline" style={styles.actionIcon} />
                </TouchableOpacity>
            </View>
        </View>


    return (
        <SafeAreaView>
            <FlatList
                data={data}
                renderItem={item => renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={emptyFlatlistComponent}
            />
        </SafeAreaView>
    )
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        alignSelf: 'center',
        marginVertical: 3,
        borderWidth: 0.3,
        borderColor: "grey",
        width: '100%',
        //height: height - 100,
        //backgroundColor: 'red'
    },

    tmpPostImage: {
        alignSelf: 'center',
        height: height - 430,
        width: '75%',
        borderWidth: 0.3,
        borderRadius: 12,
        marginTop: 20,
        borderColor: '#2c3ea7'
        //backgroundColor: 'blue'
    },
    tmpImagePost: {
        marginTop: 40,
        alignSelf: 'center',
        height: '32%',
        width: '34%',
    },
    noPostText: {
        marginTop: 50,
        alignSelf: 'center'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 6,
        padding: 5,
    },
    personImage: {
        width: 25,
        height: 25,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginRight: 3
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
        padding: 5,
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
        marginLeft: 6,
        marginRight: 6,
        padding: 5,
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

