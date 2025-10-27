import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStylesForms from "../../../assets/styles/forms";
import BDiaryStyles from "../../../assets/styles/styles";

import { i18n } from "../../../constants/Localization";
import { Post, ApiRoutes } from '../../../services/api';
import { useDispatch } from "react-redux";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import KohanaInputText from '../../../components/elements/KohanaInputText';
import BDButton from '../../../components/elements/BDButton';
import { ShowToast } from '../../../services/notification';
import { SaveUser } from '../../../redux/slices/userSlice';
import { ValidateEmail } from '../../../utils/helpers';
import { CheckForSpecialChar, CheckAllCases } from '../../../utils/helpers';


const ChangePwdScreen = () => {

    // User Redux Store Data
    const navigation = useNavigation();

    const storeDispatch = useDispatch();
    const userData = useSelector((state) => state.user.value);
    const animalData = useSelector((state) => state.animal.value.value);
    const [email, setEmail] = useState('');
    const [emailconf, setEmailConf] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [showpassword, setShowPassword] = useState(false);
    const [showpasswordconf, setShowPasswordConf] = useState(false);
    const [displaybutton, setDisplayButton] = useState(false);

    console.log("ChangePwdScreen");

    useEffect(() => {
        validateForm();
    }, [passwordConf, password]);

    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showpassword);
    };

    const toggleShowPasswordConf = () => {
        setShowPasswordConf(!showpasswordconf);
    };

    const validateForm = () => {

        if (!password.length) {
            return setDisplayButton(false);
        }
        if (password.length < 8) {
            return setDisplayButton(false);
        }
        if (!CheckForSpecialChar(password)) {
            return setDisplayButton(false);
        }
        if (!CheckAllCases(password)) {
            return setDisplayButton(false);
        }
        if (password !== passwordConf) {
            return setDisplayButton(false);
        }

        return setDisplayButton(true);
    };

    const ChangePwd = async () => {
        if (password.length > 0 && userData && userData._id) {
            const res = await Post(ApiRoutes.changePwd, {
                user_id: userData._id,
                password: password
            });
            console.log("ChangePwd res", res)

            if (res.success === false) {
                ShowToast('error', i18n.t('userSetting.error'), i18n.t('userSetting.alreadyExist'));

            } else {
                storeDispatch(SaveUser(res.value));
                ShowToast('success', 'Success', i18n.t('userSetting.userUpdated'));
                navigation.goBack();
            }
        }
    };

    return (
        <View style={BDiaryStylesForms.container}>

            <HeaderBuddyLeft
                // openModal={openModal}
                iconNameL="angle-left"
                //iconNameR="add"
                iconFamilyL="FontAwesome"
                //iconFamilyR="Ionicons"
                label={i18n.t('userSetting.changePwd')}
                navigationName="User"
                navigationFrom="User"
                goBack={true}
            //navigationNameR="WelcomeUser"
            //navigationFromR="User"
            />

            <ScrollView>

                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }}>

                    <View style={BDiaryStylesForms.formsContainer} >
                    
                        <View style={{ marginBottom: 10 }}>
                           
                           <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('userSetting.newPwd')}</Text>
                            <View style={[BDiaryStylesForms.textInput, { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                                <TextInput
                                    style={BDiaryStylesForms.textInputStyle}
                                    secureTextEntry={!showpassword}
                                    placeholder={i18n.t('auth.setPassword.password')}
                                    placeholderTextColor={Colors.greyL}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <Feather
                                    name={showpassword ? 'eye-off' : 'eye'}
                                    size={22}
                                    color={Colors.greyL}
                                    style={{ top: 7, marginRight: 20 }}
                                    onPress={toggleShowPassword}
                                />
                            </View>
                            <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", padding: 5, alignItems: "center" }}>
                                <View style={BDiaryStylesForms.smallCircle}></View>
                                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.maxChar')}</Text>
                                <View style={BDiaryStylesForms.smallCircle}></View>
                                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.upperChar')}</Text>
                                <View style={BDiaryStylesForms.smallCircle}></View>
                                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.specialChar')}</Text>
                            </View>

                        </View>

                        <View style={{ marginBottom: 10 }}>
                            
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('userSetting.newPwd')}</Text>
                            <View style={[BDiaryStylesForms.textInput, { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                                <TextInput
                                    style={BDiaryStylesForms.textInputStyle}
                                    secureTextEntry={!showpasswordconf}
                                    placeholder={i18n.t('auth.setPassword.password')}
                                    placeholderTextColor={Colors.greyL}
                                    value={passwordConf}
                                    onChangeText={setPasswordConf}
                                />
                                <Feather
                                    name={showpasswordconf ? 'eye-off' : 'eye'}
                                    size={22}
                                    color={Colors.greyL}
                                    style={{ top: 7, marginRight: 20 }}
                                    onPress={toggleShowPasswordConf}
                                />
                            </View>
                            <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", padding: 5, alignItems: "center" }}>
                                <View style={BDiaryStylesForms.smallCircle}></View>
                                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.maxChar')}</Text>
                                <View style={BDiaryStylesForms.smallCircle}></View>
                                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.upperChar')}</Text>
                                <View style={BDiaryStylesForms.smallCircle}></View>
                                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.specialChar')}</Text>
                            </View>

                        </View>

                    </View>

                </View>

                <View style={{ marginLeft: 40, marginRight: 40, paddingTop: 20 }}>
                    <BDButton
                        bgcolor={Colors.greenBuddy}
                        color={Colors.white}
                        display={displaybutton}
                        functionProp={() => ChangePwd()}
                        label={i18n.t('auth.login.submit')}
                    />
                </View>
            </ScrollView>

        </View>
    );
};

export default ChangePwdScreen;