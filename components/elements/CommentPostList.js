import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import MyFonctions from '../MyFonctions';

const CommentPostList = ({ item, navigate }) => {

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  const goAddComment = (item) => {

    navigate('AddComment', {
      from: "Home",
      navigateTo: "Home",
      screen: 'AddComment',
      postUpdate: item,
      newcomment: true,
    })
  };

  return (
    <View>
      {(item.user_id.statusaccount === 1 || item.user_id.statusaccount === undefined) &&
        <TouchableOpacity style={{ }} onPress={() => { goAddComment(item) }}>
          {MyFonctions.nbrComments(item, userData._id)}
        </TouchableOpacity>
      }
    </View>
  );
};


export default CommentPostList