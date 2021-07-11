import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

import API_URL from '../components/API_URL';
import authHeader from './auth-header';

async function register(username, email, password) {
  const les = await axios.post(API_URL() + "/signup", {
    username,
    email,
    password,
  });
  return les;
}


const login = (username, password) => {
  return axios.post(API_URL() + "/signin", {
    username,
    password,
  })
    .then((response) => {
      if (response.data.accessToken) {
        //AsyncStorage.setItem('user', JSON.stringify(response.data));

        async function setitem() {
          try {
            await AsyncStorage.setItem('user', JSON.stringify(response.data));
          } catch (e) {
            console.log(e);
          }
        }
        setitem();
      }

      return response.data;
    });
};



const updateAvatar = async (avatar, imageType) => {
  const formData = new FormData();
  formData.append('avatar', {
    name: "avatar",
    type: imageType,
    uri: Platform.OS === 'android' ? avatar : avatar.replace('file://', ''),
  });

  return await axios.put(API_URL() + "/change_avatar",
    formData,
    {
      headers: {
        ...await authHeader(),
        "Content-type": "multipart/form-data",
        Accept: "application/json"
      }
    }
  ).then((changeAvatar) => {
    //console.log(changeAvatar.data.avatar);
    return changeAvatar.data.avatar;
  }).catch(e => console.log(e));
}

const updateUsername = async (username) => {
  return await axios.put(API_URL() + "/change_name",
    {
      "username": username
    },
    {
      headers: await authHeader()
    }
  ).then(changedUsername => {
    return changedUsername.data.username;
  }).catch(e => console.log(e));
}

const updateBiyografi = async (biyografi) => {
  return await axios.put(API_URL() + "/updateBiyo",
    {
      "biyografi": biyografi
    },
    {
      headers: await authHeader()
    }).then(res => {
      return res.data.biyografi
    }).catch(error => {
      //console.log(error);
    });
}

const logout = () => {
  AsyncStorage.removeItem('user');
};

export default {
  register,
  login,
  updateAvatar,
  updateUsername,
  updateBiyografi,
  logout,
};
