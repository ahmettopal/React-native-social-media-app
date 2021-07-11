import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch, useSelector } from "react-redux";

const Tab = createMaterialTopTabNavigator();

import FollowList from '../containers/main/profile/FollowList';
import FollowersList from '../containers/main/profile/FollowersList';

import FollowerModList from '../containers/main/home/FollowersModList';
import FollowUserList from '../containers/main/home/FollowUserList';

const FollowFollowersRoute = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const user = props.route.params.user;
    const user_role = props.route.params.role;

    if (user == currentUser.id) {
        if (currentUser.roles == "ROLE_USER") {
            return (
                <Tab.Navigator >
                    <Tab.Screen name="Takip" component={FollowList} />
                </Tab.Navigator>
            )
        }
        else if (currentUser.roles == "ROLE_MODERATOR") {
            return (
                <Tab.Navigator >
                    <Tab.Screen name="Takip" component={FollowList} />
                    <Tab.Screen name="Takipçi" component={FollowersList} />
                </Tab.Navigator>
            )
        }
        else if (currentUser.roles == "ROLE_ADMIN") {
            return (
                <Tab.Navigator >
                    <Tab.Screen name="Takip" component={FollowList} />
                    <Tab.Screen name="Takipçi" component={FollowersList} />
                </Tab.Navigator>
            )
        }
    }
    else {
        if (user_role == "user") {
            return (
                <Tab.Navigator >
                    <Tab.Screen name="Takip" component={FollowUserList} initialParams={{ user: user }} />
                </Tab.Navigator>
            )
        }
        else if (user_role == "moderator") {
            return (
                <Tab.Navigator >
                    <Tab.Screen name="Takip" component={FollowUserList} initialParams={{ user: user }} />
                    <Tab.Screen name="Takipçi" component={FollowerModList} initialParams={{ user: user }} />
                </Tab.Navigator>
            )
        }
        else if (user_role == "admin") {
            return (
                <Tab.Navigator >
                    <Tab.Screen name="Takip" component={FollowUserList} initialParams={{ user: user }} />
                    <Tab.Screen name="Takipçi" component={FollowerModList} initialParams={{ user: user }} />
                </Tab.Navigator>
            )
        }
    }


}

export default FollowFollowersRoute;