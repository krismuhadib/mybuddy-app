// MyBuddy css Auth/Forms
import { StyleSheet, Platform } from 'react-native';
import Colors from '../../constants/Colors';

var styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  welcome: {
    fontFamily: 'Poppins-Medium',
    fontSize:18,
    color: Colors.greyM,
    letterSpacing: -1,
    lineHeight: 28, 
    //fontWeight: 400,
  },

  h2: {
    fontFamily: 'Poppins-Medium',
    color: Colors.greyM,
    fontSize: 24,
    letterSpacing: -1,
    lineHeight: 26,
    fontWeight: "400",
  },

  h3: {
    fontFamily: 'Poppins-Medium',
    color: Colors.greyH,
    fontSize: 20,
    letterSpacing: -1,
    lineHeight: 24,
    fontWeight: "400",
  },

  h4: {
    fontFamily: 'Poppins-Medium',
    fontSize:16,
    color: Colors.greyH,
    letterSpacing: 0,
    lineHeight: 22,
    //fontWeight: 400,
  },

  h5: {
    fontFamily: 'Poppins-Regular',
    color: Colors.greyH,
    fontSize: 14,
    paddingVertical: 0,   // évite les décalages
    lineHeight: 22,       // adapte à ta fontSize
    textAlignVertical: "center",
    ...(Platform.OS === "android" && {
            height: 40,
            paddingTop: 0,
            paddingBottom: 0,
            includeFontPadding: false,      // Android: retire le “gap” en haut
            // textAlignVertical: "center"   // souvent ignoré par le placeholder
          })
   
  },
    h5Bold: {
    fontFamily: 'Poppins-Bold',
    color: Colors.greyH,
    fontSize: 14,
  },
   h5BoldTitle: {
    fontFamily: 'Poppins-Bold',
    color: Colors.greyH,
    fontSize: 16,
  },

  h6: {
    fontFamily: 'Poppins-Medium',
    color: Colors.greyH,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
  },
   h7: {
    fontFamily: 'Poppins-Medium',
    color: Colors.greyH,
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 14,
  },

  h5Italic: {
    fontFamily: 'Poppins-Medium',
    color: Colors.greyH,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
  },

  h5ItalicRed: {
    fontFamily: 'Poppins-Medium',
    color: Colors.red,
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 12,
    fontWeight: "400",
  },

  button : {
    paddingLeft:"5%",
    paddingRight:"5%",
    width:"90%",
    borderRadius:25,
    overflow:'hidden',
    height:40,
    top: 0,
    borderWidth: 1,
    borderColor: Colors.gold,
    textAlign:'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },

  buttonInverted : {
    marginLeft:"5%",
    marginRight:"5%",
    width:"90%",
    padding:0,
    borderRadius:25,
    overflow:'hidden',
    height:40,
    top: 0,
    borderWidth: 1,
    borderColor: Colors.accent,
    textAlign:'center',
    alignItems:'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#D5D2D2',
  },

  buttonOn : {
   width:"100%",
    borderRadius:22,
    height:40,
    //borderWidth: 1,
    borderColor: Colors.black,
    textAlign:'center',
    alignItems:'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greyM,
    
  },

  buttonOff: {
    width:"100%",
    borderRadius:22,
    height:40,
    borderWidth: 1,
    borderColor: Colors.greyL,
    alignItems:'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  buttonLabelOn : {
    fontFamily:"Poppins-Medium",
    color: Colors.greyL,
    textAlign: 'center',
    fontSize: 16,
    marginTop:5,
    textTransform:'capitalize',
  },
  buttonLabelOff : {
    fontFamily:"Poppins-Medium",
    color: "#FFF",
    textAlign: 'center',
    fontSize: 16,
    marginTop:5,
    textTransform:'capitalize',
  },

  buttonLabel : {
    
    color: Colors.accent,
    textAlign: 'center',
    fontSize: 16,
    //textTransform:'capitalize',
  },

  buttonLabelInverted : {
    color: Colors.black,
    textAlign: 'center',
    fontSize: 16,
    //textTransform:'capitalize',
  },

  headerContainer: {
    height:60,
    backgroundColor:Colors.white,
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:0,
    borderBottomWidth:1,
    borderBottomColor: Colors.greyUL 

  },

  
  formsContainer: {
    //flex:1,
    marginLeft:20,
    marginRight:20,
   //borderWidth:1,
  },



  formContainerRow: {
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
    flexDirection:"row",
    borderRadius:25,
    overflow:'hidden',
    color: Colors.white,
    height:40,
    paddingLeft: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
 
  },

  searchIcon: {
    padding: 5,
    paddingLeft: 0,
  },

  formContainer: {
    borderRadius:25,
    overflow:'hidden',
    color: Colors.white,
    height:30,
    margin:0,
    paddingLeft:20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
 
  },

  inputContainer: {
    borderRadius:22,
    overflow:'hidden',
    color: Colors.white,
    height:40,
    paddingLeft:10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
    alignItem:"center",
    justifyContent:"center",
    alignContent:"center",
         textAlignVertical: "center",

  },
  inputContainerRow: {
     textAlignVertical: "center",
    flex:1,
    padding:5,
    borderWidth: 0,
    flexDirection:"row",
      alignItem:"center",
    justifyContent:"flex-start",
    alignContent:"center",
  },

  

  textInput: {
    borderRadius:25,
    overflow:'hidden',
    color: Colors.white,
    height:40,
    margin:0,
    paddingLeft:20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
  },

  textInputStyle: {
    flex: 1,
    color: Colors.greyH,
    fontSize:15,
    height: 40,
    margin: 0,
    padding: 0,
    paddingTop:0,
  },

   smallCircle: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.greyM
  },
  passwordLabel: {
    fontSize: 10,
    color: Colors.greyM,
    margin: 0,
    paddingRight: 10  
  },

  textWithoutUnderline: {
    color: Colors.greyH,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    //lineHeight: 18,
    color:Colors.greyM,
    //textDecorationLine: 'underline'
  },

  textUnderline: {
    color: Colors.greyH,
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
    color:Colors.greyM,
    textDecorationLine: 'underline'
  },

  // error: {
  //   borderRadius:25,
  //   overflow:'hidden',
  //   color: Colors.white,
  //   height:40,
  //   margin:10,
  //   paddingLeft:20,
  //   backgroundColor: Colors.primary,
  //   borderWidth: 1,
  //   borderColor: Colors.red,
  // },
  // noerror: {
  //   borderRadius:25,
  //   overflow:'hidden',
  //   color: Colors.white,
  //   height:40,
  //   margin:10,
  //   paddingLeft:20,
  //   backgroundColor: Colors.primary,
  //   borderWidth: 1,
  //   borderColor: Colors.secondary_alpha,
  // },
  
  inner: {
    paddingTop: 0,
    ...Platform.select({
      ios: {
        marginTop: 0,
        paddingBottom: 0,
        justifyContent: "flex-end",
      },
      android: {
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: "flex-end",
      },
    }),
  
  },


  checkboxBaseError: {
    width:26,
    height:26,
    borderRadius:13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.red,
    backgroundColor: 'transparent',
  },

  checkboxBase: {
    width:26,
    height:26,
    borderRadius:13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary_alpha,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    padding:5,
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center',
    width:24,
    height:24,
    borderRadius:12,
    borderWidth:3,
    borderColor:Colors.black,
    padding:10,
    backgroundColor: Colors.white,

  },

  DateButtonContainer: {
    flexDirection: 'row',
    minWidth: 150,
    borderRadius: 25,
    overflow: 'hidden',
    color: Colors.white,
    height: 40,
    margin: 0,
    paddingLeft: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center"
  },
  radioGroupTitleContainer: {
    borderWidth: 0,
    borderColor: "#FFF",
    alignContent: "flex-end",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 5,
    top: 0,
    paddingRight: 0,
  },

  radioGroupContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
    height: 50,
    flexDirection: "row",
    paddingLeft: 30,
    padding: 5,
    alignContent: "flex-start",
    alignItems: "center",
    justifyContent: "flex-start"
  },


  radioGroupContainerStyleColumn: {
    paddingTop: 0,
    paddingLeft: 0,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 0,
    borderWidth: 0,
    borderColor: "#FFF",
  },

  radioGrouplabelStyleH: {
    //paddingRight: 10,
    top: 3,
   // height: 20,
    textAlign: "center",
    color: "#FFF",
    fontSize: 12,
  },
  radioGroupTitleContainer: {
    borderWidth: 0,
    borderColor: "#FFF",
    alignContent: "flex-end",
    alignItems: "center",
    justifyContent: "flex-end",
   // padding: 5,
    top: 0,
    paddingRight: 0,
  },

  radioGroupContainer: {
    borderWidth: 0,
    borderColor: "#000",
    marginTop: 0,
   height: 50,
    flexDirection: "row",
    //paddingLeft: 30,
    //padding: 5,
   
  },


  radioGroupContainerStyleColumn: {
    paddingTop: 0,
    paddingLeft: 0,
    alignContent: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 0,
    borderWidth: 0,
    borderColor: "#FFF",
  },


  radioGrouplabelStyle: {
    borderWidth: 0,
    borderColor: "#000",
   // textAlign: "center",
    //top: -25,
    color: Colors.greyH,
   // marginLeft: -10,
    left: -5,
    fontSize: 13,
    borderColor: "#ccc"
  },

  radioGrouplabelStyleH: {
    paddingRight: 10,
    top: 3,
    height: 20,
    textAlign: "center",
    color: "#FFF",
    fontSize: 12,
  },



  checkboxBase: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.greyM,
    backgroundColor: Colors.background,
  },


  checkboxChecked: {
    width: 26,
    height: 26,
    borderRadius: 13,
    //borderWidth: 2,
   // borderColor: Colors.greyM,
    backgroundColor: Colors.pinkBuddy,
  },

  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  card: {
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: Colors.white,
    },

});

export default styles;