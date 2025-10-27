import React, { useEffect, useState, useContext } from 'react';
import { Platform, KeyboardAvoidingView, TouchableWithoutFeedback, SafeAreaView, Keyboard, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { i18n } from "../../constants/Localization";
import BDiaryStylesForms from "../../assets/styles/forms";
import Colors from '../../constants/Colors';
import Logo from '../../components/auth/Logo';
import Header from '../../components/auth/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Post, ApiRoutes } from '../../services/api'
import { ShowToast } from '../../services/notification';
import KohanaInputText from '../../components/elements/KohanaInputText';
import { CheckNumericString } from '../../utils/helpers';
import InformationBlock from '../../components/auth/InformationBlock';
import { CheckBackendErrors } from '../../utils/helpers';
import BDButton from '../../components/elements/BDButton';


const VerifyCodeScreen = ({ route }) => {

  const navigation = useNavigation();
  const { email, from } = route.params;
  const [code, setCode] = useState('');
  const [displaybutton, setDisplayButton] = useState(false);

  useEffect(() => {
    validateForm();
  }, [displaybutton, code]);


  const validateForm = () => {

    if (code.length !== 6) {
      return setDisplayButton(false);
    }
    if (!CheckNumericString(code)) {
      return setDisplayButton(false);
    }

    return setDisplayButton(true);
  };


  const VerifyCode = async () => {

    const res = await Post(ApiRoutes.code, {
      code: code,
      email: email,
    });
    if (res.success) {
      navigation.navigate('SetPassword', {
        email: email,
        code: code,
        from: from,
      });
    } else {
      //ShowToast(CheckBackendErrors(res.error));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>

      <SafeAreaView style={BDiaryStylesForms.container}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={BDiaryStylesForms.inner}>

            <View style={{ marginTop: 30, marginBottom: 20 }}>
              <Logo />
            </View>

            <View style={BDiaryStylesForms.formsContainer} >

              <View style={{ marginBottom: 20, }}>
                <InformationBlock
                  HeaderTxt={i18n.t('auth.verifyCode.headerTxt')}
                  Icon="mail"
                  LineText={i18n.t('auth.verifyCode.lineTxt')}
                />
              </View>

              <View style={{ marginTop: 0 }}>
                <KohanaInputText
                  iconName='lock'
                  iconClass={MaterialCommunityIcons}
                  handleValue={setCode}
                  valueName={code}
                  label={i18n.t('auth.verifyCode.inputText')}
                  keyboardType='numeric'
                />
              </View>

              <View style={{ marginTop: 20, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={displaybutton}
                  functionProp={VerifyCode}
                  label={i18n.t('auth.verifyCode.button')}
                />
              </View>

              <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", marginTop: 20 }}>
                <Text style={BDiaryStylesForms.textWithoutUnderline}>{i18n.t('auth.signup.login')} </Text>
                <TouchableOpacity onPress={() => LinkMe("SignIn")}>
                  <Text style={[BDiaryStylesForms.textUnderline, { top: -2 }]}> {i18n.t('auth.login.button')}</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default VerifyCodeScreen;