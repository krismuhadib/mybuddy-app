import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native';
import BDiaryStyles from "../../assets/styles/forms"
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { FormatDateToNow } from '../../utils/helpers';

const config = require('../../config');
var noImg = require('../../assets/images/logo_avatar.png');

const ScreenWidth = Math.round(Dimensions.get('window').width);
const ScreenHeight = Math.round(Dimensions.get('window').height);

const RowLoversAvatar = ({ navigation, likersList, userId, animalId, }) => {

  const [skipNumber, setSkipNumber] = useState(0);

  console.log("RowLoversAvatar");
  
  const renderItem = ({ item, i }) => (

    <View key={i} style={{ padding: 5, borderWidth: 0, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity style={{ alignContent: "center", justifyContent: "center" }}
        onPress={() => navigation.navigate('LoveLikers', {
          from: "MatchScreen",
          reload: true,
          item: item,
        })}>
        {(item.avatars.length > 0) &&
          <Image
            source={{ uri: config.linkserver + item._id + '/images/avatar/small/' + item._id + '.jpg' }}
            size='small'
            style={styles.avatar}
          />
        }
        {(item.avatars.length === 0) &&
          <Image
            source={noImg}
            size='small'
            style={[styles.avatar, { borderWidth: 0 }]}
          />
        }

      </TouchableOpacity>
      <Text style={{ alignContent: "center", pading: 5, fontSize: 12, textAlign: "center", color: Colors.greyM, justifyContent: "center" }}>
        {config.textEllipsisNoCapitalize(item.name, 5)}
      </Text>
    </View>

  );

  return (

    <View >
      <FlatList
        style={{}}
        // scrollEnabled={true}
        // inverted={true}
        horizontal={true}
        data={likersList}
        //  onRefresh={() => this.onRefresh()}
        //  refreshing={this.state.isFetching}
        //extraData={this.state}
        renderItem={renderItem}
        keyExtractor={(item, i) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

});


export default RowLoversAvatar