import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AnimalPostNumbDetails from './AnimalPostNumbDetails';
import FriendListDetails from './FriendListDetails';
import FollowerListDetails from './FollowerListDetails';

const BuddysContainerDetails = ({ item, postCount, friendsCount, followersCount }) => {

  const navigation = useNavigation();
  

  return (
    <View style={{ flexDirection: 'row', borderWidth: 0}}>

      <AnimalPostNumbDetails
        item={item}
        postCount={postCount}
      />

      <FriendListDetails
        navigate={navigation.navigate}
        friendsCount={friendsCount}
        item={item}
      />

      <FollowerListDetails
        navigate={navigation.navigate}
        followersCount={followersCount}
        item={item}
      />

    </View>
  );
};

export default BuddysContainerDetails