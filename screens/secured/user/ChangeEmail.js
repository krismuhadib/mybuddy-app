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
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';
import KohanaInputText from '../../../components/elements/KohanaInputText';
import BDButton from '../../../components/elements/BDButton';
import { ShowToast } from '../../../services/notification';
import { SaveUser } from '../../../redux/slices/userSlice';
import { ValidateEmail } from '../../../utils/helpers';


const ChangeEmailScreen = () => {

    // User Redux Store Data
    const navigation = useNavigation();

    const storeDispatch = useDispatch();
    const userData = useSelector((state) => state.user.value);
    const animalData = useSelector((state) => state.animal.value.value);
    const [email, setEmail] = useState('');
    const [emailconf, setEmailConf] = useState('');
    const [displaybutton, setDisplayButton] = useState(false);

    console.log("ChangeEmailScreen");

    useEffect(() => {
        validateForm();
    }, [emailconf, email]);


    const validateForm = () => {

        if (!email.length || !emailconf.length) {
            return setDisplayButton(false);
        }
        if (!ValidateEmail(email)) {
            return setDisplayButton(false);
        }
        if (!ValidateEmail(emailconf)) {
            return setDisplayButton(false);
        }

        // Different Email
        if (email !== emailconf) {
            return setDisplayButton(false);
        }

        return setDisplayButton(true);
    };


    const changeEmail = async () => {
        if (email.length > 0 && userData && userData._id) {
            const res = await Post(ApiRoutes.changeEmail, {
                user_id: userData._id,
                newemail: email
            });

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
                label={i18n.t('userSetting.changeEmail')}
                navigationName="User"
                navigationFrom="User"
                goBack={true}
            //navigationNameR="WelcomeUser"
            //navigationFromR="User"
            />

            <ScrollView>

                <View style={{ marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
                    {/* <Text style={BDiaryStyles.h4}>{i18n.t('userSetting.changeEmailTxt')}</Text> */}

                    {/* <View style={{ marginBottom: 20, padding: 10. }}>
                        <Text style={[BDiaryStylesForms.h4, { textUnderline: 20, color: Colors.greyM, textAlign: "left" }]}>{i18n.t('userSetting.changeEmailTxt')}</Text>
                    </View> */}

                    <View style={BDiaryStylesForms.formsContainer} >

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('userSetting.actualEmail')}</Text>
                            <View style={[BDiaryStylesForms.textInput, { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                                <Text style={[BDiaryStylesForms.textInputStyle, { color: Colors.greyL, }]}>{userData.email}</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('userSetting.newEmail')}</Text>

                            <KohanaInputText
                                iconName='alternate-email'
                                iconClass={MaterialIcons}
                                handleValue={setEmail}
                                valueName={email}
                                label={""}
                                keyboardType='email-address'
                            />
                        </View>

                        <View style={{ marginBottom: 0 }}>
                            <Text style={[BDiaryStylesForms.h6, { top: 0, paddingLeft: 0, fontStyle: "italic", }]}> {i18n.t('userSetting.confirmNewEmail')}</Text>

                            <KohanaInputText
                                iconName='alternate-email'
                                iconClass={MaterialIcons}
                                handleValue={setEmailConf}
                                valueName={emailconf}
                                label={""}
                                keyboardType='default'
                            />
                        </View>

                    </View>

                </View>

                <View style={{ marginLeft: 40, marginRight: 40, paddingTop: 20 }}>
                    <BDButton
                        bgcolor={Colors.greenBuddy}
                        color={Colors.white}
                        display={displaybutton}
                        functionProp={() => changeEmail()}
                        label={i18n.t('auth.login.submit')}
                    />
                </View>
            </ScrollView>

        </View>
    );
};

export default ChangeEmailScreen;