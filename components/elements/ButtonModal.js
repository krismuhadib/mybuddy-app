import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/styles"
import Colors from '../../constants/Colors';
import { Ionicons, MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const ButtonModal = ({ display, onPress, label, icon, library, iconColor }) => {

  //const iconcolor = Colors.greyM;
  const Colortext = Colors.greyH;

  return (

    <View style={{ display: display, height: 40 }}>
      <TouchableOpacity style={BDiaryStyles.buttomModalSetting} onPress={() => onPress()}>
        <View>

          {(library === "Ionicons") &&
            <Ionicons name={icon} size={25} color={iconColor} />
          }

          {(library === "MaterialIcons") &&
            <MaterialIcons name={icon} size={25} color={iconColor} />
          }
          {(library === "MaterialCommunityIcons") &&
            <MaterialCommunityIcons name={icon} size={25} color={iconColor} />
          }
          {(library === "AntDesign") &&
            <AntDesign name={icon} size={25} color={iconColor} />
          }
          
        </View>
        <View>
          <Text style={[BDiaryStyles.buttonModalText,{color:Colortext}] }>{label}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{alignItems: 'flex-end'}}>
            <AntDesign name="right" size={20} color={Colors.greyM} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonModal