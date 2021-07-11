import React, { Component, useEffect, useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    Image,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    ImageBackground,
    Platform
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import image from '../../../res/images';
import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';


const SearchScreen = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigation = props.navigation;

    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const [arrayholder, setArrayHolder] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchUSer();
    }, [])


    const fetchUSer = async () => {
        setRefresh(true);
        await axios.get(API_URL() + "/users",
            {
                headers: await authHeader()
            }
        ).then((resJson) => {
            // console.log(resJson.data.users);
            //setData(resJson.data.users);
            setArrayHolder(resJson.data.users);
            setRefresh(false);
        }).catch(e => console.log(e));
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

    const itemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "85%",
                    backgroundColor: "#000",
                    alignSelf: 'flex-end'
                }}
            />
        );
    }

    const searchData = (text) => {
        if (text) {
            const newData = arrayholder.filter(item => {
                const itemData = item.username.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });

            setData(newData);
            setText(text);
        } else {
            setData([]);
            setText(text);
        }

    }

    return (
        <View style={styles.MainContainer}>

            <TextInput
                style={styles.textInput}
                onChangeText={(text) => searchData(text)}
                value={text}
                underlineColorAndroid='transparent'
                placeholder="Aramak için yazın" />


            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={itemSeparator}
                initialNumToRender={5}
                style={{ marginTop: 10 }}
                renderItem={({ item }) =>

                    <TouchableOpacity style={styles.nameContainer} onPress={() => { toUser(item.id, item.roles) }}>
                        {
                            //console.log(data.item.user.avatar)
                            item.avatar !== null ? (
                                <Image source={{ uri: API_URL() + item.avatar }} style={styles.personImage} />
                            ) : (

                                <Image source={image.profile_image} resizeMode="cover" style={styles.personImage} />
                            )
                        }
                        <Text style={styles.username} >{item.username}</Text>
                    </TouchableOpacity>
                }
            />

        </View>
    )


}

export default SearchScreen;


const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 5,

    },

    username: {
        fontSize: 18,
        padding: 17
    },

    textInput: {

        textAlign: 'center',
        height: 42,
        borderWidth: 1,
        borderColor: '#f1880d',
        borderRadius: 8,
        backgroundColor: "#FFFF"

    },
    personImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
});
