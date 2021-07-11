import React, { Component, useState, useEffect } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, KeyboardAvoidingView, Alert, Dimensions } from 'react-native'
import axios from "axios";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const { width, height } = Dimensions.get('window');

const CommentScreen = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;
    const postId = props.route.params.postID;
    const isCurrentMod = props.route.params.__isCurrentMod;

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchToComments();
    }, [])

    const fetchToComments = async () => {
        //setRefresh(true);
        await axios.get(API_URL() + `/post/${postId}/getComment`,
            {
                headers: await authHeader()
            }
        )
            .then((resJson) => {
                setData(resJson.data.comments);
                //setRefresh(false);
            }).catch(e => console.log(e));
    }

    const sendComment = async () => {
        //setRefresh(true);
        setLoading(true);
        await axios.post(API_URL() + `/post/${postId}/comment`,
            {
                "text": input
            },
            {
                headers: await authHeader()
            }
        )
            .then((resJson) => {
                handleRefresh();
                setLoading(false);
                setInput("");
            }).catch(e => console.log(e));
    }

    const onBack = () => {
        navigation.goBack();
    }

    const deleteCommentHandle = (_commentId) => {
        Alert.alert(
            "Yorumu sil",
            "Bu yorumu silmek istediğinize emin misiniz ?",
            [
                {
                    text: "Hayır",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Evet", onPress: () => deleteComment(_commentId) }
            ]
        );
    }

    const deleteComment = async (commentId) => {
        setRefresh(true);
        await axios.delete(API_URL() + `/comment/delete/${commentId}`,
            {
                headers: await authHeader()
            }
        ).then(resJson => {
            setRefresh(false);
            fetchToComments();
        }).catch(e => console.log(e));
    }

    const handleRefresh = () => {
        setRefresh(false);
        fetchToComments(); // call fetchCats after setting the state
    }

    const ReadMore = ({ children }) => {
        const text = children;
        const [isReadMore, setIsReadMore] = useState(true);
        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };

        if (text.length < 70) {
            return <Text>{text}</Text>
        } else {
            return (
                <Text>
                    {isReadMore ? text.slice(0, 70) : text}
                    <Text onPress={toggleReadMore} style={{ fontWeight: 'bold' }}>
                        {isReadMore ? "...devamı" : " küçült"}
                    </Text>
                </Text>
            );
        }

    };

    const toUser = (author, userRole) => {
        let role = userRole.map(user => user.name);

        if (author == currentUser.id) {
            navigation.navigate("Profile")
        }
        else {
            if (role == "user") {
                navigation.navigate("UserOrModFollowlist", { user: author, role: role })
            }
            else if (role == "moderator") {
                navigation.navigate("UserOrModFollowlist", { user: author, role: role });
            }
            else if (role == "admin") {
                navigation.navigate("UserOrModFollowlist", { user: author, role: role })
            }
        }
    }

    const emptyFlatlistComponent = () => {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}>
                <View style={styles.tmpPostImage}>
                    <Image source={image.commentTmp} style={styles.tmpImagePost} />
                    <Text style={styles.noPostText}>Henüz yorum yok. İlk yorum yapan siz olun</Text>
                </View>
            </ScrollView>
        )
    }

    const renderItemComponent = (data) =>
        <ScrollView>
            <View style={styles.userListContainer}>
                <View style={styles.userList}>
                    <View style={{ marginTop: 0 }}>
                        {
                            //console.log(data.item.user.avatar)
                            data.item.user.avatar !== null ? (
                                <Image source={{ uri: API_URL() + data.item.user.avatar }} style={styles.personImage} />
                            ) : (

                                <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                            )
                        }
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => { toUser(data.item.userId, data.item.user.roles) }}>
                            <Text style={styles.username}>{data.item.user.username}</Text>
                        </TouchableOpacity>

                        {data.item.text ?
                            <View style={styles.commentText}>
                                <ReadMore>
                                    {data.item.text}
                                </ReadMore>
                            </View>
                            :
                            <View />
                        }

                    </View>
                </View>

                <View style={styles.deleteCommentContainer}>
                    {
                        !isCurrentMod ? (
                            <View style={styles.deleteCommentContainer}>
                                {
                                    currentUser.id !== data.item.userId ? (
                                        <View />
                                    ) : (
                                        <View style={styles.deleteComment}>
                                            <TouchableOpacity onPress={() => deleteCommentHandle(data.item.id)}>
                                                <Icon name="trash-outline" size={20} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        ) : (
                            <View style={styles.deleteComment}>
                                <TouchableOpacity onPress={() => deleteCommentHandle(data.item.id)}>
                                    <Icon name="trash-outline" size={20} />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>


            </View>
        </ScrollView>

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.header}>
                <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                <Text style={styles.headerText}> Yorumlar </Text>
            </View>

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

            <View style={styles.inputBox}>
                {
                    currentUser.avatar ? (
                        <Image source={{ uri: API_URL() + currentUser.avatar }} style={styles.personImage} />
                    ) : (

                        <Image source={image.profile_image} style={styles.personImage} />
                    )
                }
                <TextInput
                    multiline={true}
                    //autoFocus={true}
                    textAlignVertical="top"
                    value={input}
                    style={styles.input}
                    onChangeText={text => setInput(text)}
                    placeholder="Yorum yaz..."

                />

                {input.length < 1 &&
                    <Icon name="send" style={styles.sendIcon} color='#9EA7DB' />
                }
                {input.length >= 1 &&
                    <TouchableOpacity onPress={sendComment} disabled={loading}>
                        <Icon name="send" style={styles.sendIcon} color='#2c3ea7' />
                    </TouchableOpacity>
                }

            </View>
        </KeyboardAvoidingView>
    )

}


export default CommentScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: "row",
        //justifyContent: "space-between",
        marginHorizontal: 13,
        alignItems: 'center',
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
        //paddingBottom: 5,
        //backgroundColor: 'green'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    userListContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 7,
        //backgroundColor: 'red'
    },
    userList: {
        flexDirection: 'row',
        marginLeft: 10,
        width: '70%',
        //alignItems: 'center',
        //backgroundColor: 'yellow'
    },
    personImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 5,
        //backgroundColor: 'black',
    },
    username: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    deleteCommentContainer: {
        alignSelf: 'center',
        marginRight: 20,
        //backgroundColor: 'blue'
    },
    commentText: {

    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#000',
        borderTopWidth: 0.5,
        justifyContent: 'space-between',
        marginRight: 5,
        marginLeft: 5,
        height: 60
        //backgroundColor: 'grey',
    },
    input: {
        width: '70%',
        alignItems: 'center',
        marginRight: 10,
        paddingHorizontal: 10,
        //marginLeft: 10,
        //backgroundColor: 'yellow'
    },
    sendIcon: {
        fontSize: 30,
        marginRight: 10,
        //backgroundColor: 'red'
    },

    tmpPostImage: {
        alignSelf: 'center',
        height: height - 430,
        width: width - 110,
        borderWidth: 0.3,
        borderRadius: 12,
        marginTop: 20,
        borderColor: '#2c3ea7'
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
});