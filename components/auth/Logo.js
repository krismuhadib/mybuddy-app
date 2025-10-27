import React, { useEffect, useState, useContext } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';


const Logo = () => {

	return (
    <View style={styles.container}>
		  <Image source={require('../../assets/images/logo_login.png')} style={{ width: 300, height: 89, borderWidth: 0}} />
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
        marginTop: Platform.OS === 'ios' ? 50 : 50, // 👈 iOS = 0, Android = 10
		flexDirection:"column",
		alignItems: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		paddingTop: 0,
		padding: 0,
		marginBottom: 0 
	},
});

export default Logo;