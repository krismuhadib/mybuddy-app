import React, { Component, Fragment } from 'react';
import { StyleSheet,View } from 'react-native';
import Colors from '../../constants/Colors';
import { Kohana } from 'react-native-textinput-effects';


const  KohanaInputText = ({ keyboardType, label, valueName, iconName, iconClass, handleValue }) =>  {

  const kohana = (
    <Kohana
    style={styles.KohanaTextInput}
    label={label}
    borderHeight={3}
    iconClass={iconClass}
    iconName={iconName}
    iconSize={18}
    iconColor={Colors.greyM}
    labelHeight={15}
    inputHeight={15}
    inputPadding={15}
    labelStyle={styles.KohanaLabelStyle}
    inputStyle={styles.KohanaInputStyle}
    labelContainerStyle={styles.KohanaLabelContainerStyle}
    iconContainerStyle={styles.KohanaIconContainerStyle}
    useNativeDriver
    onChangeText={handleValue}
    autoCapitalize='none'
    value={valueName}
    keyboardType={keyboardType}
    autoComplete='off'
    />
  );

  return (
  <View style={{ height:40}}>
    {kohana}
  </View>
  );
};

const styles = StyleSheet.create({
	KohanaTextInput: {
    borderRadius:25,
    overflow:'hidden',
    color: Colors.black,
    paddingLeft:20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
  },

  KohanaLabelStyle: {
    fontSize:15,
    top:-2,
    fontWeight:"400",
    color: Colors.greyL, 
    marginLeft:20
  },
  KohanaInputStyle: {
    fontSize:15,
    top:0,
    fontWeight:"400",
    color: Colors.greyH,
    borderWidth: 0,
    marginLeft:-5 
  },

  KohanaLabelContainerStyle: {
    fontSize:10,
    color: '#fff',
    marginTop: -2,
    marginLeft:-10
  },

  KohanaIconContainerStyle: {
    padding:0,
    marginLeft: -25,
    paddingLeft:20
  },
});





export default KohanaInputText