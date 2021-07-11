import React, { useState, useEffect, useRef } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    View
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import axios from 'axios';

import authHeader from '../../../services/auth-header';
import API_URL from '../../../components/API_URL';

export default ScanScreen = () => {

    const scanner = useRef(null);
    const [scan, setScan] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        setResult(null);
    }, [])

    const onSuccess = async (e) => {
        setResult(e);
        setScan(false);

        if (e.data.substring(0, 4) === 'http') {
            //alert(e.data);
            try {
                await axios.get(e.data,
                    {
                        headers: await authHeader()
                    }
                ).then((res) => {
                    //console.log(res);
                    alert(JSON.stringify(res.data.user));
                })
            } catch (error) {
                alert("kullanıcı bulunamadı")
            }

        }

        /*Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );*/
    };

    return !scan ? (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonTouchable} onPress={() => setScan(true)}>
                <Text style={styles.buttonText}>kodu oku</Text>
            </TouchableOpacity>
        </View>
    ) : (
        <View>
            <QRCodeScanner
                onRead={onSuccess}
                ref={scanner}
                reactivate={true}
                showMarker={true}
            //flashMode={RNCamera.Constants.FlashMode.torch}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});