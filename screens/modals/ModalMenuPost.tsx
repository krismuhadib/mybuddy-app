import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//import { Constants } from 'expo';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import myFonctions from '../../components/MyFonctions';
import TextLocalized from '../../utils/locales/langs';
import { I18n } from 'i18n-js';
const i18n = new I18n(TextLocalized);
i18n.locale = myFonctions.CleanLocale(Localization.locale)
import Colors from '../../components/Colors';
import * as Sharing from 'expo-sharing';
import * as FileSystem from "expo-file-system";

var config = require('../../config.tsx');

// Window Device
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);
//const navigation= this.props;


export default class ModalMenuPost extends Component<Props>  {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalConfirmDeleteVisible: true,
      navigation: this.props.navigation, // navigation go back for stack,
      item: this.props.item,
      userToken: this.props.userToken,
      post_id: this.props.item,
      animal_id: this.props.animal_id,
      post_animal_id: this.props.post_animal_id,
      modalPostActionVisible: false,
      navigateToModal: this.props.navigateToModal,
    };
    //console.log("ModalMenuPost NavigateTo111", this.state.navigateToModal);
    //console.log("ModalMenuPost post & animal & user", this.state.post_animal_id, this.state.animal_id);
  };

  _onClose = () => {
    this.setState({
      modalVisible: false,
      modalConfirmDeleteVisible: false
    });
  };

  _onCloseDelete = () => {
    this.setState({
      modalVisible: true,
      modalConfirmDeleteVisible: false
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      post_animal_id: nextProps.post_animal_id,
      modalVisible: nextProps.modalVisible,
      modalConfirmDeleteVisible: nextProps.modalConfirmDeleteVisible,
     // navigation: nextProps.navigation,
    });
  };

  GoToFriendsScreen() {
    this.setState({
      modalVisible: false,
      modalConfirmDeleteVisible: false,
    });
    this.props.navigation.navigate('FriendsScreen');
  };

  GoToLegendScreen() {
    this.setState({
      modalVisible: false,
      modalConfirmDeleteVisible: false,
    });
    this.props.navigation.navigate('LegendScreen');
  };

  GoToSettingSignalmentScreen(item) {
    this.setState({
      modalVisible: false,
      modalConfirmDeleteVisible: false
    });

    if (this.state.navigateToModal === "Home" || this.state.navigateToModal === "PostView") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "Home ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };


    if (this.state.navigateToModal === "AddCommentSearchScreen") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "SearchScreen ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };


    if (this.state.navigateToModal === "SearchScreen") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "SearchScreen ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };

    if (this.state.navigateToModal === "PostViewSearch") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "PostViewSearch ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };
    if (this.state.navigateToModal === "PostViewMap") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "Home ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };

    if (this.state.navigateToModal === "PostViewSend") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "SendScreen ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };

    if (this.state.navigateToModal === "PostViewBookmarks") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "Bookmarks ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };

    if (this.state.navigateToModal === "PostViewFavorite") {
      this.props.navigation.navigate('SettingSignalmentScreen', {
        navigateTo: "Bookmarks ",
        item: item,
        animal_id: this.state.post_animal_id,
      });
    };

  };

  GoToAnimalProfile(item) {
    this.setState({
      modalVisible: false,
      modalConfirmDeleteVisible: false,
    });

    if (this.state.navigateToModal === "Home") {
      this.props.navigation.navigate('AnimalDetails', {
        navigateTo: "Home",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })
    };

    if (this.state.navigateToModal === "PostView") {
      this.props.navigation.navigate('AnimalDetails', {
        navigateTo: "Home",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })
    };

    if (this.state.navigateToModal === "AddCommentSearchScreen") {
      this.props.navigation.navigate('AnimalDetailsSearch', {
        navigateTo: "SearchScreen",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })


    };
    if (this.state.navigateToModal === "PostViewMap") {
      this.props.navigation.navigate('MapAnimalDetails', {
        navigateTo: "SearchScreen",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })
    };

    if (this.state.navigateToModal === "PostViewSend") {
      this.props.navigation.navigate('AnimalDetailsSend', {
        navigateTo: "SearchScreen",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })
    };
    if (this.state.navigateToModal === "PostViewBookmarks") {
      this.props.navigation.navigate('AnimalDetailsUser', {
        navigateTo: "SearchScreen",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })
    };

    if (this.state.navigateToModal === "PostViewFavorite") {
      this.props.navigation.navigate('AnimalDetailsUser', {
        navigateTo: "SearchScreen",
        item: item,
        userToken: this.state.userToken,
        item_user: item.user_id._id,// a virer
        item_animal: item.animal_id._id,// a virer
        otherParam: 'anything you want here',// a virer
      })
    };

  };


  GoToAddComment(item) {
    this.setState({
      modalVisible: false,
      modalConfirmDeleteVisible: false,
    });

    if (this.state.navigateToModal === "AddCommentSearchScreen") {
      this.props.navigation.navigate('AddCommentSearchScreen', {
        navigateTo: "SearchScreen",
        screen: 'AddCommentsearch',
        postUpdate: item,
        otherParam: 'anything you wxxxxxxant here',
        newcomment: true,
      })
    };

    if (this.state.navigateToModal === "Home" || this.state.navigateToModal === "PostView") {
      this.props.navigation.navigate('AddComment', {
        navigateTo: "Home",
        screen: 'AddComment',
        postUpdate: item,
        otherParam: 'anything you wxxxxxxant here',
        newcomment: true,
      })
    };

    if (this.state.navigateToModal === "PostViewMap") {
      this.props.navigation.navigate('MapAddComment', {
        navigateTo: "MapAddComment",
        screen: 'AddComment',
        postUpdate: item,
        otherParam: 'anything you wxxxxxxant here',
        newcomment: true,
      })
    };

    if (this.state.navigateToModal === "PostViewSend") {
      this.props.navigation.navigate('AddCommentSearchScreen', {
        navigateTo: "PostViewSend",
        screen: 'AddComment',
        postUpdate: item,
        otherParam: 'anything you wxxxxxxant here',
        newcomment: true,
      })
    };

    if (this.state.navigateToModal === "PostViewBookmarks") {
      this.props.navigation.navigate('AddCommentFavorite', {
        navigateTo: "PostViewSend",
        screen: 'AddComment',
        postUpdate: item,
        otherParam: 'anything you wxxxxxxant here',
        newcomment: true,
      })
    };

    if (this.state.navigateToModal === "PostViewFavorite") {
      this.props.navigation.navigate('AddCommentFavorite', {
        navigateTo: "PostViewSend",
        screen: 'AddComment',
        postUpdate: item,
        otherParam: 'anything you wxxxxxxant here',
        newcomment: true,
      })
    };

  };

  GoToDeletePost(item) {
    console.log("modalConfirmDeleteVisiblemodalConfirmDeleteVisible", this.state.modalConfirmDeleteVisible)
    this.setState({
      modalPostActionVisible: false,
      modalConfirmDeleteVisible: true,
      reload: true,
      postId: item._id,
      image_id: item.image_id,
      video_id: item.video_id,
      // modalVisible: false,

    });
    return this.state.modalPostActionVisible

  };

  AddLikes(item) {
    this.setState({
      modalVisible: false
    });

    console.log("le this.props.navigateToModal", this.props.navigateToModal)

    //console.log("toggleFav, item", item.animal_id._id, this.props.animal._id,)
    //console.log("this.props.animal._idthis.props.animal._idthis.props.animal._idthis.props.animal._id,", this.props.animal._id)


    // Send array of favorites & save to mongo
    fetch(config.uri + 'posts/likes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: this.state.animal_id,
        post_id: item, // A verfiier
        favorites: this.state.animal_id,
        likers: this.state.animal_id,
        language: i18n._locale,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          // Sending Notifications rules
          // Send if its different user with differents animals

          //this.sendLikeNotifs(item);
          //let favorites = this.state.favorite;
          // console.log("le this.props.navigateToModal", this.props.navigateToModal)

          // Home
          if (this.state.navigateToModal === "Home") {
            this.props.navigation.navigate("Home", {
              navigateTo: "Home",
              reload: true,
              item: item
            });
          };
          if (this.state.navigateToModal === "AddComment") {
            this.props.navigation.navigate("AddComment", {
              navigateTo: "Home",
              reload: true,
              item: item
            });
          };
          if (this.state.navigateToModal === "PostView") {
            this.props.navigation.navigate("PostView", {
              navigateTo: "PostView",
              reload: true,
              item: item
            });
          };

          // Search
          if (this.state.navigateToModal === "AddCommentSearchScreen") {
            this.props.navigation.navigate("AddCommentSearchScreen", {
              navigateTo: "AddCommentSearchScreen",
              reload: true,
              item: item
            });
          };

          if (this.state.navigateToModal === "PostViewSearch") {
            this.props.navigation.navigate("PostViewSearch", {
              navigateTo: "PostViewSearch",
              reload: true,
              item: item
            });
          };

          // Map

          if (this.state.navigateToModal === "PostViewMap") {
            this.props.navigation.navigate("PostViewMap", {
              navigateTo: "PostViewMap",
              reload: true,
              item: item
            });
          };

          // Send

          if (this.state.navigateToModal === "PostViewSend") {
            this.props.navigation.navigate("PostViewSend", {
              navigateTo: "PostViewSend",
              reload: true,
              item: item
            });
          };

          // Bookmarks
          if (this.state.navigateToModal === "PostViewBookmarks") {
            this.props.navigation.navigate("BookmarkScreen", {
              navigateTo: "BookmarkScreen",
              reload: true,
              item: item
            });
          };
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });

  };

  // Sharing
  openShareDialogAsync = async (item) => {
    console.log("openShareDialogAsync item", item)

    if (Platform.OS === 'web') {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }


    FileSystem.downloadAsync(
      config.linkserver + item.animal_id._id + '/images/posts/' + item.image_id + '.jpg',
      FileSystem.documentDirectory + item.image_id + '.jpeg'
    )
      .then(({ uri }) => {
        console.log('Finished downloading to ', uri);

        this.setState({
          uri: uri,
        })

        // transform to base 64


        //const URRI =  uri;


        try {
          let filename = item.image_id + '.jpeg'; // or some other way to generate filename
          let filepath = `${FileSystem.documentDirectory}/${filename}`;
          console.log("filepath", filepath)
          let tutu = FileSystem.writeAsStringAsync(filepath, this.state.uri, { encoding: 'base64' });
          console.log("FileSystem", tutu)
          Sharing.shareAsync(filepath, { mimeType: 'image/jpeg' })
        } catch (e) {
          alert(e.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  deletePost = async () => {
    //console.log('Fetch postIdpostIdpostIdpostId', this.state.postId);

    this.setState({
      modalPostActionVisible: false,
      modalConfirmDeleteVisible: false,
      modalVisible: false,
    });

    fetch(config.uri + 'posts/deleteuserpost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //   token: this.state.token,
        post_id: this.state.postId,
        //user_id: this.state.item.user_id._id,
        image_id: this.state.image_id,
        video_id: this.state.video_id,
        animal_id: this.state.animal_id,

      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var keypassword = res.key;
          //var user = res;
          console.log("Delete Post Id ", res)

          //this.navigation.navigate('Postview')

          this.setState({
            modalPostActionVisible: false,
            modalConfirmDeleteVisible: false,
          });



        }
        else {
          alert(res.message);
          alert('Prb Delete Post');
        }
      });

    if (this.state.navigateToModal === "AddCommentSearchScreen") {
      const whicfrom = this.props.navigateToModal;
      this.props.navigation.navigate("SearchScreen", {
        navigateTo: "SearchScreen",
        reload: true,

      });
    };

    if (this.state.navigateToModal === "PostView") {
      this.props.navigation.navigate("AnimalDetails", {
        navigateTo: "Home",
        item: this.state.item,
        // this.state.userToken: this.state.userToken,
        item_user: this.state.item.user_id._id,// a virer
        item_animal: this.state.item.animal_id._id,// a virer
        reload: true,

      });
    };

    if (this.state.navigateToModal === "AddComment") {
      this.props.navigation.navigate("Home", {
        navigateTo: "Home",
        reload: true,

      });
    };
    if (this.state.navigateToModal !== "PostView" && this.state.navigateToModal !== "AddComment" && this.state.navigateToModal !== "AddCommentSearchScreen") {



      const whicfrom = this.props.navigateToModal;
      this.props.navigation.navigate(whicfrom, {
        navigateTo: whicfrom,
        reload: true,
      });
    }
    // var reload = true;
    // if (this.state.navigateToModal === "AddComment") {
    //   this.props.navigation.navigate("Home", {
    //     navigateTo: "Home",
    //     reload: true,
    //   });

    // } else {
    //    const whicfrom = this.props.navigateToModal;
    // this.props.navigation.navigate(whicfrom, {
    //   navigateTo: whicfrom,
    //   reload: true,
    // });
    // }


  };


  render() {
    // console.log('----> MODAL POST ItEmqqqqq', this.state.user_id);
    var modalBackgroundStyle = { backgroundColor: 'rgba(0, 0, 0, 0.8)' };
    const modalConfirmDeleteVisible = this.state.modalConfirmDeleteVisible;
    //const item = this.state.item;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          //presentationStyle="formSheet"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainerTransparentStyle]}>
              {/* CLOSE PAN */}
              <TouchableOpacity onPress={() => this._onClose()}>
                <View style={[styles.line_spacer]}></View>
                {/* <View style={[styles.bloc_Row]}>
                <View style={[styles.bloc_]}>
                <Text style={{textAlign: 'center',fontSize: 20,fontWeight:'bold'}}>Modal title</Text>
                </View>
                <View style={[styles.bloc_right]}>
                  <Ionicons style={{textAlign: 'right', paddingLeft: 10}} name="close" size={20} color="black" /> 
               </View>
               </View>
               */}
              </TouchableOpacity>
              {/* Signalement Settings */}

              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={async () => this.AddLikes(this.props.item)}>
                  <View style={styles.buttontouchicon}>
                    <Ionicons name='heart-outline' size={22} color={Colors.greyH} />
                  </View>
                  <View >
                    <Text style={styles.buttontouchtext}>{i18n.t('Modal.Like_Post')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={Colors.greyH} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>


              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={async () => this.GoToAddComment(this.props.item)}>
                  <View style={styles.buttontouchicon}>
                    <AntDesign name='message1' size={22} color={Colors.greyH} />
                  </View>
                  <View >
                    <Text style={styles.buttontouchtext}>{i18n.t('Modal.Add_Comment')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={Colors.greyH} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={async () => this.GoToAnimalProfile(this.props.item)}>
                  <View style={styles.buttontouchicon}>
                    <Feather name='eye' size={22} color={Colors.greyH} />
                  </View>
                  <View >
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.See_Profile')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={Colors.greyH} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              {/* Animal Profil  */}
              {/*  <View style={{height:50}}>
              <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToAnimalProfile(this.props.item)}>
                  
                  <View style={styles.buttontouchicon}>
                      <MaterialIcons name='pets' size={25} color={Colors.greyH} />
                  </View>
                  <View >
                      <Text style={styles.buttontouchtext}>{i18n.t('Page.Animal_Profile')}</Text>
                  </View>
                    
                  <View style={{ flex: 1 }}>
                      <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                        <AntDesign name="right" size={20} color={Colors.greyH} />
                      </View>
                  </View>
              </TouchableOpacity>
            </View> */}

              {/* Friends post's animal */}
              {/*  <View style={{height:50}}>
                <TouchableOpacity style={styles.buttontouch} onPress={() =>  this.GoToFriendsScreen()}>
                    <View style={styles.buttontouchicon}>
                        <MaterialIcons name='group' size={25} color={Colors.greyH} />
                    </View>
                    <View >
                        <Text style={styles.buttontouchtext}>{i18n.t('Page.SeePostfriends')}</Text>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                            <AntDesign name="right" size={20} color={Colors.greyH} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View> */}
              {/* User Settings */}
              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={async () => this.openShareDialogAsync(this.props.item)}>
                  <View style={styles.buttontouchicon}>
                    <Feather name='share-2' size={22} color={Colors.greyH} />
                  </View>
                  <View >
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.SharePost')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={Colors.greyH} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ height: 50 }}>
                <TouchableOpacity style={styles.buttontouch} onPress={async () => this.GoToLegendScreen()}>
                  <View style={styles.buttontouchicon}>
                    <Feather name='help-circle' size={22} color={Colors.greyH} />
                  </View>
                  <View >
                    <Text style={styles.buttontouchtext}>{i18n.t('Page.SeeLegends')}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                      <AntDesign name="right" size={20} color={Colors.greyH} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {(this.state.animal_id !== this.state.post_animal_id) &&
                <View style={{ height: 50 }}>
                  <TouchableOpacity style={styles.buttontouch} onPress={() => this.GoToSettingSignalmentScreen(this.props.item)}>

                    <View style={styles.buttontouchicon}>
                      <MaterialCommunityIcons name='alert' size={22} color={Colors.red} />
                    </View>
                    <View >
                      <Text style={styles.buttontouchtextRed}>{i18n.t('Page.Signalment')}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                        <AntDesign name="right" size={20} color={Colors.greyH} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              {(this.state.animal_id === this.state.post_animal_id) &&
                <View style={{ height: 50 }}>
                  <TouchableOpacity style={styles.buttontouch} onPress={async () => this.GoToDeletePost(this.props.item)}>
                    <View style={styles.buttontouchicon}>
                      <Ionicons name='trash-sharp' size={22} color={Colors.red} />
                    </View>
                    <View >
                      <Text style={styles.buttontouchtextRed}>{i18n.t('Modal.Delete_Post')}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={[styles.buttontouchicon, { borderWidth: 0, marginRight: 0, alignItems: 'flex-end', }]}>
                        <AntDesign name="right" size={20} color={Colors.greyH} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>

          <View>
          </View>
          {(modalConfirmDeleteVisible === true) &&
            <View style={[styles.modalView]}>
              <View style={[styles.modalContent]}>

                <View style={{ backgroundColor: "white", top: 10, height: 40, justifyContent: 'center', }}>
                  <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.black, fontSize: 20, fontWeight: 'bold' }}>{i18n.t('Modal.Warning')}</Text>
                </View>

                <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                  <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'normal' }}>{i18n.t('Modal.Warning_comment_message')}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignContent: "space-around" }}>

                  <View style={{ borderWidth: 0, flex: 1 }}>
                    <TouchableOpacity onPress={() => this._onCloseDelete()}>
                      <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Cancel')}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ borderWidth: 0, flex: 1 }}>
                    <TouchableOpacity onPress={() => this.deletePost()}>
                      <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Delete')}</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              </View>

            </View>
          }

        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  innerContainerTransparentStyle: {
    width: ScreenWidth,
    top: ScreenHeight / 3.33,
    backgroundColor: 'white',
    height: 450,
    borderRadius: 22,
  },

  buttontouchicon: {
    marginLeft: 0,
  },

  buttontouchtext: {
    marginLeft: 20,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    //textAlign:'left',
    //justifyContent: 'center',
  },

  buttontouchtextRed: {
    marginLeft: 20,
    fontFamily: 'Roboto-Regular',
    color: "red",
    fontSize: 15,
    //textAlign:'left',
    //justifyContent: 'center',
  },

  buttontouch: {
    marginRight: 20,
    marginLeft: 20,
    flex: 1,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    backgroundColor: '#ecf0f1',
  },

  bloc_Row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    borderColor: '#000',
    height: 40,
    borderRadius: 22,
  },
  bloc_: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'red',
    //borderRadius: 26,
  },
  line_spacer: {
    padding: 10,
    justifyContent: 'flex-start',
    height: 10,
    marginLeft: 180,
    marginRight: 180,
    borderBottomColor: '#c0c0c0',
    opacity: 0.9,
    borderBottomWidth: 5,
    marginBottom: 20,

  },

  bloc_right: {
    flexDirection: 'row',
    paddingLeft: 230,
    alignItems: 'center',
    backgroundColor: '#fff',
    //borderWidth: 1,
    //borderColor: 'green',
    height: 20,
    //borderRadius: 26,
  },
  black: {
    color: '#000',
  },
  white: {
    color: '#FFF',
  },
  bold: {
    fontWeight: 'bold',
  },
  view: {
    //width:390,
    height: 200,
    backgroundColor: '#394163',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',

  },

  modalView: {
    width: ScreenWidth,
    height: ScreenHeight,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        position: 'absolute',
        zIndex: 1,
        //top:ScreenHeight - 300,
      },
      android: {
        top: 0,
        backgroundColor: '#000000',
        //position: 'absolute',
        elevation: 1,
        opacity: 1,
        //top:140,

      },
    }),


    //top:ScreenHeight - 100,
  },
  modalContent: {
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
})