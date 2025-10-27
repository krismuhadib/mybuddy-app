import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


// Screen Sizes
const ScreenWidth = Math.round(Dimensions.get('window').width);

const  Header = ({ link, titleheader, icone, side }) =>  {

  const navigation = useNavigation();
  const bgcolor = "transparent";
  const iconColor = Colors.greyH;

  const goBack = () =>{
    return navigation.goBack();
  };

  const LinkMe = (screen) =>{
    return navigation.goBack();
  };


  const iconeDisplayLeft = () => {
    if (side === 'left') {
      return (
        <Entypo style={{ left: 15,}} name={icone} size={20} color={iconColor} />
      )
    };
    return (
      <View style={{ width: 20,}}></View>
    )
  };

  const iconeDisplayRight = () => {
    if (side === 'right') {
      return (
        <Entypo style={{ right: 15, }} name={icone} size={20} color={iconColor}/>
      )
    } else {
      return (
        <View style={{ width: 20,}}></View>
       )
    } 
  };





  return (

    <View style={{ flexDirection: "row", top:0, width: ScreenWidth, backgroundColor: bgcolor, justifyContent: "space-between", alignItems: "center", alignContent: "space-between"}}>
      <TouchableOpacity style={{ backgroundColor: bgcolor, alignContent: "flex-start", alignItems: "flex-start" }}
      onPress={()=>goBack()}>
        {iconeDisplayLeft()}
      </TouchableOpacity>
      
      <View style={{ backgroundColor: bgcolor }}>
        <Text style={styles.title}>{titleheader}</Text>
      </View>

      <View style={{  minWidth:30, backgroundColor: bgcolor, alignContent: "flex-end", alignItems: "flex-end" }}>
        {iconeDisplayRight()}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  title: {
    
    textAlign: "center",
    color: Colors.greyH,
    fontWeight: "500",
    fontSize: 18,
    //textTransform:"capitalize",
  },
});

export default Header