import React, { useContext, SafeAreaView, useCallback, useMemo, useEffect, useState, useReducer } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import Logo from '../../../components/auth/Logo';

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const UserActivityScreen = () => {

  // User Redux Store Data
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  useEffect(() => {

  }, []);


  return (
    <View style={BDiaryStyles.container}>

      <ScrollView>

        <View style={[BDiaryStyles.formsContainer, { flex: 1, alignContent: "center", alignItems: "center", justifyContent: "flex-start" }]} >

          <View style={{ height: 100 }}></View>

          <Logo />

          <View style={{ height: 30 }}></View>

          <Text style={[BDiaryStyles.h4, { textAlign: "center", lineHeight: 22, }]}>{i18n.t('Modal.Welcome_Text')}</Text>
          <View style={{ height: 10 }}></View>

          <Text style={[BDiaryStyles.h4, { textAlign: "center", lineHeight: 22, }]}>{i18n.t('Modal.Welcome_AnimalMiss')}</Text>


          <View style={{ height: 50 }}></View>

          <TouchableOpacity onPress={() => navigation.navigate('Species', {
            from: "profile",
          })}>
          <View style={[styles.colorContainer, { backgroundColor: Colors.pastredH }]}>

              <View style={{ backgroundColor: Colors.pastredH, alignContent: "center", justifyContent: "center" }}>
                <Text style={[BDiaryStyles.h4, { fontFamily: 'Poppins-SemiBold', lineHeight: 22, padding: 5, textAlign: "center", fontStyle: "italic", color: Colors.white }]}>{i18n.t('userStatus.Got_Animal')}</Text>
              </View>

            </View>
          </TouchableOpacity>

          <View style={{ height: 30, }}></View>

          <TouchableOpacity onPress={() => navigation.navigate('NoPetProfile')}>
            <View style={[styles.colorContainer, { backgroundColor: Colors.pastredL }]}>
              <View style={{ backgroundColor: Colors.pastredL, alignContent: "center", justifyContent: "center" }}>
                <Text style={[BDiaryStyles.h4, { fontFamily: 'Poppins-SemiBold', lineHeight: 22, padding: 5, textAlign: "center", fontStyle: "italic", color: Colors.white }]}>{i18n.t('userStatus.NoGot_Animal')}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ height: 30, }}></View>


          <TouchableOpacity onPress={() => navigation.navigate('NoPetProfile')}>
            <View style={[styles.colorContainer, { backgroundColor: Colors.pastredUL }]}>
              <View style={{ backgroundColor: Colors.pastredUL, alignContent: "center", justifyContent: "center" }}>
                <Text style={[BDiaryStyles.h4, { fontFamily: 'Poppins-SemiBold', lineHeight: 22, padding: 5, textAlign: "center", fontStyle: "italic", color: Colors.white }]}>{i18n.t('userStatus.professionalAnimal')}</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({

  colorContainer: {
    width: ScreenWidth - 40,
    padding: 5,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
    height: 100,
    backgroundColor: Colors.pastredH,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68
  },

});



export default UserActivityScreen;


