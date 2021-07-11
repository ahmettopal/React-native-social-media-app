import React, { Component, useState, useEffect } from 'react'
import { Text, FlatList, View, RefreshControl, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Fab, Header, Tab, Tabs } from 'native-base';
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';


const PostParticipantsMod = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;
    const participantPostId = props.route.params.participants;
    const isCurrentModID = props.route.params.isCurrentMod;

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isparticipan, setIsparticipan] = useState(false);
    const [isCurrentMod, setIsCurrentMod] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchToPostParticipants();
        checkParticipant();
        checkPostMod();
        //checkPostMod();
    }, [])

    const onBack = () => {
        navigation.goBack();
    }

    const fetchToPostParticipants = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/post/${participantPostId}/participants`,
            {
                headers: await authHeader()
            }
        ).then((resJson) => {
            setData(resJson.data.participants);
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const addParticipants = async () => {
        //setRefresh(true);
        setLoading(true);
        await axios.post(API_URL() + `/post/${participantPostId}/like`, {},
            {
                headers: await authHeader()
            }
        ).then((res) => {
            //setRefresh(false);
            setIsparticipan(true);
            fetchToPostParticipants();
            setLoading(false);
            //this.handleRefresh();
        }).catch(e => console.log(e));
    }

    const checkParticipant = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/post/${participantPostId}/checkParticipants`,
            {
                headers: await authHeader()
            }
        ).then((res) => {
            setRefresh(false);
            setIsparticipan(true);
        }).catch(e => console.log(e));
    }

    const checkPostMod = async () => {
        setRefresh(true);
        try {
            await axios.get(API_URL() + `/post/${participantPostId}/checkPostMod/${isCurrentModID}`,
                {
                    headers: await authHeader()
                }
            ).then((res) => {
                //console.log(res.data.user);
                setRefresh(false);
                setIsCurrentMod(true);
            })
        } catch (error) {
            console.log(error);
        }

    }

    const refreshData = () => {
        fetchToPostParticipants();
        checkParticipant();
    }

    const handleRefresh = () => {
        setRefresh(false);
        refreshData(); // call fetchCats after setting the state
    }

    const toScanQrCode = () => {
        navigation.navigate("QrCodeScanner")
    }

    const ToParticipatedUsers = (_postId) => {
        navigation.navigate("ParticipatedUser", { postId: _postId })
    }

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
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
                <Text style={{ fontSize: 15 }}>Henüz katılımcı yok, ilk siz katılın</Text>
            </View>
        )
    }

    const renderItemComponent = (data) =>
        <TouchableOpacity onPress={() => { toUser(data.item.userId, data.item.user.roles) }} style={styles.userList}>
            {
                data.item.user.avatar !== null ? (
                    <Image source={{ uri: API_URL() + data.item.user.avatar }} style={styles.personImage} />
                ) : (
                    <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                )
            }
            <Text style={styles.username}>{data.item.user.username}</Text>
        </TouchableOpacity>

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <Icon onPress={onBack} name="arrow-back-outline" size={25} />
                    <Text style={styles.headerText}> Katılımcı</Text>
                </View>

                {isCurrentMod === true ?
                    <View />
                    :
                    isparticipan === true ? (
                        <View style={styles.joinedButton}>
                            <Text style={styles.addedText}>Katıldın </Text>
                            <Icon name="people-outline" size={20} color={'#2c3ea7'} />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.joinButon} onPress={addParticipants} disabled={loading}>
                            {loading && <ActivityIndicator color="#FFF" />}
                            <Text style={styles.addText}>Katıl </Text>
                            <Icon name="person-add-outline" size={20} color={'white'} />
                        </TouchableOpacity>
                    )
                }
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


            {/*

            <View style={{ flex: 1 }}>
                <Fab
                    active={active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#f1880d' }}
                    position="bottomRight"
                    onPress={() => setActive(!active)}>
                    <Icon name="share" />
                    <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={toScanQrCode}>
                        <Icon name="qr-code-outline" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={() => { ToParticipatedUsers(participantPostId) }}>
                        <Icon name="people-outline" size={20} />
                    </TouchableOpacity>
                </Fab>
            </View>
                    */}

        </View>
    )
}



export default PostParticipantsMod;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    qrCodeButton: {
        marginRight: 20,
    },
    joinButon: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        width: '35%',
        height: 35,
        borderRadius: 10,
        backgroundColor: '#2c3ea7',
    },
    joinedButton: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        width: '35%',
        height: 35,
        borderRadius: 10,
        borderColor: '#2c3ea7',
        borderWidth: 1,
        backgroundColor: '#FFF',
    },
    addText: {
        fontSize: 20,
        color: "white"
    },
    addedText: {
        fontSize: 20,
        color: '#2c3ea7'
    },
    userList: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 7,
        //backgroundColor: 'yellow'
    },
    personImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 5,
    },
    username: {
        fontSize: 20,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});