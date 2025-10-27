import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { i18n } from "../../constants/Localization";

const FollowerListDetails = ({ followersCount, navigate, item }) => {

  const gotoFollowersScreen = (item) => {
    navigate('FollowerList', {
      from: "Home",
      item: item,
      animal_name: item.name,
      // userToken: this.state.userToken,
      item_user: item.user_id._id,// a virer
      item_animal: item._id,
    })
  };

  return (
    <View>
      <TouchableOpacity style={{ borderWidth: 0, flexDirection: "row", paddingLeft: 15, }}
        onPress={() => { gotoFollowersScreen(item) }}>
        <Text style={{ fontWeight: "bold", fontSize: 12, color: Colors.greyH }}>{followersCount}</Text>
        <Text style={{ fontWeight: "normal", fontSize: 12, color: Colors.greyM }}> {i18n.t('animalDetails.followers')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowerListDetails