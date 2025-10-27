import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';


const MessagePostList = ({ item, navigate }) => {

  const goToMessage = (item) => {
    navigate('SharePost', {
      from: "Home",
      screen: 'SharePostScreen',
      sendPostData: item,
      item_message: item,
    })
  };

  return (
    <View>
      {(item.user_id.statusaccount === 1 || item.user_id.statusaccount === undefined) &&
        <TouchableOpacity style={{  alignItems: 'center', alignContent: "center", justifyContent:"center",  }}
          onPress={() => { goToMessage(item) }}>
          <Ionicons style={{ padding: 8, paddingLeft: 5, marginTop: -2 }} name="paper-plane-outline" size={27} color={Colors.greyH} />
        </TouchableOpacity>
      }
    </View>
  );
};


export default MessagePostList