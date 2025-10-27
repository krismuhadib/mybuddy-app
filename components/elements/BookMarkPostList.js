import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { i18n } from "../../constants/Localization";
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import MyFonctions from '../MyFonctions';
const config = require('../../config');


const BookMarkPostList = ({ getAllPost, item }) => {

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);
  const [bookmark, setBookmark] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [count, setCount] = useState(0);


  const toggleBookmark = (item) => {
    // console.log("this.props.animal._idthis.props.animal._idthis.props.animal._idthis.props.animal._id,", this.props.animal._id)
    // this.setState(({ bookmark, item }) => ({
    //   bookmark: MyFonctions.isBookmarked(animalData._id, bookmark)
    //     ? bookmark.filter(a => a !== this.props.animal._id)
    //     : [...bookmark, this.props.animal._id]
    // }));

    //     setBookmark( MyFonctions.isBookmarked(animalData._id, bookmark)
    //     ? bookmark.filter(a => a !== animalData._id)
    //     : [...bookmark, animalData._id]
    // )

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
        //'x-access-token' : userData._id,
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
          setBookmark(res.favoris);
          setCount(count);

          // favorites[this.props.user._id] = res.favoris;
          // this.setState({

          //   bookmarks: res.favoris,
          //   count: count,
          //   //notiflike: res.notifinfo.like,
          //   //notiftitle: res.notifinfo.title,
          //   heartzooming: true,
          //   //likers : likers
          // });
          getAllPost();
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

  const bookmarkIconDisplay = (item, i) => {
    var bookmarktcolor = Colors.greyH;
    //setBookmark(item.bookmarks);
    // setModalVisible(false);

    var count = item.bookmarks.length;
    if (count) {
      bookmarktcolor = Colors.greyH;
    }
    if (bookmark.includes(item.bookmarks)) {
      bookmarktcolor = 'red';
      // Animated.timing(this.state.progress, {
      //   toValue: 1,
      //   duration: 1000,
      //   easing: EasingNode.linear,
      //   useNativeDriver: true
      // }).start();
    }
    return (
      <View key={i}>
        {(animalData) &&
          <View style={{ width: 50, flexDirection: 'row', height: 50, borderWidth: 0 }}>
            <TouchableOpacity
              style={{}}
              onPress={() => toggleBookmark(item)}>
              <Ionicons style={{ padding: 10 }}
                color={bookmarktcolor}
                name={MyFonctions.isBookmarked(animalData._id, item.bookmarks) ? 'pricetag' : 'pricetag-outline'}
                size={27} />
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  };

  return (
    <View style={{ zIndex: 0, flex: 1, alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end" }}>
      {(item.user_id.statusaccount === 1 || item.user_id.statusaccount === undefined) &&
        <View style={{  alignContent: "flex-end", alignItems: "flex-end", justifyContent: "flex-end" }}>
          {bookmarkIconDisplay(item)}
        </View>}
    </View>
  );
};


export default BookMarkPostList