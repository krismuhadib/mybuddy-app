import React, { useEffect, useState, useContext } from 'react';
import {
  Platform, KeyboardAvoidingView, TouchableWithoutFeedback,
  SafeAreaView, Keyboard, View, Text, TextInput, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { i18n } from "../../constants/Localization";
import BDiaryStylesForms from "../../assets/styles/forms"
import Colors from '../../constants/Colors';
import Logo from '../../components/auth/Logo';
import Header from '../../components/auth/Header';
import { Feather } from '@expo/vector-icons';
import { Post, ApiRoutes } from '../../services/api'
import { ShowToast } from '../../services/notification';
import { CheckForSpecialChar, CheckAllCases } from '../../utils/helpers';
import { CheckBackendErrors } from '../../utils/helpers';
import BDButton from '../../components/elements/BDButton';



const SetPasswordScreen = (route) => {

  const navigation = useNavigation();
  const { email, code, from } = route.route.params;
  const [password, setPassword] = useState('');
  const [passwordconf, setPasswordConf] = useState('');
  const [showpassword, setShowPassword] = useState(false);
  const [showpasswordconf, setShowPasswordConf] = useState(false);
  const [displaybutton, setDisplayButton] = useState(false);



  // Function to toggle the password visibility state 
  const toggleShowPassword = () => {
    setShowPassword(!showpassword);
  };

  const toggleShowPasswordConf = () => {
    setShowPasswordConf(!showpasswordconf);
  };

  const LinkMe = (screen) => {
    return navigation.navigate(screen);
  };

  useEffect(() => {
    validateForm();
  }, [displaybutton, password, passwordconf]);


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
    if (password !== passwordconf) {
      return setDisplayButton(false);
    }
    return setDisplayButton(true);
  };


  const SetPassword = async () => {

    if (from === "forgot") {
      const res = await Post(ApiRoutes.change, {
        password: password,
        email: email,
        code: code,
      });

      if (res.success) {
        //ShowToast('success', i18n.t('form.success'), i18n.t('auth.setPassword.completeChangePwd'));
        navigation.navigate('SignIn');
      } else {
        ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
      }

    } else {
      const res = await Post(ApiRoutes.complete, {
        password: password,
        email: email,
        code: code,
      });

      if (res.success) {
        ShowToast('success', 'Success', i18n.t('auth.setPassword.completeRegister'));
        navigation.navigate('SignIn');
      } else {
        //  ShowToast('error', 'Error', CheckBackendErrors(res.error));
      }
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <SafeAreaView style={BDiaryStylesForms.container}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={BDiaryStylesForms.inner}>

            <Logo />

            <View style={BDiaryStylesForms.formsContainer}>

              <View style={{ marginBottom: 30, }}>
                <Text style={[BDiaryStylesForms.h4, { textUnderline: 20, color: Colors.greyM, textAlign: "left" }]}>{i18n.t('auth.setPassword.infos')}</Text>
              </View>

              <View style={{}}>
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
              </View>

              <View style={{ marginTop: 20 }}>
                <View style={[BDiaryStylesForms.textInput, { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                  <TextInput
                    style={BDiaryStylesForms.textInputStyle}
                    secureTextEntry={!showpasswordconf}
                    placeholder={i18n.t('auth.setPassword.passwordConf')}
                    placeholderTextColor={Colors.greyL}
                    value={passwordconf}
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
              </View>


              <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", padding: 5, alignItems: "center" }}>

                <View style={BDiaryStylesForms.smallCircle}></View>
                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.maxChar')}</Text>

                <View style={BDiaryStylesForms.smallCircle}></View>
                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.upperChar')}</Text>

                <View style={BDiaryStylesForms.smallCircle}></View>
                <Text style={BDiaryStylesForms.passwordLabel}> {i18n.t('auth.setPassword.specialChar')}</Text>

              </View>

              <View style={{ height: 40 }}></View>
              <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={displaybutton}
                  functionProp={SetPassword}
                  label={i18n.t('auth.setPassword.button')}
                />
              </View>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
export default SetPasswordScreen;