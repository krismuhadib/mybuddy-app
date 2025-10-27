//////////////////////////////////////////////
// MyBuddy
// Page : StylesAuth.js
// csmgaussin
// OCT 2020
//
//
//////////////////////////////////////////////


import {
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Image,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
  Dimensions,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
  
import Colors from '../../components/Colors'; 
// Define Colors Apps

const red= "#ef5050";
const white = "#FFFFFF";

// Export css

export default {
    
  title: {
    borderWidth: 2,
    color: "#CCC"
  },

  container: {
    flex: 1,
    backgroundColor: white
  },

  inner: {
    paddingTop: 40,
 
    
    ...Platform.select({
      ios: {
        marginTop: 0,
        paddingBottom: 60,
        justifyContent: "flex-end",
      },
      android: {
        paddingTop: -10,
        justifyContent: "flex-end",
      },
    }),
  
  },

  inner_big: {
   marginTop: 0,
    borderWidth:0,
    flex: 1,
    
    ...Platform.select({
      ios: {
        marginTop: 70,
        paddingBottom: 60,
        justifyContent: "flex-end",
      },
      android: {
        
        paddingTop: 10,
        justifyContent: "flex-end",
      },
    }),
  
  },


    separator: {
      height: 4,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    icon: {
        width: 32,
        height: 32,
    },
    
    footer:{
        justifyContent: 'center',
        marginTop: 10,
        
    },
    
    
    textRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    error: {
        opacity: 1,
       
        borderColor: red,
        borderBottomWidth: 2,
    },
    noerror: {
        width: '100%',
        height: 40,
        fontSize: 15,
       
        borderColor: "#cfcfcf",
        borderBottomWidth: 2,
    },

    buttonNav: {
      marginTop: 0,
      alignItems: 'center',
      //backgroundColor: 'white',
      padding: 5
    },
    
    buttonNavText: { 
      fontSize: 15,
      fontWeight:'bold',
      color:Colors.greyL,
      textTransform: 'none',
    },
    
    buttonSubmit: {
      width: '100%',
      borderRadius: 3,
      marginTop: 30,
      alignItems: 'center',
      backgroundColor: Colors.greyH,
      padding: 10
    },
    
    buttonSubmitText: { 
      fontSize:14,
      fontWeight:'bold',
      color:'white',
    textTransform: "capitalize"
    },
    noerrorDigit: {
      width: 40,
      height: 40,
      borderColor: "red",
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      padding:12,
      //fontFamily : 'Roboto-Bold',
      fontSize: 15,
      fontWeight: 'bold',
     //marginBottom: 15,
      color:"red",
      //marginBottom: 16,
  
    },


  }
  