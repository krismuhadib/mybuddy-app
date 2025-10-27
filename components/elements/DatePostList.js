import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MyFonctions from '../MyFonctions';

const DatePostList = ({ item }) => {

  return (
    <View >
      <View style={{ borderWidth: 0, paddingLeft: 10, justifyContent: 'center' }}>
        <Text style={styles.TextStyle}>{MyFonctions.formateDate(item)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  TextStyle: {
    borderWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'normal',
    fontSize: 8,
  }
});

export default DatePostList