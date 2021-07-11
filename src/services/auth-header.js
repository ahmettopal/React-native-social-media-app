import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function authHeader() {

  var user = await AsyncStorage.getItem('user');

  if (user && JSON.parse(user).accessToken) {
    //console.log(JSON.parse(user).accessToken);
    //console.log(user.accessToken);
    return { "afitapp-secret-key": JSON.parse(user).accessToken };
  } else {
    return {};
  }
}
