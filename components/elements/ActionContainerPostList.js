import React from 'react';
import { View } from 'react-native';
import BookMarkPostList from './BookMarkPostList';
import LikePostList from './LikePostList';
import CommentPostList from './CommentPostList';
import MessagePostList from './MessagePostList';
import { useNavigation } from '@react-navigation/native';


const ActionContainerPostList = ({updatePostLike,  page, item, navigate, getAllPost, from }) => {

  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', marginBottom:10, }}>

      <CommentPostList
        navigate={navigation.navigate}
        item={item}
      />

      <LikePostList
        getAllPost={(page) => getAllPost(page)}
        item={item}
        page={page}
        updatePostLike={updatePostLike}
        
      />

      <MessagePostList
        navigate={navigation.navigate}
        item={item}
       
      />

      <BookMarkPostList
        getAllPost={() => getAllPost()}
        item={item}
      />

    </View>
  )
};

export default ActionContainerPostList