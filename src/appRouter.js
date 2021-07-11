import React from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import SignIn from '../src/containers/main/auth/LoginScreen';
import SignUp from '../src/containers/main/auth/RegisterScreen';
import ResetPassword from '../src/containers/main/auth/ResetPassword';
import HomeNavigator from '../src/containers/main/HomeNavigator';

//import ToUser from '../src/containers/main/home/ToUser';
import PostParticipants from '../src/containers/main/home/PostParticipants';
import PostParticipantsMod from '../src/containers/main/home/PostParticipantsMod';
//import PostParticipatedList from '../src//containers/main/home/PostPartitipatedList';
import CommentScreen from '../src//containers/main/home/CommentScreen';
//import ToUserOrMod from '../src/containers/main/home/toUserOrMod';
//import SearchScreen from '../src/containers/main/discover/SearchScreen';
import ProfileEdit from '../src/containers/main/profile/ProfileEdit';
//import QRCodeScanner from '../src/containers/main/home/QRCodeScanner';
import EditPost from '../src/components/EditPost';
import Settings from './containers/main/profile/Settings';
import PostDetail from '../src/components/PostDetails';
//import FollowFollowersList from './components/FollowFollowersRoute';
//import UserOrModProfileFollowList from './containers/main/home/UserOrModProfileFollowList';

import { useSelector } from "react-redux";

const Stack = createStackNavigator();

const AppRouter = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    return (
        <NavigationContainer>

            { currentUser ? (

                <Stack.Navigator headerMode="screen" StatusBarStyle="light-content" screenOptions={{ headerShown: false }}>

                    <Stack.Screen name="Home" component={HomeNavigator} />
                    <Stack.Screen name="comment" component={CommentScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="toParticipant" component={PostParticipants} options={{ headerShown: false }} />
                    <Stack.Screen name="toParticipantMod" component={PostParticipantsMod} options={{ headerShown: false }} />
                    <Stack.Screen name="EditPost" component={EditPost} options={{ headerShown: false }} />
                    <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                    <Stack.Screen name="editProfile" component={ProfileEdit} options={{ headerShown: false }} />
                    <Stack.Screen name="ToPostDetail" component={PostDetail} options={{ headerShown: false }} />
                    {/*<Stack.Screen name="followList" component={FollowFollowersList} options={{ headerShown: false }} />*/}
                    {/*<Stack.Screen name="ToUser" component={ToUser} options={{ headerShown: false }} />*/}
                    {/*<Stack.Screen name="ParticipatedUser" component={PostParticipatedList} options={{ headerShown: false }} />*/}
                    {/*<Stack.Screen name="ToUserOrMod" component={ToUserOrMod} options={{ headerShown: false }} />*/}
                    {/*<Stack.Screen name="Arama" component={SearchScreen} />*/}
                    {/*<Stack.Screen name="QrCodeScanner" component={QRCodeScanner} options={{ headerShown: false }} />*/}
                    {/*<Stack.Screen name="UserOrModFollowlist" component={UserOrModProfileFollowList} options={{ headerShown: false }} />*/}
                </Stack.Navigator>
            )
                : (
                    <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="SignIn" component={SignIn} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                        <Stack.Screen name="ResetPassword" component={ResetPassword} />
                    </Stack.Navigator>
                )
            }

        </NavigationContainer>
    );
};


export default AppRouter;
