import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'

import images from '../../../res/images';


const LoadingScreen = () => {
    return (
        <View style={styles.container} >
            <Image source={images.logo} style={styles.logo} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
    },
    logo: {
        alignSelf: 'center',
        width: '80%',
        resizeMode: 'contain',
    }
})


export default LoadingScreen;