import React, { useMemo, useEffect, useState, useContext } from 'react';
import {
  SafeAreaProvider, ScrollView, Pressable, StyleSheet, Platform, KeyboardAvoidingView, TouchableWithoutFeedback,
  SafeAreaView, Keyboard, View, Text, Modal, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { i18n } from "../../constants/Localization";
import BDiaryStylesForms from "../../assets/styles/forms";
import BDiaryStyles from "../../assets/styles/forms";
import Colors from '../../constants/Colors';
import Logo from '../../components/auth/Logo';
import Header from '../../components/auth/Header';
import { Post, ApiRoutes } from '../../services/api'
import { ShowToast } from '../../services/notification';
import { MaterialIcons } from '@expo/vector-icons';
import { ValidateEmail } from '../../utils/helpers';
import KohanaInputText from '../../components/elements/KohanaInputText';
import { CheckBirthady, CheckBackendErrors } from '../../utils/helpers';
import BDButton from '../../components/elements/BDButton';
import DateInput from '../../components/elements/DateInput';
import ModalWarning from '../secured/modals/ModalWarning';
import SwitchComponent from '../../components/elements/SwitchComponent';
import config from '../../config';



const SignUpScreen = () => {

  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailconf, setEmailConf] = useState('');
  const [terms, setTerms] = useState(false);
  const [displaybutton, setDisplayButton] = useState(false);
  const [jours, setJours] = useState("");
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [birthday, setBirthday] = useState("");
  const [modalWarning, setModalWarning] = useState(false);
  const [modalTermsVisible, setModalTermsVisible] = useState(false);
  const [legalText, setLegaltext] = useState([]);
  const [isLegal, setIsLegal] = useState(false);
  const [displayTermsbutton, setDisplayTermsButton] = useState(false);

  const GetLegalsTxt = () => {
    fetch(config.uri + 'users/gettext', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        language: i18n.locale,
        type: "legals",
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          setLegaltext(res);
        }
        else {
          console.log("Prb Legals");
        }
      });

  };


  const LinkMe = (screen) => {
    return navigation.goBack();
  };

  useEffect(() => {
    if (isLegal === true) {
      setDisplayTermsButton(true)
      setTerms(true);
    } else {
      setDisplayTermsButton(false)
    }
  }, [isLegal, terms]);

  useEffect(() => {
    GetLegalsTxt();
    validateForm();
  }, [displaybutton, terms, firstName, lastName, email, emailconf, mois, jours, birthday]);


  const validateForm = () => {

    if (!firstName.length || !lastName.length) {
      return setDisplayButton(false);
    }
    if (!ValidateEmail(email)) {
      return setDisplayButton(false);
    }
    if (!ValidateEmail(emailconf)) {
      return setDisplayButton(false);
    }
    if (email !== emailconf) {
      return setDisplayButton(false);
    }
    if (!terms) {
      return setDisplayButton(false);
    }
    if (!birthday) {
      setBirthday("")
      return setDisplayButton(false);

    }
    return setDisplayButton(true);

  };

  const isTerms = () => {
    goToTerms();
  };

  const validateTerms = () => {
    if (terms) {
      setModalTermsVisible(false);
    }
  };

  const SignUp = async () => {

    if (CheckBirthady(birthday) === false) {
      console.log("error birthday");
      setModalWarning(true);

    } else {
      if (terms === true) {
        const res = await Post(ApiRoutes.signup, {
          email: email.toLowerCase(),
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          terms: 1,
          ispremium: true,
          lang: i18n.locale, // No conform
          //birthday: new Date(birthday).toLocaleDateString('en-CA'),
        });
        if (res.success) {
          navigation.navigate('VerifyCode', {
            email: email.toLowerCase(),
            from: 'register',
          });
        } else {
          //ShowToast(CheckBackendErrors(res.error));
        }
      }
    }


  };

  const goToTerms = () => {
    setModalTermsVisible(true);
  };


  const handleDateChange = async (date) => {
    console.log('Date sélectionnée :', date);
    setBirthday(date);
    // const res = await Post(ApiRoutes.animalEdit, {
    //   id: animalData._id,
    //   birthday: new Date(date).toLocaleDateString('en-CA'),
    // });
    // if (res.success) {
    //   console.log("Date res", res)
    //   // ShowToast('success', i18n.t('form.success'), i18n.t('form.done'));
    //   storeDispatch(SaveAnimal(res.value));

    // } else {
    //   ShowToast('error', i18n.t('form.error'), CheckBackendErrors(res.error));
    // }


  };

  const closeModal = () => {
    setModalWarning(false);
    navigation.navigate('SignIn');
  };

  return (

     <SafeAreaView
      style={[
        BDiaryStylesForms.container,
        { flex: 1, backgroundColor: Colors.white },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              paddingBottom: 200, // 👈 permet de scroller jusqu’en bas
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[BDiaryStylesForms.inner, { flexGrow: 1 }]}>
              <Logo />
              
              <View style={BDiaryStylesForms.formsContainer}>

              <View style={{ marginBottom: 20, padding: 0. }}>
                <Text style={[BDiaryStylesForms.h4, { textUnderline: 30, color: Colors.greyM, textAlign: "center" }]}>{i18n.t('auth.signup.timeToComplete')}</Text>
              </View>

              <View style={{ marginBottom: 10 }}>
                <KohanaInputText
                  iconName='person'
                  iconClass={MaterialIcons}
                  handleValue={setFirstName}
                  valueName={firstName}
                  label={i18n.t('auth.signup.firstName')}
                  keyboardType='default'
                />
              </View>

              <View style={{ marginBottom: 10 }}>
                <KohanaInputText
                  iconName='person'
                  iconClass={MaterialIcons}
                  handleValue={setLastName}
                  valueName={lastName}
                  label={i18n.t('auth.signup.lastName')}
                  keyboardType='default'
                />
              </View>

              <View style={{ marginBottom: 10 }}>
                <KohanaInputText
                  iconName='alternate-email'
                  iconClass={MaterialIcons}
                  handleValue={setEmail}
                  valueName={email}
                  label={i18n.t('auth.signup.email')}
                  keyboardType='default'
                />
              </View>

              <View style={{ marginBottom: 10 }}>
                <KohanaInputText
                  iconName='alternate-email'
                  iconClass={MaterialIcons}
                  handleValue={setEmailConf}
                  valueName={emailconf}
                  label={i18n.t('auth.signup.emailConf')}
                  keyboardType='default'
                />
              </View>




              <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "flex-start", alignItems: "center" }}>

                <View style={{ top: 0, paddingLeft: 5 }}>
                  <View style={{ flexDirection: "column", alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable
                      style={[BDiaryStylesForms.checkboxBase, { position: "relative", zIndex: 1 }, terms && BDiaryStylesForms.checkboxChecked, { position: "absolute", zIndex: 2 }]}
                      onPress={() => isTerms()}>
                      {terms}
                    </Pressable>
                    <View style={BDiaryStylesForms.checkboxBase}></View>
                  </View>
                </View>

                <TouchableOpacity style={{ top: 10, width: "90%" }}
                  onPress={() => setModalTermsVisible(true)}
                >
                  <Text style={[BDiaryStylesForms.textWithoutUnderline, { paddingLeft: 10, }]}>{i18n.t('auth.signup.terms')}. </Text>
                  <Text style={[BDiaryStylesForms.textUnderline, { paddingLeft: 10 }]}>{i18n.t('auth.signup.learn')}</Text>
                </TouchableOpacity>

              </View>

              <View style={{ marginTop: 40, }}>
                <View style={{ flexDirection: "row", }}>
                  <Text style={[BDiaryStyles.h6, { color: Colors.greyM, paddingBottom: 5, paddingLeft: 0, fontStyle: "italic", }]}>{i18n.t('animalProfile.birthday')}</Text>
                  <Text style={[BDiaryStyles.h6, { fontSize: 10, color: Colors.greyM, paddingBottom: 5, paddingLeft: 0, fontStyle: "italic", }]}> (JJ/MM/AAAA)</Text>

                </View>
                <View style={[BDiaryStylesForms.textInput, { textAlign: "left", width: "50%", flexDirection: "row", justifyContent: "space-between", alignContent: "space-between" }]}>
                  <DateInput onDateChange={handleDateChange} />
                </View>
              </View>

              <View
                  style={{
                    marginTop: 30,
                    alignItems: 'center',
                  }}
                ></View>

              <View style={{ marginTop: 30, alignContent: "center", alignItems: "center" }}>
                <BDButton
                  bgcolor={Colors.greenBuddy}
                  color={Colors.white}
                  display={displaybutton}
                  functionProp={SignUp}
                  label={i18n.t('auth.signup.button')}
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

     

        <ModalWarning
          isTrigger={0}
          postnumerselected={0}
          //getAllPost={getAllPost}
          animationType="fade"
          // item={postItem}
          navigateToModal="Birthday"
          modalVisible={modalWarning}
          navigation={navigation}
          closeModal={closeModal}
        />





   



      <Modal
        animationType="slide"
        transparent={true}
        visible={modalTermsVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalTermsVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              <View style={{ padding: 10, paddingTop: 20, paddingBottom: 20, borderWidth: 0, }}>
                {/* <View>
            <Text style={BDiaryStyles.legalBold}>{legalText.title}</Text>
          </View> */}
                <View style={{ paddingTop: 0 }}>
                  <Text style={BDiaryStyles.legalBold}>{legalText.subtitle}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_1}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_1}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_2}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_2}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_3}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_3}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_4}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_4}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_5}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_5}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_6}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_6}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_7}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_7}</Text>
                </View>
                <View style={{ paddingTop: 30 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.chaptitle_8}</Text>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text style={BDiaryStyles.legalRegular}>{legalText.body_8}</Text>
                </View>
              </View>

              <View style={{ paddingTop: 40 }}>
                <View style={{ flexDirection: "column", padding: 10, alignContent: "center", justifyContent: "space-between" }}>
                  <Text style={BDiaryStyles.legalRegular}>{i18n.t('Page.Accept_Legals')} :</Text>
                  <View style={{ paddingRight: 20, paddingTop: 0, alignContent: "flex-end", alignItems: "flex-end", padding: 0 }}>
                    <SwitchComponent
                      label=" "
                      onValueChange={() => setIsLegal(!isLegal)}
                      value={isLegal}
                    />


                  </View>
                  <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>

                    <View style={{ width: 200, marginTop:20}}>
                      <BDButton
                        bgcolor={Colors.greenBuddy}
                        color={Colors.white}
                        display={displayTermsbutton}
                        functionProp={validateTerms}
                        label={i18n.t('animalProfile.submit')}
                      />
                    </View>

                  </View>

                </View>
              </View>

              <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", marginTop: 20 }}>
                <Text style={BDiaryStylesForms.textWithoutUnderline}>{i18n.t('auth.signup.login')} </Text>
                <TouchableOpacity onPress={() => LinkMe("SignIn")}>
                  <Text style={[BDiaryStylesForms.textUnderline, { top: -2 }]}> {i18n.t('auth.login.button')}</Text>
                </TouchableOpacity>
              </View>
          
 </ScrollView>
          </View>
        </View>
      </Modal>


          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  radioGroupContainer: {
    flexDirection: "row",
    paddingLeft: 20,
    padding: 5,
    alignContent: "flex-start",
    alignItems: "center",
    justifyContent: "flex-start"
  },

});

export default SignUpScreen;