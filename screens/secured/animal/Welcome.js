import React, { useContext, SafeAreaView, useCallback, useMemo, useEffect, useState, useReducer } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import Logo from '../../../components/auth/Logo';
import WelcomeButton from '../../../components/WelcomeButton';
import myBuddyStyles from "../../../assets/styles/styles";
import { ZoomIn } from 'react-native-reanimated';

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
var logo_big = require('../../../assets/images/logo_login.png');


const WelcomeScreen = ({ route }) => {

  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const { from } = route ? route.params : "";

  console.log("Modal WelcomeScreen");

  return (
    <View style={BDiaryStyles.container}>

      <ScrollView>

        <View style={BDiaryStyles.formsContainer} >

          <View style={{ marginTop: 50 }}>
            <Image source={logo_big} style={{
              height: 70,
              width: 'auto', resizeMode: "contain", borderWidth: 0
            }} />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={[BDiaryStyles.welcome, { textAlign: "center", lineHeight: 22, }]}>{i18n.t('welcome.welcomeText')}</Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={[BDiaryStyles.welcome, { textAlign: "center", lineHeight: 22, }]}>{i18n.t('welcome.WelcomeAnimalMiss')}</Text>
          </View>


          <View style={{ marginTop: 10 }}>

            {/* Have Animal */}
            
            {/* {(animalData) &&
              <WelcomeButton
                text={i18n.t('welcome.gotAnimal')}
                onPress={() => navigation.navigate('UserSpecies', {
                  from: "User",
                  specify: "NoAdoption",
                })}
                bgColor={Colors.pinkBuddy}
                txtColor={Colors.white}
                bdWidth={0}
              />
            } */}
            
             {/* No animalData First connect */}
            {(!animalData || animalData === null) &&
              <WelcomeButton
                text={i18n.t('welcome.gotAnimal')}
                onPress={() => navigation.navigate('ModalSpecies', {
                  from: "profile",
                  specify: "NoAdoption",
                })}
                bgColor={Colors.pinkBuddy}
                txtColor={Colors.white}
                bdWidth={0}
              />
            }
            {(animalData && from === undefined) &&
              <WelcomeButton
                text={i18n.t('welcome.gotAnimal')}
                onPress={() => navigation.navigate('UserSpecies', {
                  from: "User",
                  specify: "NoAdoption",
                })}
                bgColor={Colors.pinkBuddy}
                txtColor={Colors.white}
                bdWidth={0}
              />
            }
            {(animalData && from === 'User') &&
              <WelcomeButton
                text={i18n.t('welcome.gotAnimal')}
                onPress={() => navigation.navigate('UserSpecies', {
                  from: "User",
                  specify: "NoAdoption",
                })}
                bgColor={Colors.pinkBuddy}
                txtColor={Colors.white}
                bdWidth={0}
              />
            }
            {(animalData && from === 'UserNewprofile') &&
              <WelcomeButton
                text={i18n.t('welcome.gotAnimal')}
                onPress={() => navigation.navigate('UserSpecies', {
                  from: "User",
                  specify: "NoAdoption",
                })}
                bgColor={Colors.pinkBuddy}
                txtColor={Colors.white}
                bdWidth={0}
              />
            }






            {/* Adopt Animal */}

            {(!animalData || animalData === null) &&
              <WelcomeButton
                text={i18n.t('welcome.noGotAnimal')}
                onPress={() => navigation.navigate('ModalSpecies', {
                  from: "profile",
                  specify: "Adoption"
                })}
                bgColor={Colors.white}
                txtColor={Colors.greyM}
                bdWidth={1}
              />
            }
            {(animalData && from !== 'UserNewprofile') &&
              <WelcomeButton
                text={i18n.t('welcome.noGotAnimal')}
                onPress={() => navigation.navigate('UserSpecies', {
                  from: "User",
                  specify: "Adoption"
                })}
                bgColor={Colors.white}
                txtColor={Colors.greyM}
                bdWidth={1}
                
              />
            }
            {(animalData && from === 'UserNewprofile') &&
              <WelcomeButton
                text={i18n.t('welcome.noGotAnimal')}
                onPress={() => navigation.navigate('UserSpecies', {
                  from: "User",
                  specify: "Adoption"
                })}
                bgColor={Colors.white}
                txtColor={Colors.greyM}
                bdWidth={1}
              />
            }
            
            {/* Society / Professionals */}

            {/* First Connect */}
            {(animalData === null || animalData === undefined) &&
              <WelcomeButton
                text={i18n.t('welcome.professionalAnimal')}
                onPress={() => navigation.navigate('ModalAnimalProfile', {
                  from: "NewUser",
                  specify: "Pros"
                })}
                bgColor={Colors.greenL}
                txtColor={Colors.white}
                bdWidth={0}
              />
            }

            {(animalData) &&
              <WelcomeButton
                text={i18n.t('welcome.professionalAnimal')}
                onPress={() => navigation.navigate('UserAnimalProfile', {
                  from: "User",
                  specify: "Pros"
                })}
                bgColor={Colors.greenL}
                txtColor={Colors.white}
                bdWidth={0}
              />
            }


            {(animalData && animalData.breed !== null && from !== "UserNewprofile") &&

              <TouchableOpacity
                style={{ marginTop: 15 }}

                onPress={() => navigation.popToTop()}>
                <View style={[styles.buttonCloseModal]}>
                  <Text style={[myBuddyStyles.legalBold, { fontWeight: 'normal', color: Colors.greyH }]}>{i18n.t('fullScreenVideo.close')}</Text>
                </View>

              </TouchableOpacity>
            }
          </View>

        </View>
        <View style={{ height: 50 }}></View>
      </ScrollView>
    </View>
  );
};




const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  modal: {
    width: ScreenWidth,
    // top: ScreenHeight / 6,
    backgroundColor: 'white',
    height: ScreenHeight,
    borderRadius: 8,

  },

  buttonCloseModal: {
    margin: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: Colors.greyUL,
    marginLeft: 20,
    marginRight: 20,
  },

  line_spacer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,

  },


});

export default WelcomeScreen;