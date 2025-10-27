import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import i18n from '../../../utils/i18n';

export default class Logo extends React.Component {
  
  render() {
    return (
    <View style={styles.containerlogo}>
      <Image source={require('../assets/images/logo_login.png')} style={{width: 290, height: 80, borderWidth:0}} />
    </View>
    );
  }
}


const styles = StyleSheet.create({
  containerlogo: {
   borderWidth:0,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 0,
    padding:5,
  },

  logoText: {
    textAlign:'center',
    borderWidth:0,
  lineHeight:25,
    fontSize: 15,
  
    color:'#000',
    padding:5,
   
    
  }

});
