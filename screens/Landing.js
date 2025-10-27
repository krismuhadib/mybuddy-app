import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { i18n } from "../constants/Localization";
import BDStyles from "../assets/styles/forms";
import Logo from '../components/auth/Logo';


const LandingScreen = () => {

    const navigation = useNavigation();

    const LinkMe = (screen) =>{
        //console.log("link me", screen)
        return navigation.navigate(screen);
    };

    return (
        <View style={[BDStyles.container, {alignItems: 'center',
        justifyContent: 'center',
        alignContent:'center',}]}>
            <View style={{height:0}}></View>
            <Logo />
            <View style={{height:50}}></View>
            
            <View style={{marginTop:50}}></View>
                <TouchableOpacity  style={BDStyles.buttonInverted} onPress={()=>LinkMe("SignIn")}>
                    <Text style={BDStyles.buttonLabelInverted}>{i18n.t('auth.login.button')}</Text>
                </TouchableOpacity>
                <View style={{height:20,}}></View>
            <TouchableOpacity  style={BDStyles.button} onPress={()=>LinkMe("SignUp")}>
                <Text style={BDStyles.buttonLabel}>{i18n.t('auth.signup.button')}</Text>
            </TouchableOpacity>
        </View>                 
    );
};

export default LandingScreen;