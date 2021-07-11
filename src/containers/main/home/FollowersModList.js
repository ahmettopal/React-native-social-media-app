import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, SafeAreaView, Image, ScrollView,
    TextInput, RefreshControl, Alert, TouchableOpacity, KeyboardAvoidingView, FlatList
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const FollowList = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;

    const user = props.route.params.user;

    const [followers, setFollowers] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getFollowers();
    }, [])

    const getFollowers = async () => {
        await axios.get(API_URL() + `/user/${user}/followers`,
            {
                headers: await authHeader()
            }
        )
            .then(follow => {
                setFollowers(follow.data.followers);
            }).catch(e => console.log(e));
    }

    const handleRefresh = () => {
        getFollowers();
    }

    const toUser = (author, userRole) => {
        let role = userRole.map(user => user.name);
        if (author == currentUser.id) {
            navigation.navigate("Profile")
        }
        else {
            if (role == "user") {
                //navigation.navigate("ToUserOrMod", { user: author })
                navigation.navigate("UserOrModFollowlist", { user: author, role: role });
            }
            else if (role == "moderator") {
                navigation.navigate("UserOrModFollowlist", { user: author, role: role });
            }
            else if (role == "admin") {
                navigation.navigate("UserOrModFollowlist", { user: author, role: role })
            }
        }

    }

    const renderItemComponent = (data) =>
        <View style={styles.userList}>
            <TouchableOpacity style={styles.header} onPress={() => { toUser(data.item.userId, data.item.user.roles) }}>
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

    return (
        <FlatList
            data={followers}
            renderItem={item => renderItemComponent(item)}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
        />
    )
}

export default FollowList;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //marginLeft: 6,
        //padding: 5,
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
        width: 95,
        height: 35,
        borderWidth: 0.8,
        borderRadius: 12,
        borderColor: 'grey',
        //backgroundColor: 'red'
    },
    addText: {
        fontSize: 20,
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
    }
});