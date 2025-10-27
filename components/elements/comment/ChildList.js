import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Platform, StyleSheet, Dimensions, TouchableOpacity, Image, Text, View } from 'react-native';
import BDiaryStyles from "../../../assets/styles/styles";
import MyFonctions from '../../MyFonctions';
import { i18n } from "../../../constants/Localization";
import Colors from '../../../constants/Colors';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import { FormDate } from '../../../utils/helpers';
import FullScreenVideo from '../FullScreenVideo';
import FullScreenSubImage from '../FullScreenSubImage';
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
//import { FormDate } from '../../../../../utils/helpers';


const config = require('../../../config');
const noImg = require('../../../assets/images/logo_avatar.png');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const ChildListing = ({ setModalVisible, setCommentDisplay, commmenttoggleFav, openKeyboard, deletePost, setAnswerName, setAnswerId, setSwitcha, setAnswer, setComment, setText, setPlaceholder, getAllAddComments, setParentPostId, setPostId, setDisplay, toggleFav, params, childList, data }) => {

  //console.log("ChiuldList");

  const navigation = useNavigation();

  // User Redux Store Data
  const userData = useSelector((state) => state.user.value ? state.user.value : null);
  const animalData = useSelector((state) => state.animal.value ? state.animal.value : null);
  const [isFullImage, setIsFullImage] = useState(false);
  const [isFullSubImage, setIsFullSubImage] = useState(false);
  const [subImageName, setSubImageName] = useState([]);

  const [postUpdate, setPostUpdate] = useState([data]);;
  const [favorite, setFavorite] = useState([]);
  //const [imageDatas, setImageDatas] = useState(data.item);

  const textInputRef = useRef(null);

  const openImage = () => {
    setIsFullImage(true);
  };

  const openSubImage = (datas) => {
    setSubImageName(datas)
    setIsFullSubImage(true);
    setIsFullImage(false);
  };


  const closeImage = () => {
    setIsFullImage(false);
  };
  const closeSubImage = () => {
    setIsFullImage(false);
    setIsFullSubImage(false);
  };


  const closeKeyboard = () => {
    // Ferme le clavier
    Keyboard.dismiss();
  };

  // const openKeyboard = () => {
  //       // Force le TextInput à se concentrer et donc à ouvrir le clavier
  //       textInputRef.current.focus();
  //     };

  const heartIconDisplayItem = (item) => {
    // console.log("heartIconDisplayItem", item.favorites)

    var heartcolor = Colors.greyH;
    if (item && item.favorites) {
      //setFavorite(item.favorites);
      var count = item.favorites.length;

    } else {
      // setFavorite(0);
      var count = 0;
    }
    if (count) {
      heartcolor = 'red';
    }
    if (favorite.includes(item.favorites)) {
      heartcolor = 'red';
    }
    //console.log("this.isFavorite(this.props.user._id)", this.isFavorite(this.props.user._id))
    return (
      <View key={"erdgggt"} style={{ height: 50, borderWidth: 0 }}>
        <TouchableOpacity onPress={() => toggleFav(item)}>
          <Ionicons style={{ padding: 10 }} color={heartcolor} name={favoriteContainId(animalData._id) ? 'heart' : 'heart-outline'} size={15} />
          {/* <Text style={{color:'#000', justifyContent:'center', paddingTop:25, zIndex:999, marginLeft:-7,}}>{count}</Text> */}
        </TouchableOpacity>
      </View>
    );

  };

  // FAVORITES
  const favoriteContainId = () => {
    //console.log('IS FAVORITE ///////', item, this.state.favorite.includes(this.props.user._id), this.props.user._id)
    return favorite.includes(data.item); // True - False
  };


  const modifyPost = () => {
    var itemmodify = { data };
    var value = itemmodify.data;
    //console.log('le state favorite dans tioltioltioltiol',item)

    setAutofocus(true);
    setPlaceholder(i18n.t('addComment.answer'));
    setText(data.item.body);
    setPostId(data.item);
    setAnswer(false);
    setSwitcha(1);

    // this.setState({
    //   autofocus: true,
    //   placeholder: i18n.t('Page.Answer_Comments'),
    //   modalPostActionVisible: false,
    //   text: data.item.body,
    //   postId: data.item,
    //   switch: 1,
    //   answer: false,
    //   //text: "rrrrrrr",
    //   //title: "dddd",
    //   //titleFetch: "ggggg",
    //   //coloredIcons: false,
    // });
  };

  const node_modifyPost = (childelement) => {
    var itemmodify = { data };
    var value = itemmodify.data;
    //console.log('le state favorite dans tioltioltioltiol',item)

    this.setState({
      placeholder: i18n.t('addComment.answer'),
      modalPostActionVisible: false,
      text: childelement.body,
      postId: childelement,
      switch: 1,
      answer: false,
      //text: "rrrrrrr",
      //title: "dddd",
      //titleFetch: "ggggg",
      //coloredIcons: false,
      autofocus: true
    });
  };


  const answerAddPost = (data) => {
    var itemmodify = { data };
    // var value = itemmodify.item;
    //console.log('answerAddPost ITEM',item)
    var answer = true;

    setPlaceholder(i18n.t('addComment.answer'));
    setText(null);
    setComment(null);
    setAnswer(true);
    setParentPostId(data._id);
    setAnswerId(data.animal_id._id);
    setAnswerName(data.animal_id.name);
    setSwitcha(0);
    //setAutofocus(true);
    //openKeyboard();
    setModalVisible(true);
    setCommentDisplay("flex");

    // this.setState({
    //   modalPostActionVisible: false,
    //   placeholder: i18n.t('Page.Anwer_Comments'),
    //   text: '',
    //   answer: true,
    //   parentPost_Id: data._id,
    //   answer_id: data.animal_id._id,
    //   answer_name: data.animal_id.name,
    //   // answer_id : childelement.id,
    //   switch: 0,
    //   //text: "rrrrrrr",
    //   //title: "dddd",
    //   //titleFetch: "ggggg",
    //   //coloredIcons: false,
    //   autofocus: true
    // });

  };

  const node_answerAddPost = (childelement) => {
    var itemmodify = { childelement };

    console.log("node_answerAddPost childelement", childelement)

    //setAutofocus(true);
    setPlaceholder(i18n.t('addComment.answer'));
    setText(null);
    setComment(null);
    setPostId(childelement.item);
    setAnswer(true);
    setSwitcha(0);
    setAnswerName(childelement.animal_id.name);
    setAnswerId(childelement.animal_id._id);
    // openKeyboard();
    setCommentDisplay("flex");
    setModalVisible(true);
    
    // this.setState({
    //   autofocus: true,
    //   modalPostActionVisible: false,
    //   placeholder: i18n.t('Page.Answer_Comments'),
    //   text: '',
    //   answer: true,
    //   parentPost_Id: childelement.parentpost_id,
    //   switch: 0,
    //   answer_name: childelement.animal_id.name,
    //   answer_id: childelement.animal_id._id,
    //   //text: "rrrrrrr",
    //   //title: "dddd",
    //   //titleFetch: "ggggg",
    //   //coloredIcons: false,
    // });
    // this.myTextInput.focus()

  };

  const openModal = () => {
    setDisplay("flex");
    //this.setState({ display: 'flex' })
  };

  const node_deletePost = (childelement) => {
    openModal();

    setPostId(childelement._id);
    setParentPostId(postUpdate._id);


    // this.setState({
    //   modalPostActionVisible: false,
    //   postId: childelement._id,
    //   parentPostId: this.state.postUpdate._id,
    //   title: "dddd",
    //   titleFetch: "ggggg",
    //   //coloredIcons: false,

    // });


  };



  const node_heartIconDisplay = (item) => {
    //count = this.state;
    var heartcolor = Colors.greyH;
    // setFavorite(item.favorites);
    //favorite = item.favorites;
    var count = item.favorites.length;
    //console.log("node_heartIconDisplay)",item)
    if (count > 0) {
      heartcolor = 'red';

    }

    if (!favoriteContainId(animalData._id)) {

      return (
        <View key={'ti'} style={{ flexDirection: 'row', height: 50, borderWidth: 0 }}>
          <TouchableOpacity
            onPress={() => commmenttoggleFav(item)}
          >
            <Ionicons style={{ padding: 0 }} color={heartcolor} name={favoriteContainId(animalData._id) ? 'heart' : 'heart-outline'} size={15} />
            {/* <Text style={{color:'#000', justifyContent:'center', paddingTop:25, zIndex:999, marginLeft:-7,}}>{count}</Text> */}
          </TouchableOpacity>
        </View>
      );


    }
  };

  const bodytext = () => {
    //count = this.state;
    var bodytext = data.item.body
    return (
      <Text style={{ padding: 20, fontSize: 13, textTransform: "none", fontWeight: 'normal' }}>{data.item.body}</Text>
    );
  };

  const answername = (childelement) => {
    return (
      <Text style={{ fontWeight: 'bold', fontSize: 13, paddingLeft: 10, textTransform: 'capitalize', justifyContent: 'center' }}>
        {childelement.animal_name}
      </Text>
    )
  };

  const answer_ = (childelement) => {
    //console.log("ADD COMMENT ANSWER childelementAAA", childelement);

    return (
      <TouchableOpacity style={{}}
        onPress={() => navigation.push('AnimalDetails', {
          navigateTo: "Home",
          item: childelement,
          item_user: childelement.user_id._id,// a virer
          item_animal: childelement.answer_id,// a virer
          otherParam: 'anything you want here',// a virer
        })}>
        <Text style={{  top: 4, color: Colors.greenBuddy, fontSize: 12, paddingLeft: 0, paddingRight: 0, textTransform: 'lowercase', justifyContent: 'center' }}>
          @{childelement.answer_name}
        </Text>
      </TouchableOpacity>
    )
  };

  const answerbodytext = (childelement) => {
    //count = this.state;
    //var bodytext = data.item.body
    return (
      <Text style={{ fontSize: 13, textTransform: "none", justifyContent: 'center', fontWeight: 'normal' }}>{childelement.body}</Text>
    );
  };


  const navigatetolikers = (childelement) => {

    if (params.from === "Home" || params.from === "PostView" || params.from === "Notifications" || params.from === "NotificationsComments") {
      navigation.navigate('LikerList', {
        from: "Home",
        item: childelement,
        userToken: userData._id,
        item_animal: childelement.animal_id._id,
      })

    } else {
      return 
    }

    // if (this.state.navigateTo === "SearchScreen" || this.state.navigateTo === "PostViewSearch" || this.state.navigateTo === "SearchScreenMap") {
    //   this.props.navigation.navigate('LikersScreenSearch', {
    //     navigateTo: "SearchScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })

    // };

    // if (this.state.navigateTo === "FavoriteScreen" || this.state.navigateTo === "PostViewFavorite") {
    //   this.props.navigation.navigate('LikersScreenFavorite', {
    //     navigateTo: "FavoriteScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })

    // };
    // if (this.state.navigateTo === "SendScreen" || this.state.navigateTo === "PostViewSend") {
    //   this.props.navigation.navigate('LikersScreenSend', {
    //     navigateTo: "SendScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })

    // };



  };
  const navigatetoprofile = (childelement) => {


    // console.log("navigatetoprofile childelement", childelement);

    if (params.from === "Home" || params.from === "PostView" || params.from === "Notifications" || params.from === "NotificationsComments") {

      navigation.push('AnimalDetails', {
        navigateTo: "Home",
        item: childelement,
        userToken: userData._id,
        item_user: childelement.user_id._id,// a virer
        item_animal: childelement.animal_id._id,
        otherParam: 'anything you want here',// a virer
      });
    };

    // if (this.state.navigateTo === "SearchScreen" || this.state.navigateTo === "PostViewSearch" || this.state.navigateTo === "SearchScreenMap") {

    //   this.props.navigation.push('AnimalDetailsSearch', {
    //     navigateTo: "SearchScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })
    // }

    // if (this.state.navigateTo === "FavoriteScreen" || this.state.navigateTo === "PostViewFavorite") {

    //   this.props.navigation.push('AnimalDetailsFavorite', {
    //     navigateTo: "FavoriteScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })
    // }
    // if (this.state.navigateTo === "SendScreen" || this.state.navigateTo === "PostViewSend") {

    //   this.props.navigation.push('AnimalDetailsSend', {
    //     navigateTo: "SendAddCommentScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })
    // };

    // if (this.state.navigateTo === "SendScreen" || this.state.navigateTo === "PostViewSend") {

    //   this.props.navigation.push('AnimalDetailsSend', {
    //     navigateTo: "SendAddCommentScreen",
    //     item: childelement,
    //     userToken: this.state.userToken,
    //     item_user: childelement.user_id._id,// a virer
    //     item_animal: childelement.animal_id._id,
    //     otherParam: 'anything you want here',// a virer
    //   })
    // }

  };

  let childsnode = null;

  if (childList) {
    const noImg = noImg;

    childsnode = childList.map(function (childelement) {

      if (childelement.answer === true && childelement.parentpost_id === data.item._id) {
        //console.log("get childelementAAA", childelement.animal_id._id)
        return (
          <View key={childelement._id} >
            <View style={{ justifyContent: 'center', borderBottomWidth: 0, borderTopWidth: 0, borderColor: "#c0c0c0", backgroundColor: "#FFF", alignContent: 'center', padding: 10, }}>


              <View style={{ borderWidth: 0, flex: 1 }}>
                <View style={{ paddingLeft: 20, borderWidth: 0, marginBottom: 10, flexDirection: 'row' }}>
                  {/* avatar */}
                  <TouchableOpacity style={styles.avatarPlaceholder}
                    onPress={() => navigatetoprofile(childelement)}>
                    {(childelement.animal_id.avatars.length === 0) &&
                      <View>{(noImg) &&
                        <Image source={noImg} style={[styles.avatarPlaceholder, { borderWidth: 1, }]} />
                      }
                      </View>
                    }
                    {(childelement.animal_id.avatars.length > 0) &&
                      <Image
                        source={{ uri: config.linkserver + childelement.animal_id._id + '/images/avatar/xsmall/' + childelement.animal_id._id + '.jpg' }}
                        size='small'
                        style={styles.avatar} />}
                  </TouchableOpacity>

                  <View style={{ flex: 1, flexDirection: "row", borderWidth: 0 }}>
                    <View>
                      <View style={{ flexDirection: "row", padding: 5, flex: 1, alignItems: "flex-start", justifyContent: 'flex-start', alignContent: "flex-start" }}>
                        <Text>
                          {answername(childelement)}{answer_(childelement)} {answerbodytext(childelement)}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", flex: 1, paddingTop: 5, paddingLeft: 5, }}>


                        <Text style={{}}>{FormDate(childelement.ldate)}</Text>
                        <TouchableOpacity
                          onPress={() => navigatetolikers(childelement)}>
                          <View style={{ paddingTop: 0, paddingLeft: 10, }}>
                            <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{childelement.favorites.length} {i18n.t('addComment.liked')}</Text>
                          </View>

                          {/* <View style={{paddingTop:5, paddingLeft:10,}}>
                            <Text style={[styles.TextStyle,{ flexDirection:"row",}]} >
                              {MyFonctions.whoLikersComment(childelement)}
                            </Text>
                          </View> */}
                        </TouchableOpacity>




                        {/* <TouchableOpacity
                          onPress={() => node_answerAddPost(childelement)}>
                          <View style={{ paddingTop: 0, marginLeft: 10 }}>
                              <Text>QQQQQQ</Text>
                            <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.answer')}</Text>
                          </View>
                        </TouchableOpacity> */}
                        {(childelement.animal_id._id === animalData._id) &&
                          <TouchableOpacity
                            onPress={() => node_deletePost(childelement)}>
                            <View style={{ paddingTop: 0, marginLeft: 10 }}>
                              <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.delete')}</Text>
                            </View>
                          </TouchableOpacity>
                        }

                      </View>
                      {/* <Text>{config.linkserver + childelement.animal_id._id + '/images/posts/' + childelement.image_id + '.jpg'}</Text> */}
                      
                      {(childelement.image_id !== null) &&
                       <TouchableOpacity
                      onPress={() => openSubImage(childelement)}
                    >
                      <Image
                        source={{ uri: config.linkserver + childelement.animal_id._id + '/images/posts/' + childelement.image_id + '.jpg' }}
                        resizeMode='cover'
                        style={{
                          marginLeft: 20,
                          marginTop: 10,
                          alignContent: "flex-end",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                          borderRadius: 8,
                          borderWidth: 0,
                          // borderColor:borderColor,
                          width: 200,
                          height: 150
                        }}
                      />
                      </TouchableOpacity>
                      }
                      <View>
                      </View>
                    </View>
                  </View>
                  <View style={{ borderWidth: 0, flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-start", alignContent: "flex-end", padding: 0, marginRight: 0 }}>

                    {/* {(childelement.user_id._id === user._id ) &&
                  <View style={{justifyContent:'center', top:-10}}>
                    <Feather style={{padding:10}} name="edit-2" size={15} color={Colors.greyH} onPress={() => node_modifyPost(childelement)}/>
                  </View>
                } */}

                    {/* {(childelement.user_id._id === user._id) &&
                <View style={{justifyContent:'center'}}>
                  <Ionicons style={{padding:10}} name="md-trash-outline" size={15} color={Colors.greyH} onPress={() => node_deletePost(childelement)}/>
                </View>
                } */}
                    {(childelement.animal_id._id !== animalData._id) &&
                      <View style={{ justifyContent: 'center' }}>
                        {node_heartIconDisplay(childelement)}
                      </View>
                    }
                    {/* {(childelement.user_id._id !== user._id) &&
                <View style={{justifyContent:'center'}}>
                 <AntDesign style={{padding:10}} name="message1" size={15} color={Colors.greyH} onPress={() => node_answerAddPost(childelement)}/>
                </View>
                } */}

                  </View>
                </View>
              </View>
            </View>
          </View>
        )
      }
    })

  }


  return (
    <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: "#c0c0c0", backgroundColor: "#FFF", alignContent: 'center', padding: 10, }}>
      <View style={{ paddingLeft: 0, borderWidth: 0, flex: 1, flexDirection: 'row' }}>
        <View style={{ borderWidth: 0, flex: 1 }}>


          <View style={{ flex: 1, flexDirection: "row", marginBottom: 20 }}>
            {/* avatar */}
            {(params.from === "Home" || params.from === "PostView" || params.from === "Notifications") &&
              <TouchableOpacity style={styles.avatarPlaceholder}
                onPress={() => navigation.navigate('AnimalDetails', {
                  navigateTo: "Home",
                  item: data.item,
                })}>
                {(data.item.animal_id.avatars.length === 0) &&
                  <View>
                    {(noImg) &&
                      <Image source={noImg} style={[styles.avatarPlaceholder, { borderWidth: 1, }]} />
                    }
                  </View>
                }
                {(data.item.animal_id.avatars.length > 0) &&
                  <Image
                    source={{ uri: config.linkserver + data.item.animal_id._id + '/images/avatar/xsmall/' + data.item.animal_id._id + '.jpg' }}
                    size='small'
                    style={styles.avatar} />}
              </TouchableOpacity>
            }
            {/* {(this.state.navigateTo === "SearchScreen" || this.state.navigateTo === "PostViewSearch" || this.state.navigateTo === "SearchScreenMap") &&
                    <TouchableOpacity style={styles.avatarPlaceholder}
                      onPress={() => this.props.navigation.push('AnimalDetailsSearch', {
                        navigateTo: "SearchScreen",
                        item: data.item,
                        userToken: this.state.userToken,
                        item_user: data.item.user_id._id,// a virer
                        item_animal: data.item.animal_id._id,// a virer
                        otherParam: 'anything you want here',// a virer
                      })}>
                      <Image
                        source={{ uri: config.linkserver + data.item.animal_id._id + '/images/avatar/xsmall/' + data.item.animal_id._id + '.jpg' }}
                        size='small'
                        style={styles.avatar} />
                    </TouchableOpacity>
    
                  } */}
            {/* {(this.state.navigateTo === "FavoriteScreen" || this.state.navigateTo === "PostViewFavorite") &&
                    <TouchableOpacity style={styles.avatarPlaceholder}
                      onPress={() => this.props.navigation.push('AnimalDetailsFavorite', {
                        navigateTo: "FavoriteScreen",
                        item: data.item,
                        userToken: this.state.userToken,
                        item_user: data.item.user_id._id,// a virer
                        item_animal: data.item.animal_id._id,// a virer
                        otherParam: 'anything you want here',// a virer
                      })}>
                      <Image
                        source={{ uri: config.linkserver + data.item.animal_id._id + '/images/avatar/xsmall/' + data.item.animal_id._id + '.jpg' }}
                        size='small'
                        style={styles.avatar} />
                    </TouchableOpacity>
    
                  } */}
            {/* {(this.state.navigateTo === "SendScreen" || this.state.navigateTo === "PostViewSend") &&
                    <TouchableOpacity style={styles.avatarPlaceholder}
                      onPress={() => this.props.navigation.push('AnimalDetailsSend', {
                        navigateTo: "SendAddCommentScreen",
                        item: data.item,
                        userToken: this.state.userToken,
                        item_user: data.item.user_id._id,// a virer
                        item_animal: data.item.animal_id._id,// a virer
                        otherParam: 'anything you want here',// a virer
                      })}>
                      <Image
                        source={{ uri: config.linkserver + data.item.animal_id._id + '/images/avatar/xsmall/' + data.item.animal_id._id + '.jpg' }}
                        size='small'
                        style={styles.avatar} />
                    </TouchableOpacity>
    
                  } */}
            {/* {(this.state.navigateTo === "user_comment") &&
                    <TouchableOpacity style={styles.avatarPlaceholder}
                      onPress={() => this.props.navigation.push('AnimalDetailsSend', {
                        navigateTo: "SendAddCommentScreen",
                        item: data.item,
                        userToken: this.state.userToken,
                        item_user: data.item.user_id._id,// a virer
                        item_animal: data.item.animal_id._id,// a virer
                        otherParam: 'anything you want here',// a virer
                      })}>
                      <Image
                        source={{ uri: config.linkserver + data.item.animal_id._id + '/images/avatar/xsmall/' + data.item.animal_id._id + '.jpg' }}
                        size='small'
                        style={styles.avatar} />
                    </TouchableOpacity>
    
                  } */}

            <View style={{ borderWidth: 0, flex: 1, flexDirection: "row", paddingLeft: 10 }}>
              <View>
                <Text style={{ fontWeight: 'bold', borderWidth: 0, fontSize: 13, textTransform: 'capitalize', justifyContent: 'center' }}>
                  {data.item.animal_name} {bodytext()}
                </Text>
                {(data.item && data.item.image_id !== null && data.item.image_id !== undefined && data.item.image_id) &&
                  <>
                    <TouchableOpacity
                      onPress={() => openImage()}
                    >
                      <Image
                        source={{ uri: config.linkserver + data.item.animal_id._id + '/images/posts/' + data.item.image_id + '.jpg' }}
                        resizeMode='cover'
                        style={{
                          justifyContent: "center",
                          borderRadius: 8,
                          borderWidth: 0,
                          padding: 10,
                          // borderColor:borderColor,
                          width: 'auto',
                          height: 150
                        }}
                      />
                    </TouchableOpacity>
                  </>
                }



                <View style={{ flexDirection: "row", flex: 1, paddingTop: 5, }}>
                  <Text style={{}}>{FormDate(data.item.ldate)}</Text>
                  <TouchableOpacity
                    onPress={() => navigatetolikers(data.item)}>
                    <View style={{ paddingTop: 0, marginLeft: 10 }}>
                      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{data.item.favorites.length} {i18n.t('addComment.liked')}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => answerAddPost(data.item)}>
                    <View style={{ paddingTop: 0, marginLeft: 10 }}>
                      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.answer')}</Text>
                    </View>
                  </TouchableOpacity>
                  {(data.item.animal_id._id === animalData._id) &&
                    <TouchableOpacity
                      onPress={() => deletePost(data.item._id)}>
                      <View style={{ paddingTop: 0, marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.delete')}</Text>
                      </View>
                    </TouchableOpacity>}
                </View>

                <View>

                </View>

              </View>

            </View>

          </View>
          {/*<View style={{paddingTop:10, }}>
                <Text style={{paddingLeft:0,fontSize:13,paddingRight:20, fontWeight:'normal'}}>
                {data.item.body}
              </Text>
              </View> */}

        </View>
        {(data.item.animal_id._id !== animalData._id) &&
          <View style={{ justifyContent: 'flex-start' }}>
            {heartIconDisplayItem(data.item)}
          </View>
        }

        {/* <View style={{borderWidth:0, flexDirection:"column", alignItems:"flex-end", justifyContent:"flex-end", alignContent:"flex-start",padding:0, marginRight:0 }}>
              
              {(data.item.animal_id._id === this.props.animal._id) &&
              <View style={{justifyContent:'center', top:-10}}>
                <Feather style={{padding:10,marginLeft:0}} name="edit-2" size={15} color={Colors.greyH} onPress={() => modifyPost(data.item)}/>
              </View>  }
            
              {(data.item.animal_id._id === this.props.animal._id) &&
              <View style={{justifyContent:'center',top:10}}>
                <Ionicons style={{padding:10, marginRight:0}} name="md-trash-outline" size={15} color={Colors.greyH} onPress={() => this.deletePost(data.item._id)}/>
              </View>
              }
              
              {(data.item.animal_id._id !== this.props.animal._id) &&
              <View style={{justifyContent:'flex-end'}}>
                {heartIconDisplayItem(data.item)}
              </View>
              }
            
              {(data.item.animal_id._id !== this.props.animal._id) &&
              <View style={{justifyContent:'center'}}>
                <AntDesign style={{padding:10, marginLeft:0}} name="message1" size={15} color={Colors.greyH} onPress={() => this.answerAddPost(data.item)}/>
              </View>
              }
    
            </View> */}

        <FullScreenVideo
          visible={isFullImage}
          onClose={closeImage}
          item={data.item}
        />

        <FullScreenSubImage
          animal_id={data.item.animal_id._id}
          visible={isFullSubImage}
          onClose={closeSubImage}
          item={subImageName}
          image_id={data.item.image_id}
        />

      </View>

      {childsnode}

    </View>
  )




};

const styles = StyleSheet.create({

  textInputComments: {
    minHeight: 30,
    paddingLeft: 10,
    flex: 1,
    fontSize: 13,
    marginTop: 5,
    padding: 5,
    justifyContent: 'flex-start',
    borderWidth: 0,
  },


  viewModalCamera: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      ios: {

        backgroundColor: 'rgba(0,0,0,0.8)',
        flex: 1,
        position: 'absolute',
        zIndex: 1,
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

  inner: {
    marginTop: 0,
    paddingBottom: 10,

    flex: 1,
    justifyContent: "space-around",


    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 20,
        justifyContent: "flex-end",
      },
      android: {
        paddingTop: 0,
        paddingBottom: 20,
        justifyContent: "flex-end",
      },
    }),

  },


  appButtonContainer: {
    // elevation: 8,
    // backgroundColor:Colors.red,
    minHeight: 35,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.greyH,
    borderRadius: 3,

  },
  appButtonText: {
    fontSize: 10,
    color: Colors.greyH,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },


  avatarPlaceholder: {
    width: 30,

    height: 30,
    borderRadius: 15,

    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {

    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,

    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#ccc',
    marginBottom: 25
  },

  cardImage: {
    justifyContent: "center",
    resizeMode: "cover",
    width: '100%',
    height: 350,

  },
  avatarPlaceholderCard: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    borderColor: Colors.greyH,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: 'center',
  },
  avatarCard: {
    width: 52,
    height: 52,
    borderRadius: 26,
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

});


export default ChildListing;
