import React, { useRef, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback, ScrollView, Platform, KeyboardAvoidingView, Keyboard, TextInput, FlatList, Image, StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../constants/Colors';
import BDiaryStyles from "../../../assets/styles/styles";
import { i18n } from "../../../constants/Localization";
import { SaveAnimal } from '../../../redux/slices/animalSlice';
import { Feather, Ionicons } from '@expo/vector-icons';
import moment from "moment";
import { useDispatch } from "react-redux";
import { ApiRoutes, Post, setToken, getToken, removeToken } from '../../../services/api';
import PinchableBox from '../../../components/elements/PinchableBox';
import DetailsBarSmall from '../../../components/elements/DetailsBarSmall';
import MyFonctions from '../../../components/MyFonctions';
import { FormDate } from '../../../utils/helpers';
import BuddyButton from '../../../components/elements/BuddyButton';

// Bug ScrollView
import { LogBox } from 'react-native'
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])


const noImg = require('../../../assets/images/logo_avatar.png');
const config = require('../../../config');
const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);


const EditPost = (route) => {

  const storeDispatch = useDispatch();

  const navigation = useNavigation();
  const params = route.route.params;

  // User Redux Store Data
  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  const textInputRef = useRef(null);

  const openKeyboard = () => {
    // Force le TextInput à se concentrer et donc à ouvrir le clavier
    textInputRef.current.focus();
  };

  const closeKeyboard = () => {
    // Ferme le clavier
    Keyboard.dismiss();
  };

  

  const [commentlength, setCommentlength] = useState(0);
  const [postList, setPostList] = useState([]);
  const [newpostUpdate, setNewpostUpdate] = useState([]);
  const [postListNumber, setPostListNumber] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [parentList, setParentList] = useState([]);
  const [childList, setChildList] = useState([]);
  const [placeholder, setPlaceholder] = useState(i18n.t('Page.Add_Comments'));
  const [postUpdate, setPostUpdate] = useState(params.postUpdate);
  const [favorite, setFavorite] = useState([]);
  const [count, setCount] = useState(0);
  const [bookmark, setBookmark] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [buttondisplay, setButtondisplay] = useState(true);
  const [autofocus, setAutofocus] = useState(false);
  const [text, setText] = useState("");
  const [postId, setPostId] = useState(null);
  const [answer, setAnswer] = useState(false);
  const [switcha, setSwitcha] = useState(0);
  const [answerName, setAnswerName] = useState("");
  const [answerId, setAnswerId] = useState("");
  const [display, setDisplay] = useState("none");
  const [parentPostId, setParentPostId] = useState("");
  const [newPlaceholder, setNewPlaceholder] = useState(i18n.t('Page.Add_Comments'));
  const [ifmodifydata, setIfmodifydata] = useState(false);
  const [comments, setComments] = useState("");

  console.log("AddComment")

  useEffect(() => {

    const getAllAddComments = () => {
      if (params.from !== "Notifications") {
        fetch(config.uri + 'addcomments/getallcomments', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            newcomment: true,
            user_id: userData._id,
            animal_id: animalData._id,
            token: userData._id,
            post_id: params.postUpdate._id
            // notificationtoken : this.props.user_id.notificationtoken,
            //addcommentsnumber: this.state.postListNumber,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              //var postList = res;
              //console.log("Addcomment getAllAddComments", res);
  
              setPostList(res.postList);
              setPostListNumber(res.postList.length);
              setIsFetching(false);
              setCommentlength(0);
  
              // this.setState({
              //   placeholder: i18n.t('Page.Add_Comments'),
              //  // postList: postList.postList,
              //   isLoading: false,
              //   postListNumber: postList.postListNumber,
              //   isFetching: false,
              //   commentlength: 0
              // });
              //console.log("Addcomment postlist", this.state.postList);
  
              let ParentListId = [];
              let ParentListA = [];
              let ChildListId = [];
              let ChildListA = [];
  
              // Create parentList from postList
              // First create ParentListId
              res.postList.forEach(function (item) {
                if (item.parentpost_id) {
                  ParentListId.push(item.parentpost_id);
                }
              });
              //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentListId);
  
              // Two create ParentList
              var mapping = res.postList.reverse().map(function (item) {
                if (!item.parentpost_id) {
                  ParentListA.push(item)
                  return item;
                }
  
              });
              //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentList);
              // Create ChildList from postList
              res.postList.map(function (item) {
                //console.log("search",item)
                if (item.parentpost_id) {
                  ChildListA.push(item)
                  return item;
                }
              });
  
              let childs = res.postList.find(function (child) {
                return child.answer === true
              });
              //console.log('-------------> ADDCOMMENTS - Create ChildList array :',this.state.postList);
              setParentList(ParentListA);
              setChildList(ChildListA)
              setPostList(ParentListA);
              setCommentlength(0);
              //setParentList
  
              // this.setState({
              //   //postList: ParentList,
              //   parentList: ParentList,
              //   childList: ChildList,
              //   commentlength: 0
  
              // });
  
              // console.log("PostList :PostListPostListPostListPostList",postList )
              //console.log("ParentList :",ParentList )
              //console.log("ChildList :",ChildList )
  
  
  
              //setTimeout(()=>{this.setState({isLoading: false})}, 1000);
  
            }
            else {
              // console.log('ca marche PASSSS RES ?',res.success, res.key);
              alert(i18n.t('Fetch_Error.Empty_Field'));
            }
          });
  
      } else {
  
        fetch(config.uri + 'addcomments/getallcomments', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken,
          },
          body: JSON.stringify({
            newcomment: true,
            user_id: this.props.user._id,
            animal_id: this.props.animal._id,
            token: this.props.token.token,
            post_id: postUpdate.post_id._id
            // notificationtoken : this.props.user_id.notificationtoken,
  
  
            //addcommentsnumber: this.state.postListNumber,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              var postList = res;
              this.setState({
                placeholder: i18n.t('Page.Comments'),
                postList: postList.postList,
                isLoading: false,
                postListNumber: postList.postListNumber,
                commentlength: 0,
              });
  
              //console.log("Addcomment postlist", this.state.postList);
  
              let ParentListId = [];
              let ParentList = [];
              let ChildListId = [];
              let ChildList = [];
  
              // Create parentList from postList
              // First create ParentListId
              this.state.postList.forEach(function (item) {
                if (item.parentpost_id) {
                  ParentListId.push(item.parentpost_id);
                }
              });
              //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentListId);
  
              // Second create ParentList
              var mapping = this.state.postList.reverse().map(function (item) {
  
                if (!item.parentpost_id) {
                  ParentList.push(item)
                  return item;
                }
  
              });
  
              //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentList);
              // Create ChildList from postList
              this.state.postList.map(function (item) {
                //console.log("search",item)
                if (item.parentpost_id) {
                  ChildList.push(item)
                  return item;
                }
              });
  
              let childs = this.state.postList.find(function (child) {
                return child.answer === true
              });
  
              //console.log('-------------> ADDCOMMENTS - Create ChildList array :',this.state.postList);
              this.setState({
                //postList: ParentList,
                parentList: ParentList,
                childList: ChildList,
                isFetching: false,
                commentlength: 0
              });
              // console.log("PostList :PostListPostListPostListPostList",postList )
              //console.log("ParentList :",ParentList )
              //onsole.log("ChildList :",ChildList )
              //setTimeout(()=>{this.setState({isLoading: false})}, 1000);
            }
            else {
              // console.log('ca marche PASSSS RES ?',res.success, res.key);
              alert(i18n.t('Fetch_Error.Empty_Field'));
            }
          });
      }
    };
    getAllAddComments();
  }, []);


  const getAllAddComments = () => {
    if (params.from !== "Notifications") {
      fetch(config.uri + 'addcomments/getallcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          newcomment: true,
          user_id: userData._id,
          animal_id: animalData._id,
          token: userData._id,
          post_id: params.postUpdate._id
          // notificationtoken : this.props.user_id.notificationtoken,
          //addcommentsnumber: this.state.postListNumber,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //var postList = res;
            console.log("Addcomment getAllAddComments", res);

            setPostList(res.postList);
            setPostListNumber(res.postList.postListNumber);
            setIsFetching(false);
            setCommentlength(0);
            setComments(' ');
            setText(' ');

            // this.setState({
            //   placeholder: i18n.t('Page.Add_Comments'),
            //  // postList: postList.postList,
            //   isLoading: false,
            //   postListNumber: postList.postListNumber,
            //   isFetching: false,
            //   commentlength: 0
            // });
            //console.log("Addcomment postlist", this.state.postList);

            let ParentListId = [];
            let ParentListA = [];
            let ChildListId = [];
            let ChildListA = [];

            // Create parentList from postList
            // First create ParentListId
            res.postList.forEach(function (item) {
              if (item.parentpost_id) {
                ParentListId.push(item.parentpost_id);
              }
            });
            //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentListId);

            // Two create ParentList
            var mapping = res.postList.reverse().map(function (item) {
              if (!item.parentpost_id) {
                ParentListA.push(item)
                return item;
              }

            });
            //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentList);
            // Create ChildList from postList
            res.postList.map(function (item) {
              //console.log("search",item)
              if (item.parentpost_id) {
                ChildListA.push(item)
                return item;
              }
            });

            let childs = res.postList.find(function (child) {
              return child.answer === true
            });
            //console.log('-------------> ADDCOMMENTS - Create ChildList array :',this.state.postList);
            setParentList(ParentListA);
            setChildList(ChildListA)
            setPostList(ParentListA);
            setCommentlength(0);
            //setParentList

            // this.setState({
            //   //postList: ParentList,
            //   parentList: ParentList,
            //   childList: ChildList,
            //   commentlength: 0

            // });

            // console.log("PostList :PostListPostListPostListPostList",postList )
            //console.log("ParentList :",ParentList )
            //console.log("ChildList :",ChildList )



            //setTimeout(()=>{this.setState({isLoading: false})}, 1000);

          }
          else {
            // console.log('ca marche PASSSS RES ?',res.success, res.key);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });

    } else {

      fetch(config.uri + 'addcomments/getallcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          newcomment: true,
          user_id: this.props.user._id,
          animal_id: this.props.animal._id,
          token: this.props.token.token,
          post_id: postUpdate.post_id._id
          // notificationtoken : this.props.user_id.notificationtoken,


          //addcommentsnumber: this.state.postListNumber,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            var postList = res;
            this.setState({
              placeholder: i18n.t('Page.Comments'),
              postList: postList.postList,
              isLoading: false,
              postListNumber: postList.postListNumber,
              commentlength: 0,
            });

            //console.log("Addcomment postlist", this.state.postList);

            let ParentListId = [];
            let ParentList = [];
            let ChildListId = [];
            let ChildList = [];

            // Create parentList from postList
            // First create ParentListId
            this.state.postList.forEach(function (item) {
              if (item.parentpost_id) {
                ParentListId.push(item.parentpost_id);
              }
            });
            //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentListId);

            // Second create ParentList
            var mapping = this.state.postList.reverse().map(function (item) {

              if (!item.parentpost_id) {
                ParentList.push(item)
                return item;
              }

            });

            //console.log('-------------> ADDCOMMENTS - Create ParentListId array :',ParentList);
            // Create ChildList from postList
            this.state.postList.map(function (item) {
              //console.log("search",item)
              if (item.parentpost_id) {
                ChildList.push(item)
                return item;
              }
            });

            let childs = this.state.postList.find(function (child) {
              return child.answer === true
            });

            //console.log('-------------> ADDCOMMENTS - Create ChildList array :',this.state.postList);
            this.setState({
              //postList: ParentList,
              parentList: ParentList,
              childList: ChildList,
              isFetching: false,
              commentlength: 0
            });
            // console.log("PostList :PostListPostListPostListPostList",postList )
            //console.log("ParentList :",ParentList )
            //onsole.log("ChildList :",ChildList )
            //setTimeout(()=>{this.setState({isLoading: false})}, 1000);
          }
          else {
            // console.log('ca marche PASSSS RES ?',res.success, res.key);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });
    }
  };


  const onRefresh = () => {
    Keyboard.dismiss();
    setIsFetching(false);
    getAllAddComments();

  };


  const heartIconDisplayCard = (item, i) => {
    var heartcolor = Colors.greyH;
    // setFavorite(item.favorites);
    //this.state.modalVisible = false;

    var count = item.favorites.length;
    if (count) {
      heartcolor = 'red';
    }
    // if (this.state.favorite.includes(item.favorites)) {
    //   heartcolor = 'red';
    // }
    return (
      <View key={i}>
        {(animalData) &&
          <View style={{ width: 50, flexDirection: 'row', height: 50, borderWidth: 0 }}>

            {/* <View style={[styles.animatedlike, {borderWidth:1}]}>
          <TouchableWithoutFeedback
          onPress={() =>{
           
            if (this.state.heartButton_on && !this.state.favorite.includes(item.favorites)) { 

              Animated.timing(this.state.progress, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
              }).start();
            }
            else {
              Animated.timing(this.state.progress, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
              }).start();
            };
            this.setState({
              heartButton_on: !this.state.heartButton_on
            });
            this.toggleFav(item)
          }}>
            <LottieView
            source={require('../../assets/animated/like-button.json')}
            loop= {false}
            progress={this.state.progress}/>
          </TouchableWithoutFeedback>
        </View> */}
            <TouchableOpacity
              onPress={() => toggleFavCard(item)}
              style={{}}
            >
              <Ionicons style={{ padding: 8 }}
                color={heartcolor}
                name={MyFonctions.isFavorite(animalData._id, item.favorites) ? 'heart' : 'heart-outline'}
                size={30} />
            </TouchableOpacity>
            {(item.favorites.length > 0) &&
              <Text style={{ color: Colors.greyH, justifyContent: 'center', fontSize: 12, paddingTop: 30, zIndex: 999, marginLeft: -10, }}>{count}</Text>
            }
          </View>
        }
      </View>
    );
  };


  const toggleFav = (item) => {

    // console.log("toggleFavtoggleFavtoggleFav item", item.favorites.length)
    //  this.setState({
    //    modalPostActionVisible: false,
 
    //    //likers : likers
    //  });
    //  this.setState(({ favorite, item }) => ({
    //    favorite: this.isFavorite(this.props.animal._id)
    //      ? favorite.filter(a => a !== this.props.animal._id)
    //      : [...favorite, this.props.animal._id]
    //  }));
 
     // create array for username
    //  this.setState(({ likers }) => ({
    //    likers: this.isFavorite(this.props.animal.name)
    //      ? likers.filter(a => a !== this.props.animal.name)
    //      : [...likers, this.props.animal.name]
    //  }));
 
     //console.log('le state favorite dans TOGGLEFAV', this.state.favorite)
 
     // Envoi du tableau array des favorites dans le backend pour un save mongo
     fetch(config.uri + 'addcomments/commentlikes', {
       //fetch('http://localhost:3000/users/favorites', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         //'x-access-token' : this.state.userToken,
       },
       body: JSON.stringify({
         language: i18n._locale,
         animal_id: animalData._id,
         post_id: item, // A verfiier
         favorites: animalData._id,
         likers: animalData.name,
       })
     })
       .then((response) => response.json())
       .then((res) => {
         if (res.success === true) {
 
           // Can't send notif if it's a post from animal_id
           if (animalData._id !== item.animal_id._id) {
             // Send only if create liker
             if (!item.likers.includes(animalData._id)) {
               //this.sendLikeNotifs(item);
             };
           };
 
           //let favorites = this.state.favorite;
           if (item.favorites.length) {
             var count = item.favorites.length;
 
 
           } else {
 
             count = 0;
 
           }
           // favorites[this.props.user._id] = res.favoris;
           //console.log("backend return res.favoris & favorites", res.favoris)

           setFavorite(res.favoris);
           setCount(count);





          //  this.setState({
          //    modalPostActionVisible: false,
          //    favorite: res.favoris,
          //    count: count,
          //    notiflike: res.notifinfo.like_comment,
          //    notiftitle: res.notifinfo.title,
          //    //likers : likers
          //  });
           //var userToken = res.key;
           //var newfavorite = res.favoris;
           //console.log('Ok pour le retour backendbackend favorite, usertoken ok et favoris :', userToken, newfavorite);
          //  if (!item.animal_id._id.includes(this.props.animal._id)) {
          //    this.SendNotifications(1,item);
          //  };
           // Refreshing ...
           getAllAddComments();
           //this.sendLikeNotifs(item);
         
         }
         else {
           console.log('ca marche PASSSS RES ?', res.success, res.userToken);
           alert(i18n.t('Fetch_Error.Empty_Field'));
         }
       });
   };

  const toggleFavCard = (item) => {


    //console.log("toggleFav, item ADDCOMMENTSEARCH", item)
    //console.log("this.props.animal._idthis.props.animal._idthis.props.animal._idthis.props.animal._id,", this.props.animal._id)
    // this.setState(({ favorite, item }) => ({
    //   favorite: MyFonctions.isFavorite(this.props.animal._id, this.state.favorite)
    //     ? favorite.filter(a => a !== this.props.animal._id)
    //     : [...favorite, this.props.animal._id]
    // }));

    // // create array for username
    // this.setState(({ likers }) => ({
    //   likers: MyFonctions.isFavorite(this.props.animal.name, this.state.favorite)
    //     ? likers.filter(a => a !== this.props.animal.name)
    //     : [...likers, this.props.animal.name]
    // }));

    // if (!MyFonctions.isFavorite(this.props.animal._id, this.state.favorite)) {
    //   this.setState({
    //     heartzooming: true,
    //   });
    // };

    // this.setState({
    //   heartzooming: false,

    // });
    // Send array of favorites & save to mongo
    fetch(config.uri + 'posts/likes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        post_id: postUpdate, // A verfiier
        favorites: animalData._id,
        likers: animalData._id,
        language: i18n._locale,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //console.log("POSTS likes res", res.notifinfo);
          // Sending Notifications rules
          // Send if its different user with differents animals
          // if (item.user_id._id !== this.props.user._id) {
          //   //console.log("Same USER ID");
          //   // Also, Can't send notif if it's a post from animal_id in user_id array
          //   if (this.props.animal._id !== item.animal_id._id) {
          //     // Send only if is not already liked
          //     if (!item.likers.includes(this.props.animal._id)) {
          //       this.sendLikeNotifs(item);
          //     };
          //   };
          // };

          //let favorites = this.state.favorite;
          var count = item.favorites.length;
          // favorites[this.props.user._id] = res.favoris;

          setFavorite(res.favoris);
          setCount(item.favorites.length);


          // this.setState({

          //   favorite: res.favoris,
          //   count: count,
          //   notiflike: res.notifinfo.like,
          //   notiftitle: res.notifinfo.title,
          //   heartzooming: true,
          //   //postUpdate: res,
          //   //likers : likers
          // });
          // // Send Notification
          // if (!item.animal_id._id.includes(this.props.animal._id)) {
          //   this.SendNotifications(0,item);
          // };



          getPost();
          //console.log("recuperation notifmassage res send ", res.notifinfo);
        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });
  };

  const getPost = async () => {

    fetch(config.uri + 'posts/getonepost', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        post_id: postUpdate._id

      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //var userToken = res.key;
          var postList = res;
          setPostList(res);
          setNewpostUpdate(res.postList);
          setPostUpdate(res.postList[0]);
          // console.log("res rees", res)
          //var userfavorites = res.userfavorites;
          //var favorites = res.favoris;

          //console.log("GETONE POST postListpostListpostList", postList.postList);

          // this.setState({

          //   newpostUpdate: postList.postList,
          //   // postUpdate:  postList.postList,
          //   // favorites: postList.postList.favorites,
          //   isLoading: false,
          //   modalVisible: false,
          //   modalSearchVisible: false,
          //   postUpdate: postList.postList[0],
          //   loadingrender: true,
          // });

          //console.log("GETONE POST newpostUpdatenewpostUpdatenewpostUpdate", this.state.newpostUpdate[0]);
        }
        else {
          console.log("No Posts")
          //alert(config.fetcherror.prbRes);
        }
      });

  };

  const bookmarkIconDisplay = (item, i) => {
    var bookmarktcolor = Colors.greyH;
    //setBookmark(item.bookmarks)
    // this.state.bookmark = item.bookmarks;
    // this.state.modalVisible = false;

    var count = item.bookmarks.length;
    if (count) {
      bookmarktcolor = 'red';
    }
    // if (bookmark.includes(item.bookmarks)) {
    //   bookmarktcolor = 'black';
    // }
    return (
      <View key={i}>
        {(animalData) &&
          <View style={{ width: 50, flexDirection: 'row', height: 50, borderWidth: 0 }}>

            {/* <View style={[styles.animatedlike, {borderWidth:1}]}>
          <TouchableWithoutFeedback
          onPress={() =>{
           
            if (this.state.heartButton_on && !this.state.favorite.includes(item.favorites)) { 

              Animated.timing(this.state.progress, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
              }).start();
            }
            else {
              Animated.timing(this.state.progress, {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
              }).start();
            };
            this.setState({
              heartButton_on: !this.state.heartButton_on
            });
            this.toggleFav(item)
          }}>
            <LottieView
            source={require('../../assets/animated/like-button.json')}
            loop= {false}
            progress={this.state.progress}/>
          </TouchableWithoutFeedback>
        </View> */}
            <TouchableOpacity
              style={{}}
              onPress={() => toggleBookmark(item)}
            >
              <Ionicons style={{ padding: 10 }}
                color={bookmarktcolor}
                name={MyFonctions.isBookmarked(animalData._id, item.bookmarks) ? 'pricetag' : 'pricetag-outline'}
                size={27}
              />
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  };

  const toggleBookmark = (item) => {
    //console.log("this.props.animal._idthis.props.animal._idthis.props.animal._idthis.props.animal._id,", this.props.animal._id)
    // this.setState(({ bookmark, item }) => ({
    //   bookmark: MyFonctions.isBookmarked(this.props.animal._id, this.state.bookmark)
    //     ? bookmark.filter(a => a !== this.props.animal._id)
    //     : [...bookmark, this.props.animal._id]
    // }));

    // create array for username
    // this.setState(({ likers }) => ({
    //   likers: MyFonctions.isBookmarked(this.props.animal.name, this.state.favorite)
    //     ? likers.filter(a => a !== this.props.animal.name)
    //     : [...likers, this.props.animal.name]
    // }));

    // if (!MyFonctions.isBookmarked(this.props.animal._id, this.state.bookmark)) {
    //   this.setState({
    //     heartzooming: true,

    //   });
    // }
    // this.setState({
    //   heartzooming: false,
    // });

    // Send array of favorites & save to mongo
    fetch(config.uri + 'posts/bookmarks', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        animal_id: animalData._id,
        post_id: item, // A verfiier
        bookmarks: animalData._id,
        //likers: this.props.animal._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //let favorites = this.state.favorite;
          var count = item.bookmarks.length;
          // favorites[this.props.user._id] = res.favoris;

          setBookmarks(res.favoris);


          // this.setState({
          //   bookmarks: res.favoris,
          //   count: count,
          //   //notiflike: res.notifinfo.like,
          //   //notiftitle: res.notifinfo.title,
          //   heartzooming: true,
          //   //likers : likers
          // });
          getPost();
          //console.log("recuperation notifmassage res send ", res.notifinfo);
          //this.sendLikeNotifs(item);

        }
        else {
          alert(i18n.t('Fetch_Error.prbRes'));
        }
      });
    // Refreshing ...
    // this.getAllPost();

  };

  const friendsButtonDisplay = (item, i) => {
    //console.log("FriendsButtonDisplay this.props.user._id.includes(item)", item, this.props.animal.friends, this.props.animal.friends.includes(this.state.item_animal))
    const AppButton = ({ onPress, title, iconame, bgcolor, txtcolor }) => (
      <TouchableOpacity onPress={onPress}
        style={[styles.appButtonContainer, { flexDirection: 'row', backgroundColor: bgcolor }]}>
        <Ionicons style={{ paddingRight: 0 }}
          color={Colors.red}
          name={iconame} size={20}
        />
        <Text style={{
          fontSize: 9,
          color: txtcolor,
          fontWeight: "bold",
          alignSelf: "center",
          textTransform: "uppercase"
        }}>{title}</Text>
      </TouchableOpacity>
    );

    if (buttondisplay === true && animalData.friends) {
      if (animalData.friends.includes(item.animal_id._id) === false) {
        //console.log("il sont copains", this.props.animal.friends, this.state.item.user_id._id);
        return (
          <View style={{ borderWidth: 0 }}>
            <View>
              <AppButton
                txtcolor={Colors.white}
                bgcolor={Colors.black}
                // iconame="ios-add-circle-outline"
                title={i18n.t('addComment.addFollower')}
                onPress={() => toggleFriends(item)} />
            </View>
          </View>);
      };

      if (animalData.friends.includes(item.animal_id._id) === true) {
        //console.log("il ne sont pas copains");
        return (
          <View style={{ borderWidth: 0 }}>
            <View>
              <AppButton
                txtcolor={Colors.black}
                bgcolor={Colors.white}
                //iconame="ios-close-circle-outline"
                title={i18n.t('addComment.removeFollower')}
                onPress={() => ButtonRemoveFriends(item.animal_id._id)} />
            </View>
          </View>
        )
      }
    };
  };

  const toggleFriends = (item) => {
    //let friend = [item.friends];

    //console.log("click clickclickclick friends", this.props.user._id, this.state.friend);
    // Envoi du tableau array des favorites dans le backend pour un save mongo
    fetch(config.uri + 'animals/addfriend', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        //user_id_animal: this.state.item.animal_id._id,
        animal_item_id: item.animal_id._id,
        animal_id: animalData._id,
        friend_id: item.animal_id._id, // A verfiier


      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {

          getUserAnimalDatas();

          //this.getAnimalDatas();
          //let favorites = this.state.favorite;
          //var count = item.friends.length;
          //friends[this.props.user._id] = res.friends;
          console.log("backend return res.favoris & favorites")
          //var userToken = res.key;
          //var newfavorite = res.favoris;
          //console.log('Ok pour le retour backendbackend friends :',this.state.friends);

          // Refreshing ...
          //this.getAnimalDoc();

        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Les infos User/Password sont mal remplies');
        }
      });

  };

  const getUserAnimalDatas = async () => {
    console.log("getUserAnimalDatasgetUserAnimalDatasgetUserAnimalDatas")

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

          console.log("ressss", res)

          storeDispatch(SaveAnimal(res.animaldoc));

          //this.getAnimalDatas();

          /*  if (res.friends === null && res.friends === "0") {
             console.log("NULALALALALA");
             this.setState({
               friends: [this.props.user._id],
               modalVisible: false,
 
             })
            
           } */
          // creation animal Doc object :
          // var Animaldoc = {
          //   _id: res._id,
          //   name: res.name,
          //   typeof: res.typeof,
          //   user_id: res.user_id,
          //   genre: res.genre,
          //   age: res.age,
          //   breed: res.breed,
          //   sterilisation: res.sterilisation,
          //   height: res.height,
          //   weight: res.weight,
          //   player: res.player,
          //   dynamic: res.dynamic,
          //   animalfood: res.animalfood,
          //   typehouse: res.typehouse,
          //   description: res.description,
          //   animallof: res.animallof,
          //   wantchild: res.wantchild,
          //   sociability: res.sociability,
          //   latitude: res.latitude,
          //   longitude: res.longitude,
          //   latitudeDelta: res.latitudeDelta,
          //   longitudeDelta: res.longitudeDelta,
          //   friends: res.friends,
          //   groups: res.groups,
          //   avatars: res.avatars,
          //   carouselstatut: res.carouselstatut,
          //   swap_distance: res.swap_distance,
          //   allow_international: res.allow_international,
          //   allow_notifs: res.allow_notifs,
          //   allow_geoloc: res.allow_geoloc,
          //   allow_loveswap: res.allow_loveswap,
          //   lovegenre: res.lovegenre,
          //   lovetypeof: res.lovetypeof,
          //   lovebreed: res.lovebreed,
          //   bday: res.bday,
          //   bmonth: res.bmonth,
          //   byear: res.byear,
          //   typeofname: res.typeofname,
          //   breedname: res.breedname,
          //   followers: res.followers,


          // };

          // if (!res.friends) {
          //   var Animaldoc = {
          //     _id: res._id,
          //     name: res.name,
          //     typeof: res.typeof,
          //     user_id: res.user_id,
          //     genre: res.genre,
          //     age: res.age,
          //     breed: res.breed,
          //     sterilisation: res.sterilisation,
          //     height: res.height,
          //     weight: res.weight,
          //     player: res.player,
          //     dynamic: res.dynamic,
          //     animalfood: res.animalfood,
          //     typehouse: res.typehouse,
          //     description: res.description,
          //     animallof: res.animallof,
          //     wantchild: res.wantchild,
          //     sociability: res.sociability,
          //     latitude: res.latitude,
          //     longitude: res.longitude,
          //     latitudeDelta: res.latitudeDelta,
          //     longitudeDelta: res.longitudeDelta,
          //     friends: res.friends,
          //     groups: res.groups,
          //     avatars: res.avatars,
          //     carouselstatut: res.carouselstatut,
          //     swap_distance: res.swap_distance,
          //     allow_international: res.allow_international,
          //     allow_notifs: res.allow_notifs,
          //     allow_geoloc: res.allow_geoloc,
          //     allow_loveswap: res.allow_loveswap,
          //     lovegenre: res.lovegenre,
          //     lovetypeof: res.lovetypeof,
          //     lovebreed: res.lovebreed,
          //     bday: res.bday,
          //     bmonth: res.bmonth,
          //     byear: res.byear,
          //     typeofname: res.typeofname,
          //     breedname: res.breedname,
          //     followers: res.followers,
          //   };

          // }
          // console.log("USERSCREEN / ANIMAL ID FIRST :", this.state.animal_id);
          // Save AnimalDoc in local storage
          //AsyncStorage.setItem('animalDetails', JSON.stringify(Animaldoc));
          //console.log ("USERCREEN USERCREEN USERCREEN USERCREEN USERCREEN / Save OK -> localstorage / animalDoc",Animaldoc)
          // Save UserDoc in  Redux storage
          //this.props.doAnimalDoc(JSON.parse(JSON.stringify(Animaldoc)));
          //dispatch(doAnimalDoc(Animaldoc))

          // THECOUNTS ..
          // Fonction de check a exporter ...
          //console.log("MyFonctionsMyFonctionsMyFonctionsMyFonctions", MyFonctions.ucfirst("tototo"));

          /* if (!this.props.animal.avatars[0] && this.props.animal) {
            this.props.navigation.navigate('AddPicturesScreen');
            alert(i18n.t('Fetch_Error.No_Animal_profile'));
          }; */


        } else {
          console.log('ca marche PASSSS RES ?', res.success);

          // Il n'y a pas de fiche animal
          // go to petprofile


        }
      });

  };

  const ButtonRemoveFriends = (item) => {

    //console.log("remove friend button item", item)
    //console.log("click clickclickclick friends", this.props.user._id, this.state.friend);
    // Envoi du tableau array des favorites dans le backend pour un save mongo
    fetch(config.uri + 'animals/deletefriend', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'x-access-token' : this.state.userToken,
      },
      body: JSON.stringify({
        //user_id_animal: this.state.item.animal_id._id,
        animal_id: animalData._id,
        user_id: userData._id,
        friend_id: item,
        animal_item_id: item,
        // post_id: this.state.item.user_id._id, // A verfiier
        //friends: this.props.user._id,
      })
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success === true) {
          //this.getAnimalDatas();
          getUserAnimalDatas();

          //let favorites = this.state.favorite;
          //var count = item.friends.length;
          //friends[this.props.user._id] = res.friends;
          //console.log("backend return res.favoris & favorites", res.favoris)
          //var userToken = res.key;
          //var newfavorite = res.favoris;
          //console.log('Ok pour le retour backendbackend friends :',this.state.friends);

          // Refreshing ...
          //this.getAnimalDoc();
          // this.getAllFriends();
        }
        else {
          console.log('ca marche PASSSS RES ?', res.success, res.userToken);
          alert('Les infos User/Password sont mal remplies');
        }
      });

  };

  const postText = () => {
    //count = this.state;
    //var bodytext = data.item.body
    return (
      <Text style={[BDiaryStyles.postText, {width: ScreenWidth - 20,}]}>{postUpdate.comment}</Text>
    );
  };



  const answerAddPostUpdate = (item) => {
    // var value = itemmodify.item;
    console.log('answerAddPost ITEM', item)

    setNewPlaceholder(i18n.t('Page.Add_Comments'));
    setPlaceholder(i18n.t('Page.Add_Comments'));
    setText('');
    setAutofocus(true);
    setPostId(postUpdate._id);
    //setAutofocus(false);
    setAnswer(false);
    setParentPostId("");
    setSwitcha(0);
    openKeyboard();
    //setAnswerName(item.animal_id.name);
    //setAnswerId(item.animal_id._id);








    // this.setState({
    //   modalPostActionVisible: false,
    //   newplaceholder: i18n.t('Page.Add_Comments'),
    //   placeholder: i18n.t('Page.Add_Comments'),
    //   text: '',
    //   post_id: this.state.postUpdate._id,
    //   autofocus: true,
    //   answer: false,
    //   parentPost_Id: "",
    //   switch: 0,
    //   answer_name: item.animal_id.name,
    //   answer_id: item.animal_id._id,
    // });
    // this.myTextInput.focus()
    //console.log("answerAddPostUpdateanswerAddPostUpdate", this.state.answer_name)

  };

  const inputValidate = (text, type) => {
    // this.setState({
    //   modalPostActionVisible: false
    // });
    var err = 0;
    var errors = [];
    if (type == 'comment') {
      //commentlength = text.length;
      setCommentlength(text.length);
      setIfmodifydata(true);

      setComments(text);
      setCommentlength(text.length);

      //   this.setState({ commentlength: commentlength, commentValidate: true, err: 0, ifmodifydata: true })
      //   this.state.comments = text;
      //   this.state.commentlength = commentlength;
      // }
    }
  };

  const addComments = () => {

    // this.setState({
    //   commentlength: 0,
    // });
    // is it a child comment ?

    // console.log("addComments this.state.postUpdatethis.state.postUpdatethis.state.postUpdate", this.state.postUpdate);
    // console.log("whoanswer? ", this.state.whoanswer_animalname);

    var tutus = postUpdate

    //this.SendNotifications(2,tutus);

    if (params.from !== "Notifications") {

      // Envoi du tableau array des favorites dans le backend pour un save mongo
      fetch(config.uri + 'addcomments/addcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          language: i18n._locale,
          post_id: postUpdate._id,
          parentpost_id: parentPostId,
          user_id: userData._id,
          body: comments,
          answer: answer,
          addcommentsnumber: postListNumber + 1,
          notificationtoken: userData._id,
          animal_name: animalData.name,
          animal_id: animalData._id,
          answer_name: answerName,
          answer_id: answerId,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //console.log("ADDCOMMENTS RES", res)
            setNewPlaceholder(i18n.t('Page.Add_Comments'));
            setPlaceholder(i18n.t('Page.Add_Comments'));
            setComments(' ');
            setText(' ');
            setCommentlength(0);
            setAutofocus(false);
            Keyboard.dismiss();
            getAllAddComments();

            //this.myTextInput.focus();
            // this.setState({
            //   text: ' ',
            //   notiflike: res.notifinfo.like_comment,
            //   notifcomment: res.notifinfo.add_comment,
            //   notiftitle: res.notifinfo.title,
            //   newplaceholder: i18n.t('Page.Add_Comments'),
            //   placeholder: i18n.t('Page.Add_Comments'),
            //   commentlength: 0,
            // });
            //this.sendAddCommentNotifs();

            setTimeout(() => {
              // this.setState({
              //   text: this.props.text,
              //   newplaceholder: i18n.t('Page.Add_Comments'),
              //   placeholder: i18n.t('Page.Add_Comments'),
              //   autoFocus: true,

              //   //likers : likers
              // });
            //  Keyboard.dismiss();
             // setText(" ");
              //getAllAddComments();

              //onRefresh();
            }, 0)
            //var userToken = res.key;
            //var newfavorite = res.favoris;
            //console.log('Ok pour le retour backendbackend favorite, usertoken ok et favoris :', userToken, newfavorite);

            // Refreshing ...
            //this.getAllPost();
          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });
    } else {

      fetch(config.uri + 'addcomments/addcomments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          language: i18n._locale,
          post_id: this.state.postUpdate.post_id._id,
          parentpost_id: this.state.parentPost_Id,
          user_id: this.props.user._id,
          body: this.state.comments,
          answer: this.state.answer,
          addcommentsnumber: this.state.postListNumber + 1,
          notificationtoken: this.state.notificationtoken,
          animal_name: this.props.animal.name,
          animal_id: this.props.animal._id,
          answer_name: this.state.answer_name,
          answer_id: this.state.answer_id,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
            //console.log("res addcomments", res)

            //let favorites = this.state.favorite;
            //var count = item.favorites.length;
            // favorites[this.props.user._id] = res.favoris;
            //console.log("backend return res.favoris & favorites", res.favoris)

            this.setState({
              // value : "res.favoris",
              //count : count,
              text: ' ',
              notiflike: res.notifinfo.like_comment,
              notifcomment: res.notifinfo.add_comment,
              notiftitle: res.notifinfo.title,
              newplaceholder: i18n.t('Page.Add_Comments'),
              placeholder: i18n.t('Page.Add_Comments'),
              commentlength: 0,

              //likers : likers
            });
            //this.sendAddCommentNotifs();
            this.getAllAddComments();

            setTimeout(() => {
              this.setState({
                // value : "res.favoris",
                //count : count,
                text: this.props.text,
                newplaceholder: i18n.t('Page.Add_Comments'),
                placeholder: i18n.t('Page.Add_Comments'),

                //likers : likers
              });
              Keyboard.dismiss();
              onRefresh();
            }, 0)
            //var userToken = res.key;
            //var newfavorite = res.favoris;
            //console.log('Ok pour le retour backendbackend favorite, usertoken ok et favoris :', userToken, newfavorite);

            // Refreshing ...
            //this.getAllPost();

          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert(i18n.t('Fetch_Error.Empty_Field'));
          }
        });
    }

  };

  const deletePost = item => {
    var itemdelete = { item };
    var value = itemdelete.item;
    openModal();

    setPostId(itemdelete.item);
    setParentPostId(postUpdate._id);
    



    // this.setState({
    //   // modalPostActionVisible: true,
    //   postId: itemdelete.item,
    //   parentPostId: this.state.postUpdate._id,
    //   title: "dddd",
    //   //titleFetch: "ggggg",
    //   //coloredIcons: false,
    // });
    // console.log('deletePost post id', item)
  };

  const openModal = () => {
    setDisplay("flex");
    //this.setState({ display: 'flex' })
  };


  const renderItem = (data, item) => {


    const openKeyboard = () => {
      // Force le TextInput à se concentrer et donc à ouvrir le clavier
      textInputRef.current.focus();
    };

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
      setText(" ");
      setAnswer(true);
      setParentPostId(data._id);
      setAnswerId(data.animal_id._id);
      setAnswerName(data.animal_id.name);
      setSwitcha(0);
      //setAutofocus(true);
      openKeyboard();

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
      setText(" ");
      setPostId(childelement.item);
      setAnswer(true);
      setSwitcha(0);
      setAnswerName(childelement.animal_id.name);
      setAnswerId(childelement.animal_id._id);
      openKeyboard();

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

    const token = userData._id;

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

    commmenttoggleFav = (item) => { // Irst comment

      //console.log("commmenttoggleFav  item",item, this.state.postUpdate._id)
      // this.setState({
      //   modalPostActionVisible: false,
  
      //   //likers : likers
      // });
      // this.setState(({ favorite, item }) => ({
      //   favorite: this.isFavorite(this.props.animal._id)
      //     ? favorite.filter(a => a !== this.props.animal._id)
      //     : [...favorite, this.props.animal._id]
      // }));
  
      // create array for username
      // this.setState(({ likers }) => ({
      //   likers: this.isFavorite(this.props.animal.name)
      //     ? likers.filter(a => a !== this.props.animal.name)
      //     : [...likers, this.props.animal.name]
      // }));
  
      //console.log('le state favorite dans TOGGLEFAV', this.state.favorite)
  
      // Envoi du tableau array des favorites dans le backend pour un save mongo
      fetch(config.uri + 'addcomments/commentlikes', {
        //fetch('http://localhost:3000/users/favorites', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'x-access-token' : this.state.userToken,
        },
        body: JSON.stringify({
          language: i18n._locale,
          parentpost_id: postUpdate._id,
          animal_id: animalData._id,
          post_id: item, // A verfiier
          favorites: animalData._id,
          likers: animalData.name,
        })
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.success === true) {
  
            // Can't send notif if it's a post from animal_id
            if (animalData._id !== item.animal_id._id) {
              // Send only if create liker
              if (!item.likers.includes(animalData._id)) {
               //this.sendLikeNotifs(item);
              };
            };
  
            //let favorites = this.state.favorite;
            var count = item.favorites.length;
            // favorites[this.props.user._id] = res.favoris;
            //console.log("backend return res.favoris & favorites", res.favoris)

            setFavorite(res.favoris);
            setCount(count);





            // this.setState({
            //   modalPostActionVisible: false,
            //   favorite: res.favoris,
            //   count: count,
            //   notiflike: res.notifinfo.like_comment,
            //   notiftitle: res.notifinfo.title,
            //   //likers : likers
            // });
            //var userToken = res.key;
            //var newfavorite = res.favoris;
            //console.log('Ok pour le retour backendbackend favorite, usertoken ok et favoris :', userToken, newfavorite);
            // if (!item.animal_id._id.includes(this.props.animal._id)) {
            //   this.SendNotifications(1,item);
            // };
            // Refreshing ...
            getAllAddComments();
            //this.sendLikeNotifs(item);
            //this.sendPushLikesNotification(item)
          }
          else {
            console.log('ca marche PASSSS RES ?', res.success, res.userToken);
            alert(i18n.t('Fetch_Error.Emsssspty_Field'));
          }
        });
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
        <TouchableOpacity
          onPress={() => navigation.push('AnimalDetails', {
            navigateTo: "Home",
            item: childelement,
            userToken: this.state.userToken,
            item_user: childelement.user_id._id,// a virer
            item_animal: childelement.answer_id,// a virer
            otherParam: 'anything you want here',// a virer
          })}>
          <Text style={{ fontWeight: 'normal', top: 3, color: Colors.skin, fontSize: 14, paddingLeft: 0, paddingRight: 0, textTransform: 'lowercase', justifyContent: 'center' }}>
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


    const { animal } = animalData;
    const { user } = userData;

    // const { childList } = childList;

    const navigatetolikers = (childelement) => {
      // console.log("navigatetolikers childelement", childelement);

      if (params.from === "Home" || params.from === "PostView" || params.from === "Notifications" || params.from === "NotificationsComments") {
        navigation.navigate('CommentLikersScreen', {
          navigateTo: "Home",
          item: childelement,
          userToken: userData._id,
          item_user: childelement.user_id._id,// a virer
          item_animal: childelement.animal_id._id,
          otherParam: 'anything you want here',// a virer
        })

      };

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



    var newChildlist = [childList];

    //console.log("childList.answer",childList._id)
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
                          <TouchableOpacity
                            onPress={() => node_answerAddPost(childelement)}>
                            <View style={{ paddingTop: 0, marginLeft: 10 }}>
                              <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.answer')}</Text>
                            </View>
                          </TouchableOpacity>
                          {(childelement.animal_id._id === animalData._id) &&
                            <TouchableOpacity
                              onPress={() => node_deletePost(childelement)}>
                              <View style={{ paddingTop: 0, marginLeft: 10 }}>
                                <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.delete')}</Text>
                              </View>
                            </TouchableOpacity>
                          }
                        </View>
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
                  onPress={() => this.props.navigation.push('AnimalDetails', {
                    navigateTo: "Home",
                    item: data.item,
                    userToken: this.state.userToken,
                    item_user: data.item.user_id._id,// a virer
                    item_animal: data.item.animal_id._id,// a virer
                    otherParam: 'anything you want here',// a virer
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
        </View>

        {childsnode}

      </View>
    )
  };
  
 const onCloseModal = () => {
    setDisplay("none")
  };

  const GoToDeletePost = () => {
    fetch(config.uri + 'addcomments/deleteuseraddcomment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: userData._id,
        post_id: postId,
        parentpost_id: postUpdate._id,
        addcommentsnumber: postListNumber - 1,
        user_id: userData._id
      })
    })
      .then((response) => response.json())
      .then((res) => {

        if (res.success === true) {

          answerAddPostUpdate();
         // setParentList([]);
          getAllAddComments();

          //var keypassword = res.key;
          //var user = res;

          //console.log("postId xcwxcwxcxwc", res)

          setComments(' ');
          closeKeyboard();

          setDisplay("none");

        }
        else {

          alert(i18n.t('Fetch_Error.Empty_Field'));
        }

      })



  };

  const testHeader =() => {

    return (
      <View>
        <Text>pppppp</Text>
      </View>
    )


  };

  return (
    <View style={{ flex: 1 }}>

        
       

    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 90 : 0}
      style={BDiaryStyles.container}>
        

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
           <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.inner}>

            <View style={{ borderWidth: 0 }}>

              <View style={{ backgroundColor: '#fff', height: 80, justifyContent: 'center', zIndex: -1 }}>
                <View style={{ flexDirection: 'row', backgroundColor: "#fff", }}>

                  <View style={{ borderWidth: 0, justifyContent: 'center', paddingLeft: 10 }}>

                    {(postUpdate.user_id.statusaccount === undefined || postUpdate.user_id.statusaccount === 0) &&
                      <View style={[styles.avatarPlaceholder]} >
                        {(!postUpdate.animal_id.avatars[0]) &&
                          <Image source={noImg} style={[styles.avatar, { borderWidth: 0 }]} />
                        }

                        {(postUpdate.animal_id.avatars.length) &&
                          <TouchableOpacity style={styles.avatarPlaceholder}
                            onPress={() => navigation.navigate('NoUserScreen', {
                              navigateTo: "Home",
                              item: postUpdate,
                              userToken: userData._id,
                              item_user: postUpdate.user_id._id,// a virer
                              item_animal: postUpdate.animal_id,// a virer
                              otherParam: 'anything you want here',// a virer
                            })}>
                            <Image
                              source={{ uri: config.linkserver + postUpdate.animal_id._id + '/images/avatar/small/' + postUpdate.animal_id._id + '.jpg' }}
                              size='small'
                              style={styles.avatar}
                            />
                          </TouchableOpacity>

                        }

                      </View>
                    }

                    {(postUpdate.user_id.statusaccount !== undefined && postUpdate.user_id.statusaccount === 1) &&
                      <View >

                        {(!postUpdate.animal_id.avatars[0]) &&
                          <TouchableOpacity style={styles.avatarPlaceholderCard}
                            onPress={() => navigation.navigate('AnimalDetails', {
                              navigateTo: "Home",
                              item: postUpdate,
                              userToken: userData._id,
                              item_user: postUpdate.user_id._id,// a virer
                              item_animal: postUpdate.animal_id._id,// a virer
                              otherParam: 'anything you want here',// a virer
                            })}>
                            <Image source={noImg} style={[styles.avatarCard, { borderWidth: 1 }]} />
                          </TouchableOpacity>
                        }

                        {(postUpdate.animal_id.avatars[0]) &&

                          <TouchableOpacity style={styles.avatarPlaceholderCard}
                            onPress={() => navigation.navigate('AnimalDetails', {
                              navigateTo: "Home",
                              item: postUpdate,
                              userToken: userData._id,
                              item_user: postUpdate.user_id._id,// a virer
                              item_animal: postUpdate.animal_id._id,// a virer
                              otherParam: 'anything you want here',// a virer
                            })}>

                            <Image
                              source={{ uri: config.linkserver + postUpdate.animal_id._id + '/images/avatar/small/' + postUpdate.animal_id._id + '.jpg' }}
                              size='small'
                              style={styles.avatarCard}
                            />
                          </TouchableOpacity>

                        }

                      </View>
                    }


                  </View>
                  {/*  <WallRow
                item = {item}
                data={postList}
                /> */}

                  <View style={{ flexDirection: 'column', justifyContent: 'center', borderWidth: 0, flex: 1, alignItems: 'flex-start', padding: 10 }}>
                    <View style={{ justifyContent: 'center', }}>

                      <Text style={{ textTransform: 'capitalize', color: Colors.black, fontWeight: '600', fontSize: 18 }}>{postUpdate.animal_id.name}</Text>
                    </View>

                    {/* {(postUpdate.user_id.statusaccount === undefined || postUpdate.user_id.statusaccount === 0) &&
                          <TouchableOpacity
                            style={[styles.bloc_Row, {
                              backgroundColor: "#ffffff",
                              marginTop: 0, justifyContent: 'flex-start', marginRight: 5
                            }]}
                            onPress={() => this.props.navigation.navigate('NoUserScreen', {
                              navigateTo: "Home",
                              item: postUpdate,
                              userToken: userData._id,
                              item_user: postUpdate.user_id._id,// a virer
                              item_animal: postUpdate.animal_id,// a virer 
                              otherParam: 'anything you want here',// a virer
                            })}>
                            <View style={{ borderWidth: 0 }}>
                              <DetailsBarSmall
                                item={postUpdate}
                                token={ userData._id}
                              />
                            </View>
                          </TouchableOpacity>
                        } */}

                    {(postUpdate.user_id.statusaccount === undefined || postUpdate.user_id.statusaccount === 1) &&
                      <TouchableOpacity
                        style={[styles.bloc_Row, {
                          backgroundColor: "#ffffff",
                          marginTop: 0, justifyContent: 'flex-start', marginRight: 5
                        }]}
                        onPress={() => navigation.navigate('AnimalDetails', {
                          navigateTo: "Home",
                          item: postUpdate,
                          userToken: userData._id,
                          item_user: postUpdate.user_id._id,// a virer
                          item_animal: postUpdate.animal_id._id,// a virer
                          otherParam: 'anything you want here',// a virer
                        })}>
                        <View style={{ borderWidth: 0 }}>
                          <DetailsBarSmall
                            postData={postUpdate}
                            token={userData._id}
                          />

                        </View>
                      </TouchableOpacity>
                    }
                  </View>
                  <View style={{ alignContent: "center", justifyContent: "center", paddingRight: 10 }}>
                    <TouchableOpacity style={{
                      paddingRight: 15,
                      alignContent: 'flex-end',
                      borderWidth: 0,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                      onPress={() => { this.setmodalVisible(postUpdate) }}
                    >
                      <Feather name="more-horizontal" size={25} color={Colors.greyH} />
                    </TouchableOpacity>
                  </View>

                </View>
              </View>

              <View style={{ zIndex: 1000, height: 350 }}>

                {(postUpdate.video_id !== null && postUpdate.image_id === null) &&
                  <DisplayVideoComment
                    islooping={islooping}
                    ismuted={false}
                    item={this.state.postUpdate} />
                }

                {(postUpdate.image_id !== null && postUpdate.video_id === null) &&


                  <PinchableBox imageUri={config.linkserver + postUpdate.animal_id._id + '/images/posts/' + postUpdate.image_id + '.jpg'}
                    item={postUpdate}
                    style={[styles.cardImage1, { zIndex: 2 }]}
                  />
                }

              </View>

              <View>

                <View style={{ backgroundColor: "#FFF", flexDirection: 'row', height: 50, borderWidth: 0, position: "relative", zIndex: -1, }}>

                  <View style={{ zIndex: 0, }}>
                    {heartIconDisplayCard(postUpdate, 0)}
                  </View>

                  <TouchableOpacity style={{ justifyContent: 'center' }}
                    onPress={() => { SendMessage(postUpdate) }}
                  >
                    <Ionicons style={{ padding: 5, marginTop: 0 }} name="paper-plane-outline" size={28} color={Colors.greyH} />
                  </TouchableOpacity>

                  <View style={{ justifyContent: "center" }}>
                    {bookmarkIconDisplay(postUpdate, 0)}
                  </View>

                  <View style={{ zIndex: 0, flex: 1, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "center" }}>
                    {/* FRIENDS & MESSAGES */}
                    {(animalData._id !== postUpdate.animal_id._id) &&
                      <View style={{ borderWidth: 0, flexDirection: "row", alignItems: "flex-end", alignContent: "flex-end", justifyContent: "center", padding: 10, }}>
                        <View style={{ padding: 5, borderWidth: 0, }}>
                          {friendsButtonDisplay(postUpdate, 0)}
                        </View>
                      </View>}
                  </View>
                </View>

              </View>


              <View style={{ borderBottomWidth: 1, borderColor: "#c0c0c0", alignContent:"flex-start", alignItems:"flex-start", justifyContent: "flex-start", borderWidth: 0, backgroundColor: "#FFF", alignContent: 'center', padding: 10, }}>
               
                  {/* avatar */}





                  <View style={{ flex: 1 }}>
                    
                      {postText()}
                    
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
                    {/* {(this.state.postUpdate.animal_id._id !== this.props.animal._id) &&
            <View style={{justifyContent:'center'}}>
              {this.heartIconDisplay(this.state.postUpdate)}
            </View>
            } */}
                    {/* {(childelement.user_id._id !== user._id) &&
            <View style={{justifyContent:'center'}}>
             <AntDesign style={{padding:10}} name="message1" size={15} color={Colors.greyH} onPress={() => node_answerAddPost(childelement)}/>
            </View>
            } */}

                  </View>
                

                <View style={{ flexDirection: "row", paddingTop: 15, }}>
                  <View style={{ paddingLeft: 10, }}>
                    <Text style={{ fontWeight: 'normal', fontSize: 10, color: "#c0c0c0" }}>
                      {FormDate(postUpdate.ldate)}
                    </Text>
                  </View>


                  {(params.from === "Notifications") &&
                    <View style={{ paddingTop: 0, paddingLeft: 10, flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => navigatetoLikers(postUpdate)}>
                        <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postUpdate.post_id.favorites.length} {i18n.t('addComment.liked')}</Text>
                      </TouchableOpacity>
                      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postListNumber} {i18n.t('addComment.commentary')}</Text>
                      <TouchableOpacity
                        onPress={() => answerAddPostUpdate(postUpdate.post_id)}>
                        <View style={{ paddingTop: 0, marginLeft: 10 }}>
                          <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.addComments')}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                  }


                  {(params.from === "NotificationsComments") &&

                    <View style={{ paddingTop: 0, paddingLeft: 10, flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => navigatetoLikers(postUpdate)}>
                        <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postUpdate.animal_id.favorites.length} {i18n.t('addComment.liked')}</Text>
                      </TouchableOpacity>
                      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>    {postListNumber} {i18n.t('addComment.commentary')}</Text>
                      <TouchableOpacity
                        onPress={() => answerAddPostUpdate(postUpdate.animal_id)}>
                        <View style={{ paddingTop: 0, marginLeft: 10 }}>
                          <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.addComments')}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                  }

                  {(params.from !== "Notifications") &&
                    <View style={{ paddingTop: 0, paddingLeft: 10, flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => navigatetoLikers(postUpdate)}>
                        <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>{postUpdate.favorites.length} {i18n.t('addComment.liked')}</Text>
                      </TouchableOpacity>
                      <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}>    {postListNumber} {i18n.t('addComment.commentary')}</Text>
                      <TouchableOpacity
                        onPress={() => answerAddPostUpdate(postUpdate)}>
                        <View style={{ paddingTop: 0, marginLeft: 10 }}>
                          <Text style={{ fontWeight: 'normal', fontSize: 10, color: Colors.greyM }}> {i18n.t('addComment.addComments')}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  }


                </View>

              </View>

            </View>

            <FlatList
            showsVerticalScrollIndicator={false}
            styles={{flex:1, height:300}}
            scrollEnabled={false}
            inverted={true}
            
            ListHeaderComponent={testHeader}
              data={parentList}
              onRefresh={() => onRefresh()}
              refreshing={isFetching}
              // extraData={this.state}
              renderItem={(item)=> renderItem(item)}
              keyExtractor={(item) => item._id}
            />
  </View>
  
  </ScrollView>

</TouchableWithoutFeedback>


            
        
          
   
      

      {(switcha === 0) &&
       

          <View style={{ flexDirection: 'row', position:"relative",justifyContent: "center", alignContent: "center", borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: "#f4f4f4", padding: 10, }}>

            <View style={{ flex: 1, padding: 0, flexDirection: "row", borderWidth: 1, top: 0, borderColor: "#ccc", borderRadius: 8, backgroundColor:"#FFF" }}>

              <TextInput
                style={styles.textInputComments}
                //defaultValue={text}
                value={comments}
                keyboardType="default"
                multiline
                // numberOfLines={8}
                //autoCorrect={true}
                autoFocus={autofocus}
                placeholder={placeholder}
                autoCapitalize='none'
                autoCorrect={false}
                caretHidden={false}
                onChangeText={(text) => inputValidate(text, 'comment')}
                ref={textInputRef}
              />


              {(switcha === 0) &&
                <View>
                  {(commentlength > 0) &&
                    <View>
                      <TouchableOpacity onPress={() => addComments()} style={{}} >
                        <Ionicons

                          name="paper-plane-outline"
                          size={20}
                          color={Colors.greyH}
                          //color='rgba(233, 233, 233, 0.9)'
                          style={{ borderWidth: 0, alignContent: "center", padding: 5, paddingTop: 10, marginRight: 10, alignItems: "center", justifyContent: "center" }}></Ionicons>



                        {/* <Text style={{  paddingLeft: 10, paddingTop: 10, bottom: 0, fontWeight: "bold", color: Colors.greyH }}>{i18n.t('Page.Publish')}</Text> */}
                      </TouchableOpacity>
                    </View>
                  }
                </View>
              }
              {(switcha === 1) &&
                <TouchableOpacity style={{ borderWidth: 1, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", paddingBottom: 0, }} >
                  <Text style={{ padding: 0, bottom: 0, fontWeight: "bold", color: Colors.greyH }} onPress={() => this.modifyComments()}>{i18n.t('addComment.modify')}</Text>
                </TouchableOpacity>
              }
            </View>
          </View>

  
      }

      {(switcha === 1) &&
        <View style={{}}>



          <View style={{ flexDirection: 'row', justifyContent: "center", alignContent: "center", borderBottomWidth: 1, borderTopWidth: 0, borderColor: '#ccc', backgroundColor: "#f4f4f4", padding: 10, }}>

            <View style={{ flex: 1, padding: 10, borderWidth: 1, top: 0, borderColor: "#ccc", borderRadius: 8, backgroundColor:"#FFF"}}>

              <TextInput
              style={styles.textInputComments}
              //defaultValue={text}
              value={text}
                keyboardType="default"
                multiline
                numberOfLines={12}
                ref={textInputRef}
                //autoCorrect={true}
                autoFocus={autofocus}
                placeholder={placeholder}
                autoCapitalize='none'
                autoCorrect={false}
                //caretHidden={false}
                onChangeText={(text) => inputValidate(text, 'comment')}
              />

            </View>

            {(switcha === 0) &&
              <TouchableOpacity onPress={() => addComments()} style={{ borderWidth: 0, alignContent: "flex-start", alignItems: "flex-start", justifyContent: "flex-start", paddingBottom: 20, }} >
                <Text style={{ padding: 10, fontWeight: "bold", color: Colors.greyH }}>{i18n.t('addComment.publish')}</Text>
              </TouchableOpacity>
            }
            {(switcha === 1) &&
              <TouchableOpacity onPress={() => modifyComments()}
                style={{ borderWidth: 0, alignContent: "flex-end", alignItems: "flex-start", justifyContent: "flex-start", paddingBottom: 20, }} >
                <Text style={{ padding: 10, fontWeight: "bold", color: Colors.greyH }} >{i18n.t('addComment.modify')}</Text>
              </TouchableOpacity>
            }

          </View>
        </View>
      }

{/* Modal */}
          {/* Fond gris de la modal */}
          <View style={[styles.viewModalCamera, { display: display }]}>
            <View style={[styles.modalSecurityStyle]}>
              <View style={{ top: 10 }}>

                <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                  <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.black, fontSize: 20, fontWeight: 'bold' }}>{i18n.t('Modal.Warning')}</Text>
                </View>

                <View style={{ backgroundColor: "white", height: 40, justifyContent: 'center', }}>
                  <Text style={{ justifyContent: 'center', textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'normal' }}>{i18n.t('Modal.Warning_comment_message')}</Text>
                </View>



                <View style={{ flexDirection: 'row', alignContent: "space-around" }}>

                  <View style={{ borderWidth: 0, flex: 1 }}>
                    <TouchableOpacity onPress={onCloseModal}>
                      <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Cancel')}</Text>
                    </TouchableOpacity>
                  </View>



                  <View style={{ borderWidth: 0, flex: 1 }}>
                    <TouchableOpacity onPress={() => GoToDeletePost()}>

                      <Text style={{ marginVertical: 20, textAlign: 'center', color: Colors.greyM, fontSize: 15, fontWeight: 'bold', alignItems: 'center', justifyContent: "center", }}>{i18n.t('Form.Delete')}</Text>
                    </TouchableOpacity>
                  </View>




                </View>




              </View>
            </View>



          </View>
          </KeyboardAvoidingView>
    </View>
  );
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



export default EditPost;


