import React, { useContext, SafeAreaView, useCallback, useMemo, useEffect, useState, useReducer } from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDStyles from "../../../assets/styles/styles";

import { AuthContext } from '../../../contexts/AuthContext';
import { i18n } from "../../../constants/Localization"

import { ApiRoutes, Post, setToken, getToken, removeToken } from '../../../services/api'

import { connect } from 'react-redux';

const WallScreen = () => {
  // User Redux Store Data

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  //console.log("animalData",animalData )

  //console.log("userData",userData);

  const { signOut } = useContext(AuthContext);


  
  useEffect(() => {
    let userToken;
    // Used when Reload or App comeback to Front
    const loadToken = async () => {
        try {
          userToken = await getToken('token')
        } catch (e) {
            Alert('APP Token Failed');
        }
       // authDispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
    loadToken();
}, []);


  return (
    <View style={BDStyles.container}>
    

    <View style={{ flex:1, alignContent: "center", alignItems: "center", justifyContent:"center",  }}>
       
    <Text style={BDStyles.h3}>{JSON.stringify(userData)}</Text>
    <Text style={BDStyles.h3}>{JSON.stringify(animalData)}</Text>

 <TouchableOpacity style={BDStyles.buttonWarning} onPress={signOut}>
          <Text style={BDStyles.buttonLabelWarning}>{i18n.t('profile.logOut')}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};







export default WallScreen;


