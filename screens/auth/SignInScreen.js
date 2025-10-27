import React, { useEffect, useState, useContext } from 'react';
import { Platform, KeyboardAvoidingView, TouchableWithoutFeedback, SafeAreaView, Keyboard, ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { i18n } from "../../constants/Localization";
import BDiaryStylesForms from "../../assets/styles/forms";
import Colors from '../../constants/Colors';
import Logo from '../../components/auth/Logo';
import GetText from '../../components/auth/GetText';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { ValidateEmail } from '../../utils/helpers';
import KohanaInputText from '../../components/elements/KohanaInputText';
import BDButton from '../../components/elements/BDButton';


const SignInScreen = () => {
  // Do no modify the line !
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displaybutton, setDisplayButton] = useState(false);

  // Function to toggle the password visibility state 
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const LinkMe = (screen) => {
    return navigation.push(screen);
  };


  useEffect(() => {
    validateForm();
  }, [email, password]);


  const validateForm = () => {

    if (!email.length || !password.length) {
      return setDisplayButton(false);
    }
    if (!ValidateEmail(email)) {
      return setDisplayButton(false);
    }
    // Validate password ?
    if (password && password.length === 0) {
      return setDisplayButton(false);
    }

    return setDisplayButton(true);

  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <SafeAreaView style={[BDiaryStylesForms.container,]}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={BDiaryStylesForms.inner}>

              <Logo />
        
              <GetText />
         
            <View style={BDiaryStylesForms.formsContainer} >

              <View style={{  marginTop: 20, marginBottom: 20 }}>
                <KohanaInputText
                  iconName='alternate-email'
                  iconClass={MaterialIcons}
                  handleValue={setEmail}
                  valueName={email}
                  label={i18n.t('auth.signup.email')}
                  keyboardType='email-address'
                />
              </View>


              <View style={[BDiaryStylesForms.textInput, { flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                <TextInput
                  style={BDiaryStylesForms.textInputStyle}
                  autoComplete='off'
                  placeholderTextColor={Colors.greyL}
                  secureTextEntry={!showPassword}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color={Colors.greyL}
                  style={{ top: 7, marginRight: 20 }}
                  onPress={toggleShowPassword}
                />
              </View>

              <View style={{ marginTop: 10, alignContent: "flex-end", alignItems: "flex-end" }}>

              <TouchableOpacity style={{ }}
                onPress={() => LinkMe("ForgotPassword")}>
                <Text style={[BDiaryStylesForms.textUnderline, { marginRight: 10 }]}>{i18n.t('auth.login.forgot.title')}</Text>
              </TouchableOpacity>
              </View>

            

              <View style={{ marginTop: 20 }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={displaybutton}
                  functionProp={() => signIn({ email, password })}
                  label={i18n.t('auth.login.submit')}
                />
              </View>

              <View style={{ marginTop: 10, flexDirection: "row", alignContent: "center", justifyContent: "center", justifyContent: "center" }}>
                <Text style={BDiaryStylesForms.textWithoutUnderline}>{i18n.t('auth.login.noAccount')}</Text>
                <TouchableOpacity onPress={() => LinkMe("SignUp")}>
                  <Text style={[BDiaryStylesForms.textUnderline]}> {i18n.t('auth.signup.title')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          </View>

        </TouchableWithoutFeedback>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;