import React, { useState, useEffect } from 'react';
import {
  Platform, KeyboardAvoidingView, TouchableWithoutFeedback,
  SafeAreaView, Keyboard, View, Text, TouchableOpacity
} from 'react-native'; import { useNavigation } from '@react-navigation/native';
import { i18n } from "../../constants/Localization"
import BDiaryStylesForms from "../../assets/styles/forms"
import Colors from '../../constants/Colors';
import Logo from '../../components/auth/Logo';
import { MaterialIcons } from '@expo/vector-icons';
import { Post, ApiRoutes } from '../../services/api';
import { ValidateEmail } from '../../utils/helpers';
import KohanaInputText from '../../components/elements/KohanaInputText';
import { CheckBackendErrors } from '../../utils/helpers';
import { ShowToast } from '../../services/notification';

import BDButton from '../../components/elements/BDButton';


const ForgotPasswordScreen = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [displaybutton, setDisplayButton] = useState(false);

  useEffect(() => {
    validateForm();
  }, [displaybutton, email]);

  const validateForm = () => {

    if (!email.length) {
      return setDisplayButton(false);
    }
    if (!ValidateEmail(email)) {
      return setDisplayButton(false);
    }

    return setDisplayButton(true);
  };


  const LinkMe = (screen) => {
    return navigation.goBack();
  };

  const ForgotPwd = async () => {
    const res = await Post(ApiRoutes.forgot, {
      email: email.toLowerCase(),
    });
    if (res.success) {
      navigation.navigate('VerifyCode', {
        email: email.toLowerCase(),
        from: 'forgot',
      });
    } else {
      ShowToast(CheckBackendErrors(res.error));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <SafeAreaView style={[BDiaryStylesForms.container]}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={BDiaryStylesForms.inner}>

            <View style={{ marginTop: 0, }}>
              <Logo />
            </View>

            <View style={BDiaryStylesForms.formsContainer} >

              <View style={{ marginBottom: 10, padding: 10. }}>
                <Text style={[BDiaryStylesForms.h4, { textUnderline: 20, color: Colors.greyM, textAlign: "left" }]}>{i18n.t('auth.forgot.text')}</Text>
              </View>

              <View>
                <KohanaInputText
                  iconName='alternate-email'
                  iconClass={MaterialIcons}
                  handleValue={setEmail}
                  valueName={email}
                  label={i18n.t('auth.signup.email')}
                  keyboardType='email-address'
                />
              </View>

              <View style={{ marginTop: 50, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={displaybutton}
                  functionProp={ForgotPwd}
                  label={i18n.t('auth.forgot.submit')}
                />
              </View>

              <View style={{ marginBottom: 200, flexDirection: "row", alignContent: "center", justifyContent: "flex-end", top: 10, paddingRight: 10, }}>
                <Text style={BDiaryStylesForms.textWithoutUnderline}>{i18n.t('auth.signup.login')} </Text>
                <TouchableOpacity onPress={() => LinkMe("SignIn")}>
                  <Text style={[BDiaryStylesForms.textUnderline, { padding: 0, top: 0 }]}> {i18n.t('auth.login.button')}</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
export default ForgotPasswordScreen;