import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Colors from '../../constants/Colors';
import { useSelector } from 'react-redux';
import { i18n } from "../../constants/Localization";
import { AntDesign } from '@expo/vector-icons';

var config = require('../../config.js');


const SignalmentRowItem = ({ from, navigation, item, title, animal_id, signalmentnbr }) => {

  console.log("SignalmentRowItem  from", from)

  const userData = useSelector((state) => state.user.value);
  const animalData = useSelector((state) => state.animal.value);

  const saveSignalment = async () => {

    if (item._id) {
     
      if (from !== 'Map') {
        fetch(config.uri + 'posts/savepostsignalment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken
          },
          body: JSON.stringify({
            post_id: item._id,
            signalmentnbr: signalmentnbr,
            animal_id: animalData._id,
            post_body: item.comment,
            post_picture: item.image_id,
            post_animal: item.animal_id._id,
            post_userid: item.user_id._id,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              navigation.navigate("Home", {
              });
            }
            else {
              console.log(config.fetcherror.prbToken);
            }

          })

      }

     
      if (from === 'Map') {
        fetch(config.uri + 'markers/savemarkersignalment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'x-access-token' : this.state.userToken
          },
          body: JSON.stringify({
            marker_id: item._id,
            signalmentnbr: signalmentnbr,
            marker_title: item.title,
            user_id: userData._id,
            animal_id: animalData._id,
            marker_body: item.body,
            marker_animal: item.animal_id._id,
            marker_userid: item.user_id._id,
          })
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.success === true) {
              navigation.navigate("Map", {
                reload: true
              });
            }
            else {
              console.log(config.fetcherror.prbToken);
            }

          })

      }



    } else {
      return;
    }
  };



  return (
    <View style={{ flex: 1, borderWidth: 0 }}>
      <TouchableOpacity style={styles.rowlist} onPress={() => saveSignalment()}>

        <View>
          <Text style={styles.rowtext}>{i18n.t(title)}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={[styles.rowicon, { borderWidth: 0, marginRight: 20, alignItems: 'flex-end', }]}>
            <AntDesign name="right" size={20} color="gray" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },

  rowlist: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderTopColor: '#ccc',
    opacity: 0.9,
    borderBottomWidth: 1,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowtext: {
    marginLeft: 20,
    fontFamily: 'Roboto-Regular',
    color: Colors.hardgray,
    //fontWeight:'bold',
    fontSize: 16,
    textAlign: 'left',
    //justifyContent: 'center'
  },
  rowicon: {
    marginLeft: 30
  }
});

export default SignalmentRowItem