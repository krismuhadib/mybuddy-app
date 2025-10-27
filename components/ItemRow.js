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
    Icone,
    ScrollView} from 'react-native';
//import { MaterialCommunityIcons as Icon } from'@expo/vector-icons';
import Icon from 'react-native-vector-icons/fontawesome';
import { ThemeProvider } from 'react-native-elements';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';




export default class ItemRow extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            //navigation: this.props.navigation.navigate('User'),
            //secureTextEntry : true,
            iconName : this.props.iconName,
            title : this.props.title,
            itemNavigate : this.props.itemNavigate,
            navigation : this.props.navigation,
            press : this.props.press,
            userLname : this.props.userLname,
            userFname : this.props.userFname,
            userUsername : this.props.userUsername,
            genre : this.props.genre,
        }
        //console.log('IREMROWWWWIREMROWWWWIREMROWWWWIREMROWWWWIREMROWWWWIREMROWWWWIREMROWWWWIREMROWWWWIREMROWWWW',this.props.userFname)
    }

   
    

    render (){
        return (
        <View>
        <TouchableOpacity style={styles.buttontouch} onPress={() => this.props.navigation.navigate(this.props.itemNavigate,{
          userToken: this.props.userToken,
          userLname: this.props.userLname,
          userUsername: this.props.userUsername,
          userFname: this.props.userFname,
          userEmail: this.props.userEmail,
          genre: this.props.genre,
          navigation: this.props.navigation
        })}>
                  <View style={styles.buttontouchicon}>
                    <Icon name={this.state.iconName} size={25} color="grey" />
                  </View>
                  <View style={styles.buttontouchcontent}>
                    <Text style={styles.buttontouchtext}>{this.state.title}</Text>
                  </View>
                
                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 20, alignItems: 'flex-end', }]}>
                      <Icon name="chevron-right" size={20} color="grey" />
                    </View>
                  </View>
                </TouchableOpacity>
                </View>
            
            );
        }






};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4',
  
    },
    contentContainer: {
      //paddingTop: 30,
      //position: 'relative',
    },
  
    textRow: {
      flexDirection: 'row',
      justifyContent: 'center',
  
    },
  
    image: {
      marginTop:scaleVertical(15),
      //marginBottom: 10,
      marginBottom:scaleVertical(15),
      //resizeMode:'cover',
      //resizeMode:'contain'
    },
  
  
    buttonSubmit: {
      alignSelf: 'center',
      width: 200,
      //marginTop: 30,
      alignItems: 'center',
      backgroundColor: 'green',
      padding: 10
    },
    buttonSubmitText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'white',
      textTransform: 'uppercase',
    },
  
  
    buttonRed: {
      width: 200,
      marginTop: 0,
      alignItems: 'center',
      backgroundColor: 'red',
      padding: 10
    },
  
    buttonNavText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'red',
      textTransform: 'none',
    },
  
  
  
    developmentModeText: {
      //marginBottom: 20,
      color: 'rgba(0,0,0,0.4)',
      fontSize: 14,
      //lineHeight: 19,
      textAlign: 'center',
    },
  
  
    avatarContainer: {
      //position: 'relative',
      backgroundColor: '#fff',
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
  
      //marginTop: 10,
      //marginBottom: 20,
      borderBottomColor: '#ccc',
      opacity: 0.9,
      borderBottomWidth: 1,
    },
    avatarimg: {
      //position: 'relative',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  
      marginTop: 70,
  
      // borderBottomColor: '#000',
      // opacity: 0.9,
      // borderBottomWidth: 1,
    },
  
  
  
    avatartextpos: {
      paddingTop: 40,
      alignSelf: 'center',
  
      paddingBottom: 30,
  
    },
    avatartext: {
  
      textTransform: 'capitalize',
  
      //position: 'absolute',
  
      alignSelf: 'center',
    },
    titretextpos: {
      height: 30,
      paddingLeft: 20,
      //paddingBottom:20,
  
  
    },
    titretext: {
      fontFamily: 'Roboto-Regular',
      fontWeight: '900',
      fontSize: 15,
    },
  
  
  
    buttontouch: {
      flex:1,
      flexDirection: 'row',
      height: 70,
      backgroundColor: '#fff',
      borderTopColor: '#ccc',
      opacity: 0.9,
      borderTopWidth: 1,
      alignItems: 'center',
    },
  
    buttontouchcontent: {
      //alignSelf:'flex-start',
  
    },
  
    buttontouchicon: {
      marginLeft: 20,
    },
  
    buttontouchtext: {
      marginLeft: 20,
      fontFamily: 'Roboto-Regular',
  
      fontSize: 15,
      //textAlign:'left',
      //justifyContent: 'center',
    },
  
  
  
  
    welcomeImage: {
      width: 100,
      height: 80,
      resizeMode: 'contain',
      marginTop: 3,
      marginLeft: -10,
    },
    getStartedContainer: {
      alignItems: 'center',
      marginHorizontal: 50,
    },
    homeScreenFilename: {
      marginVertical: 7,
    },
    codeHighlightText: {
      color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: 3,
      paddingHorizontal: 4,
    },
    getStartedText: {
      fontSize: 17,
      color: 'rgba(96,100,109, 1)',
      lineHeight: 24,
      textAlign: 'center',
    },
    tabBarInfoContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 20,
        },
      }),
      alignItems: 'center',
      backgroundColor: '#fbfbfb',
      paddingVertical: 20,
    },
    tabBarInfoText: {
      fontSize: 17,
      color: 'rgba(96,100,109, 1)',
      textAlign: 'center',
    },
    navigationFilename: {
      marginTop: 5,
    },
    helpContainer: {
      marginTop: 15,
      alignItems: 'center',
    },
    helpLink: {
      paddingVertical: 15,
    },
    helpLinkText: {
      fontSize: 14,
      color: '#2e78b7',
    },
  });
  