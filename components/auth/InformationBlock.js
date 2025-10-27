import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons';

const InformationBlock = ({ HeaderTxt, Icon, LineText }) => {

  return (
    <View>

  
    <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center" }}>
      <View style={{ backgroundColor:  Colors.background, position: "absolute", zIndex: 1, width: 50, height: 50, top: -35, borderWidth: 4, borderColor: Colors.greyM, borderRadius: 25, alignItems: "center", alignContent: "center", justifyContent: "center" }}>
        <Entypo name={Icon} size={24} color={Colors.greyH} />
      </View>
      <View style={{ width: "100%",
      borderWidth: 4, borderColor: Colors.greyM, borderRadius:8, position: "relative", height: 250, backgroundColor: Colors.background , alignContent: "center", alignItems: "center", justifyContent: "center" }}>
        <View>
          <Text style={styles.text}>{HeaderTxt} </Text>
        </View>
        <View style={{ top: 0, width: "80%", marginLeft: "10%", marginRight: "10%", borderWidth: 1, height: 1, borderColor: Colors.greyL }}></View>
        <View>
          <Text style={styles.subtitle}>{LineText} </Text>
        </View>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 300, backgroundColor: Colors.bacredkground },
  text: { padding: 20, fontSize: 25,  fontFamily: 'Poppins-Medium', textAlign: 'center', color: Colors.greyM },
  subtitle: { padding: 20, lineHeight:20,  fontFamily: 'Poppins-Medium', fontSize: 14, textAlign: 'left', color: Colors.greyM, },
});

export default InformationBlock