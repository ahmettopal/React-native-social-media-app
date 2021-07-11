import React, { Component, useState, useEffect } from 'react'
import { Text, View, FlatList, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import axios from "axios";
import Icon from 'react-native-vector-icons/Ionicons';
import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

const PostParticipatedList = (props) => {
    const navigation = props.navigation;
    const PostId = props.route.params.postId;

    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchParticipated();
    }, [])

    const fetchParticipated = async () => {
        setRefresh(true);
        await axios.get(API_URL() + `/post/${PostId}/getIsParticipant`,
            {
                headers: await authHeader()
            }
        ).then((res) => {
            setData(res.data.participants)
            setRefresh(false);
        }).catch(e => console.log(e));
    }

    const handleRefresh = () => {
        setRefresh(false);
        fetchParticipated(); // call fetchCats after setting the state
    }

    const renderItemComponent = (data) =>
        <View style={styles.userList}>
            {
                data.item.user.avatar !== null ? (
                    <Image source={{ uri: API_URL() + data.item.user.avatar }} style={styles.personImage} />
                ) : (

                    <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                )
            }
            <Text style={styles.username}>{data.item.user.username}</Text>
        </View>

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}> Katılanlar </Text>
            </View>
            <FlatList
                data={data}
                renderItem={item => renderItemComponent(item)}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            />

        </View>
    )

}

export default PostParticipatedList;


const styles = StyleSheet.create({
    container: {
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
        fontSize: 30
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
        width: 40,
        height: 40,
        borderRadius: 25,
        //backgroundColor: 'black',
        marginRight: 5
    },
    username: {
        fontSize: 20,
    }
});