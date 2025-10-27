// MyBuddy css Styles
import { StyleSheet, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import forms from './forms';

var styles = StyleSheet.create({

  ...forms,

  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  welcome: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    color: Colors.greyM,
    letterSpacing: 0,
    lineHeight: 28,
    //fontWeight: 400,
  },
  legalBold: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: Colors.greyH,
    letterSpacing: 0,
    lineHeight: 28,
  },

  legalRegular: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: Colors.greyH,
    letterSpacing: 0,
    //lineHeight: 28,
  },

  h2: {
    fontFamily: 'Roboto-Regular',
    color: Colors.accent,
    fontSize: 24,
    letterSpacing: -1,
    lineHeight: 26,
    // fontWeight: 400,
  },

  h3: {
    fontFamily: 'Roboto-Regular',
    color: Colors.greyM,
    fontSize: 20,
    letterSpacing: -1,
    lineHeight: 24,
    //fontWeight: 400,
  },

  h4: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: Colors.greyH,
    letterSpacing: 0,
    lineHeight: 18,
    //fontWeight: 400,
  },

  postText: {
    textAlign: "left",
    lineHeight: 17,
    letterSpacing: 0,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'normal',
    borderWidth: 0,
    paddingLeft: 0,
    fontSize: 14,
    color: Colors.greyH
  },

  h5: {
    fontFamily: 'Roboto-Regular',
    color: Colors.greyM,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
    //fontWeight: 400,
  },

  h5Red: {
    color: Colors.red,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 12,
    fontStyle: 'italic',
    // fontWeight: 400,
  },

  welcomeButtonContainer: {

    height: 70,
    padding: 5,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.black,
    justifyContent: "center",
    alignContent: "center",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68


  },

  welcomeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 20,
    padding: 5,
    textAlign: "center",
    color: Colors.greyM


  },



  button: {
    paddingLeft: "5%",
    paddingRight: "5%",
    width: "90%",
    borderRadius: 25,
    overflow: 'hidden',
    height: 40,
    top: 0,
    borderWidth: 1,
    borderColor: Colors.gold,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },

  buttonInverted: {
    marginLeft: "5%",
    marginRight: "5%",
    width: "90%",
    padding: 0,
    borderRadius: 25,
    overflow: 'hidden',
    height: 40,
    top: 0,
    borderWidth: 1,
    borderColor: Colors.accent,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#D5D2D2',
  },

  buttonOn: {
    width: "100%",
    borderRadius: 25,
    overflow: 'hidden',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.black,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greyH,

  },

  buttonOff: {
    width: "100%",
    borderRadius: 25,
    overflow: 'hidden',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.greyM,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  buttonLabelOn: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    //textTransform:'capitalize',
  },
  buttonLabelOff: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    //textTransform:'capitalize',
  },

  buttonLabel: {
    color: Colors.accent,
    textAlign: 'center',
    fontSize: 16,
    //textTransform:'capitalize',
  },

  buttonLabelInverted: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: 16,
    //textTransform:'capitalize',
  },

  buttomModalSetting: {
    marginRight: 20,
    marginLeft: 20,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,
    alignItems: 'center',

  },
  buttonModalText: {
    marginLeft: 20,
    fontFamily: 'Roboto-Regular',
    color: Colors.greyH,
    fontSize: 15,
  },




  formsContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,

  },



  textInput: {
    borderRadius: 25,
    overflow: 'hidden',
    color: Colors.white,
    height: 40,
    margin: 0,
    paddingLeft: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyL,
  },

  textInputStyle: {
    flex: 1,
    color: Colors.greyH,
    fontSize: 15,
    height: 40,
    margin: 0,
    padding: 0,
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
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
    color: Colors.greyM,
    //textDecorationLine: 'underline'
  },

  textUnderline: {
    color: Colors.greyH,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    lineHeight: 18,
    color: Colors.greyM,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.red,
    backgroundColor: 'transparent',
  },

  checkboxBase: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary_alpha,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    padding: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.black,
    padding: 10,
    backgroundColor: Colors.white,

  },

  line_spacer: {
    flex: 1,
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    borderBottomColor: Colors.greyL,
    opacity: 0.9,
    borderBottomWidth: 1,

  },


  buttonCloseModal: {
    padding: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    //height: 40,
    borderRadius: 20,
    borderWidth: 1,
    //backgroundColor: Colors.greenBuddyL,
    marginLeft: 20,
    marginRight: 20,
  },

  centeredView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalCommentCentered: {
    flex: 1,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
  },
  modalCommentView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 20,
    alignItems: 'center',
    
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },


  modalText: {
    marginTop: 0,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    color: Colors.greyH,
    fontSize: 15,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },

  modalTextStyle: {
    color: 'black',
    fontWeight: 'normal',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 13,
  },
  modalTextStyleAction: {
    color: 'white',
    fontWeight: 'normal',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },


  modalButton: {
    width: 100,
    //  height:100, 
    borderRadius: 22,
    margin: 10,
    padding: 10,
    elevation: 2,
    borderWidth: 0,
    borderColor: Colors.black,
    color: Colors.greyH
  },

  modalButtonAction: {
    backgroundColor: "red",
    color: Colors.white,
  },

  modalButtonClose: {
    borderWidth: 1,
    // backgroundColor: '#2196F3',
  },

  commentTextGreen: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.greenBuddy,
  },
  commentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.greyM,
  },
  tendancyResponse:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.greyM,
  },




});

export default styles;