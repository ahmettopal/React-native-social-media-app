import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
//import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
//import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
//import DetailsScreen from './DetailsScreen';
//import DiscoverScreen from '../components/main/Discover/DiscoverScreen';
//import ToUser from '../main/home/ToUser';
//import ToUserOrMod from '../main/home/toUserOrMod';
//import PostParticipants from '../components/main/PostParticipants';
//import SingIn from '../main/auth/LoginScreen';
//import CommentScreen from '../main/home/CommentScreen';
import PostDetail from '../../components/PostDetails';
import ProfileEdit from '../main/profile/ProfileEdit';
import UserOrModProfileFollowList from './home/UserOrModProfileFollowList';
import HomeScreen from '../main/home/HomeScreen';
import Discover from '../main/discover/Discover';
import SearchScreen from '../main/discover/SearchScreen';
import ProfileScreen from '../main/profile/ProfileScreen';
import Settings from '../main/profile/Settings';
import PostShare from '../main/post_share/PostShare';
import PostShareDetails from '../main/post_share/postShareDetails';
import EditPost from '../../components/EditPost';
import FollowFollowersList from '../../components/FollowFollowersRoute';
import TabComponent from './Tab';

import images from '../../res/images';

const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const DetailsStack = createStackNavigator();
const PostShareStack = createStackNavigator();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabScreen = () => (

    <Tab.Navigator initialRouteName="Home"   >
        <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
                tabBarButton: (props) => <TabComponent label="anasayfa" {...props} />,
            }}
        />

        <Tab.Screen
            name="Discover"
            component={DiscoverStackScreen}
            options={{
                tabBarButton: (props) => <TabComponent label="keşfet" {...props} />,
            }}
        />

        <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
                tabBarButton: (props) => <TabComponent label="profil" {...props} />,
            }}
        />

    </Tab.Navigator>

);

const MainTabScreenMod = () => (
    <Tab.Navigator initialRouteName="Home" >
        <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
                tabBarButton: (props) => <TabComponent label="anasayfa" {...props} />,
            }}
        />

        <Tab.Screen
            name="Discover"
            component={DiscoverStackScreen}
            options={{
                tabBarButton: (props) => <TabComponent label="keşfet" {...props} />,
            }}
        />

        <Tab.Screen
            name="PostShare"
            component={PostShareStackScreen}
            options={{
                tabBarButton: (props) => (
                    <TabComponent label="paylaş" {...props} />
                ),
            }}
        />

        <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
                tabBarButton: (props) => <TabComponent label="profil" {...props} />,
            }}
        />

    </Tab.Navigator>
)


const NavigateTab = (props) => {
    const navigation = props.navigation;
    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return (
            navigation.navigate("SignIn")
        )
    }
    else if (currentUser.roles == "ROLE_USER")
        return (
            <MainTabScreen />
        )
    else if (currentUser.roles == "ROLE_MODERATOR")
        return (
            <MainTabScreenMod />
        )
    else if (currentUser.roles == "ROLE_ADMIN")
        return (
            <MainTabScreenMod />
        )
}




export default NavigateTab;

const HomeStackScreen = ({ navigation }) => (
    <HomeStack.Navigator screenOptions={{}}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{
            title: null,

            headerLeft: () => (
                <Image source={images.logo} style={{ marginLeft: 20, width: 120, height: 50 }} />
                //<Icon.Button name="md-menu" size={25} onPress={() => navigation.openDrawer()}></Icon.Button>
            )
        }} />
        <HomeStack.Screen name="UserOrModFollowlist" component={UserOrModProfileFollowList} options={{ headerShown: false }} />
        <HomeStack.Screen name="followList" component={FollowFollowersList} options={{ headerShown: false }} />
    </HomeStack.Navigator>
);

const DiscoverStackScreen = ({ navigation }) => (
    <DetailsStack.Navigator screenOptions={{}}>
        <DetailsStack.Screen name="Pano" component={Discover} options={{
            headerShown: false,
            headerRight: () => (
                <Icon.Button name="md-search" size={25} backgroundColor="#fff" color="#000" onPress={() => navigation.navigate("Arama")}></Icon.Button>
            )
        }} />
        <DetailsStack.Screen name="Arama" component={SearchScreen} />
        <DetailsStack.Screen name="UserOrModFollowlist" component={UserOrModProfileFollowList} options={{ headerShown: false }} />
        <DetailsStack.Screen name="followList" component={FollowFollowersList} options={{ headerShown: false }} />
    </DetailsStack.Navigator>
);

const PostShareStackScreen = ({ navigation }) => (
    <PostShareStack.Navigator screenOptions={{}} >
        <PostShareStack.Screen name="share" component={PostShare} options={{ headerShown: false }} />
        <PostShareStack.Screen name="shareDetails" component={PostShareDetails} options={{ headerShown: false }} />
    </PostShareStack.Navigator>
);

const ProfileStackScreen = ({ navigation }) => (
    <ProfileStack.Navigator screenOptions={{}} >
        <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, }} />
        <ProfileStack.Screen name="UserOrModFollowlist" component={UserOrModProfileFollowList} options={{ headerShown: false }} />
        <ProfileStack.Screen name="followList" component={FollowFollowersList} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
);



