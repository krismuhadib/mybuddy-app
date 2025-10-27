import React from 'react';
import { Text,
    TouchableHighlight,
    View,
    StyleSheet,
    Platform,
    FlatList,
    AppRegistry,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    Image,
    TextInput,
    Modal,
    ScrollView} from 'react-native';


    import Colors from '../../constants/Colors';

import { i18n } from "../../constants/Localization";
import { useNavigation } from '@react-navigation/native';

var config = require('../../config.js');


const  LegendRowItem = ({ keyboardType, title, label, valueName, iconName, iconClass, handleValue }) =>  {

  const navigation = useNavigation();


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     //navigation: this.props.navigation.navigate('User'),
  //     //secureTextEntry : true,
  //     iconName : this.props.iconName,
  //     title : this.props.title,
  //    // navigation : this.props.navigation,
  //   }
  //   console.log("LegendRow icon_pin",this.state.iconName)
  // };

  
    const icones = iconName;
    
    return (
    <View  style={{ flex: 1, borderWidth:  0 }}>
      <View style={styles.rowlist}>
        <View style={styles.rowicon}>
       <View>
        <Image source={config.AnimalIcones.typeofname[icones]} style={{top : -2,height: 28, width:28 }}/>
        </View>
        </View>
        
    
        
        <View style={{ flex: 1 }}>
          <View style={[styles.rowicon, { borderWidth: 0,  }]}>
          <Text style={styles.rowtext}>{i18n.t(title)}</Text>
          </View>
        </View>
      </View>
    </View>
    )
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  
  rowlist: {
    flexDirection: 'row',
    height: 55, 
    backgroundColor: '#fff',   
    borderBottomColor: '#ccc',
    borderTopColor : '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowtext: {
    marginLeft:20,
    fontFamily : 'Roboto-Regular',
    color:Colors.hardgray,
    //fontWeight:'bold',
    fontSize: 16,
    textAlign:'left',
    //justifyContent: 'center'
  },
  rowicon: {
    marginLeft: 30
  }
});

export default LegendRowItem