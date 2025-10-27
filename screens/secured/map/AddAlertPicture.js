import React, { useContext, SafeAreaView, useCallback, useMemo, useEffect, useState, useReducer } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, Platform, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/forms";
import { i18n } from "../../../constants/Localization";
import BDButton from '../../../components/elements/BDButton';
import { useDispatch } from "react-redux";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import HeaderBuddyLeft from '../../../components/elements/HeaderBuddyLeft';



var noImg = require('../../../assets/images/logo_avatar_trsp.png');
var config = require('../../../config');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const AddAlertPictureScreen = (route) => {

  // User Redux Store Data
  const navigation = useNavigation();
  const params = route.route.params;

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [displaybutton, setDisplayButton] = useState(false);
  const [modalDisplay, setModalDisplay] = useState('none');
  const [itemToDelete, setItemToDelete] = useState('');


  const storeDispatch = useDispatch();
   console.log("Add Alert PictureScreen: ");



  useEffect(() => {
    //getAnimalData();
  }, []);

  const getAnimalData = async () => {
    fetch(config.uri + 'animals/getdatasfromanimalid', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          console.log("EDIT ANIMAL ADDPICTURE", res.value)
          storeDispatch(SaveAnimal(res.animaldoc));
        } else {
          console.log('ca marche PASSSS RES ?', res.success);
        }
      });


  };

  const goToMedias = () => {

     if (params.from === "Alert") {
      navigation.navigate('UserMedias', {
        from: "Alert"
      });
    }
    if (params.from === "User" ) {
      navigation.navigate('UserMedias', {
        from: "User"
      });

    } 


  };

  const goToRoot = () => {
   
      navigation.goBack();
    
  };

  const openDeleteModal = (item) => {
    setModalDisplay("flex");
    setItemToDelete(item);
  };

  const closeModal = () => {
    setModalDisplay("none");
  };


  const deleteAvatarPic = async () => {
    setModalDisplay("none");
    await fetch(config.uri + 'animals/deleteavatar', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        avatar: animalData.avatars[itemToDelete],
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          deleteImagetoDb();
          setModalDisplay("none");
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });

  };

  // Delete Pic to Carousel DB
  const deleteImagetoDb = async () => {
    await fetch(config.uri + 'carousel/deleteuserimages', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //_id : this.state.itemId.id,
        user_id: userData._id,
        name: animalData.avatars[itemToDelete],
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          var result = res;
          getAnimalData();
        }
        else {
          alert(res.message);
          alert('Prb Caroussel picture');
        }
      })
  };


  return (
    <View style={BDiaryStyles.container}>


        <HeaderBuddyLeft
        // openModal={openModal}
        iconNameL="angle-left"
        //iconNameR="ellipsis-vertical-sharp"
        iconFamilyL="FontAwesome"
        //iconFamilyR="Ionicons"
        label={i18n.t('alert.addPicture')}
        navigationName="User"
        navigationFrom="User"
        goBack={true}
      />

      <ScrollView>
      



        <View>


       


        <View style={{ flexDirection: "row", borderWidth: 0, top: 20, padding: 10 }}>

          <View>
            <View style={styles.cardcontainer} >
              <View style={styles.center}>
                {(animalData && animalData.avatars && animalData.avatars.length < 8) &&
                  <View style={{ borderWidth: 0,}}>
                    <TouchableOpacity 
                      onPress={() => { goToMedias() }}>
                      <Ionicons
                        name="add"
                        size={40}
                        color={Colors.greyH}
                        style={{ justifyContent: "center" }}>
                      </Ionicons>
                    </TouchableOpacity>
                  </View>}
                  {(animalData && animalData.avatars && animalData.avatars.length > 7) &&
                  <View style={{ borderWidth: 0,}}>
                    <View>
                     <Image source={noImg} style={[styles.nocardimage, {
                  width: 50,
                  height: 50, borderWidth: 0, justifyContent: "center", alignContent: "center", alignItems: "center"
                }]} />
                    </View>
                  </View>}

              </View>
            </View>
          </View>





          {(animalData && animalData.avatars && animalData.avatars[0]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[0] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(0)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          {(animalData && animalData.avatars && animalData.avatars[1]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[1] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(1)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </View>


        <View style={{ flexDirection: "row", borderWidth: 0, top: 20, padding: 10 }}>

          {(animalData && animalData.avatars && animalData.avatars[2]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[2] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(2)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          {(animalData && animalData.avatars && animalData.avatars[3]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[3] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(3)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          {(animalData && animalData.avatars && animalData.avatars[4]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[4] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(4)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }


        </View>


        <View style={{ flexDirection: "row", borderWidth: 0, top: 20, padding: 10 }}>

          {(animalData && animalData.avatars && animalData.avatars[5]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[5] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(5)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          {(animalData && animalData.avatars && animalData.avatars[6]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[6] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(6)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          {(animalData && animalData.avatars && animalData.avatars[7]) &&
            <View style={styles.cardcontainer}>
              <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                <Image
                  source={{ uri: config.linkserver + animalData._id + '/images/avatar/' + animalData.avatars[7] + '.jpg' }}
                  style={[styles.cardimage, {
                    width: ScreenWidth / 3.5,
                    height: 150, borderWidth: 0
                  }]} />

                <View style={{ borderWidth: 0, position: "absolute", top: 110 }}>
                  <TouchableOpacity style={styles.buttonicon}
                    onPress={() => openDeleteModal(7)}>
                    <Ionicons
                      name="trash"
                      size={25}
                      color={Colors.greyH}
                      style={{ justifyContent: "center" }}>
                    </Ionicons>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }


        </View>
       

        </View>


        <View style={{width:"70%",marginRight:"15%", marginLeft:"15%", borderWidth:0,  marginTop: 40, marginBottom:0, alignContent:"center", alignItems: 'center', justifyContent:"center", }}>
          <BDButton
            bgcolor={Colors.greenBuddy}
            color={Colors.white}
            display={true}
            functionProp={goToRoot}
            label={i18n.t('animalProfile.submit')}
          />
        </View>


       


      </ScrollView>
       {/* Modal */}
        {/* Fond gris de la modal */}
        <View style={[styles.viewModalCamera, { display: modalDisplay }]}>
          <View style={[styles.modalSecurityStyle]}>
            <View style={{ top: 10 }}>
              <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.black, fontSize: 20, fontWeight: 'bold' }}>{i18n.t('Modal.Warning')}</Text>
              </View>
              <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'normal' }}>{i18n.t('Modal.Warning_Delete_Pic')}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignContent: "space-around" }}>
                <View style={{ borderWidth: 0, flex: 1 }}>
                  <TouchableOpacity onPress={() => closeModal()}>
                    <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Cancel')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ borderWidth: 0, flex: 1 }}>
                  <TouchableOpacity onPress={() => deleteAvatarPic()}>
                    <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Delete')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
    </View>
  );
};



const styles = StyleSheet.create({

  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },


  avatarButtonContainer: {
    marginLeft: 150,
    borderWidth:2,
    zIndex: 1,
    top: 0,
    position: "relative",
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 0,
    backgroundColor: Colors.white,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarContainer: {
    borderColor: Colors.greyH,
    borderWidth: 0,
    height: 180,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    top: 0,
    padding: 0,
    marginBottom: 0,
  },

  avatarCircle: {
    position: "absolute",
    zIndex: 0,
    width: 200,
    height: 200,
    borderWidth:1,
    borderRadius: 100,
    backgroundColor: Colors.white,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center"
  },


  viewModalCamera: {
    width: '100%',
    height: 1200,
    ...Platform.select({
      ios: {

        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1,
        position: 'absolute',
        zIndex: 100,
        //top:ScreenHeight - 300,
      },
      android: {
        top: -100,
        backgroundColor: '#000000',
        //position: 'absolute',
        elevation: 1,
        opacity: 1,
        //top:140,

      },
    }),


    //top:ScreenHeight - 100,
  },
  modalSecurityStyle: {

    width: '80%',
    marginRight: '10%',
    marginLeft: '10%',
    borderRadius: 12,


    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 160,
        //position: 'absolute',
        top: ScreenHeight / 2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: ScreenHeight / 2,
        height: 200,

      },
    }),

    backgroundColor: 'white',

  },

  modalSecurityStyleAbort: {

    width: '96%',
    marginRight: '2%',
    marginLeft: '2%',
    borderRadius: 22,


    //opacity: 1,
    ...Platform.select({
      ios: {
        height: 60,
        //position: 'absolute',
        top: ScreenHeight / 2.2,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,

      },
      android: {
        elevation: 3,
        backgroundColor: '#FFFFFF',
        //opacity: 1,
        //position: 'absolute',
        top: 40,
        height: 60,

      },
    }),

    backgroundColor: 'white',

  },

  line_spacer: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,

  },


  center: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },

  colorContainer: {
    borderWidth: 1,
    width: ScreenWidth - 40,
    borderColor: Colors.greyM,
    padding: 5,
    borderRadius: 12,
    alignContent: "center",
    justifyContent: "center",
    height: 130,
    backgroundColor: Colors.pastred,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68
  },

  cardcontainer: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: ScreenWidth / 3.5,
    height: 150,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    margin: 6
  },
  cardimage: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
    width: ScreenWidth / 3.5,
    height: 150,
    borderRadius: 10,
  },
  nocardimage: {
    height: 150,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
    borderRadius: 0,
  },
  buttonicon: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 0,
    width: 30,
    height: 30,
    backgroundColor: "white",
  },


});



export default AddAlertPictureScreen;


